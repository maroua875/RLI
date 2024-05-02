function requestFrame() {
    const form = document.getElementById("crcForm");
    const senderId = form.elements["id"].value;
    const data = form.elements["data"].value;
  
    const startOfFrame = "1"; // Start of Frame delimiter
    const idSection = decimalToBinary(senderId).padStart(11, '0') + "0"; // Adding RTR (Remote Transmission Request) bit
    const commandSection = "00" + DLC(data); // R0, R1, size of data
    const dataSection = data.padStart(Math.ceil(data.length/4)*4, '0'); // Placeholder for data section

    let frame = startOfFrame + idSection + commandSection + dataSection;

    const { result } = calculateCRC(frame, "1001");
    
    const crcSection = result.padStart(15, '0'); // Calculated CRC value
    const ackSection = "01"; // Placeholder for acknowledgment section
    const endOfFrame = "1111111"; // End of Frame delimiter
    
    frame += crcSection + ackSection + endOfFrame;
    
    let tableHTML = `
    <style>
        /* CSS styles for the horizontal table with borders */
        table.horizontal-table {
            border-collapse: collapse;
            width: 100%;
        }
        table.horizontal-table td, table.horizontal-table th {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        table.horizontal-table th {
            background-color: #f2f2f2;
        }
    </style>
    <table class="horizontal-table">
        <tr>
            <th>Start of Frame</th>
            <th>ID Section (RTR)</th>
            <th>Command Section</th>
            <th>Data Section</th>
            <th>CRC Section</th>
            <th>Ack Section</th>
            <th>End of Frame</th>
        </tr>
        <tr>
            <td>${startOfFrame}</td>
            <td>${idSection}</td>
            <td>${commandSection}</td>
            <td>${dataSection}</td>
            <td>${crcSection}</td>
            <td>${ackSection}</td>
            <td>${endOfFrame}</td>
        </tr>
    </table>
`;

const resultDiv = document.getElementById("result");
resultDiv.innerHTML = `The sent frame is : <br>${tableHTML}<br>${bitStuffing(frame)}<br>`;
  }

  function bitStuffing(frame) {
    const MAX_REPEAT_COUNT = 5; // Maximum number of repeated 0s or 1s to trigger bit stuffing
  
    let stuffedFrame = '';
    let repeatCount = 0;
    let previousBit = null;
  
    for (let bit of frame) {
      if (bit === previousBit) {
        repeatCount++;
      } else {
        repeatCount = 1;
      }
      stuffedFrame += bit;
  
      if (repeatCount === MAX_REPEAT_COUNT) {
        const stuffingBit = bit === '0' ? '1' : '0';
        stuffedFrame += `<span style="color: red" class="stuffed-bit">${stuffingBit}</span>`;
        repeatCount = 0;
      }
  
      previousBit = bit;
    }
  
    return `<p>stuffed Frame : ${stuffedFrame}</p>`;
  }


function responseFrame() {
    const resiverId = "6";
    const data = "10001101001";
  
    const startOfFrame = "1"; // Start of Frame delimiter
    const idSection = decimalToBinary(resiverId).padStart(11, '0') + "0"; // Adding RTR (Remote Transmission Request) bit
    const commandSection = "00" + DLC(data); // R0, R1, size of data
    const dataSection = data.padStart(Math.ceil(data.length/4)*4, '0'); // Placeholder for data section

    let frame = startOfFrame + idSection + commandSection + dataSection;

    const { result } = calculateCRC(frame, "1001");
    
    const crcSection = result.padStart(15, '0'); // Calculated CRC value
    const ackSection = "01"; // Placeholder for acknowledgment section
    const endOfFrame = "1111111"; // End of Frame delimiter
    
    frame += crcSection + ackSection + endOfFrame;
    let tableHTML = `
    <style>
        /* CSS styles for the horizontal table with borders */
        table.horizontal-table {
            border-collapse: collapse;
            width: 100%;
        }
        table.horizontal-table td, table.horizontal-table th {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        table.horizontal-table th {
            background-color: #f2f2f2;
        }
    </style>
    <table class="horizontal-table">
        <tr>
            <th>Start of Frame</th>
            <th>ID Section (RTR)</th>
            <th>Command Section</th>
            <th>Data Section</th>
            <th>CRC Section</th>
            <th>Ack Section</th>
            <th>End of Frame</th>
        </tr>
        <tr>
            <td>${startOfFrame}</td>
            <td>${idSection}</td>
            <td>${commandSection}</td>
            <td>${dataSection}</td>
            <td>${crcSection}</td>
            <td>${ackSection}</td>
            <td>${endOfFrame}</td>
        </tr>
    </table>
`
    
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML += `The sent frame is : <br>${tableHTML}<br>${bitStuffing(frame)}<br>`;
}

const form = document.getElementById("crcForm");
form.addEventListener("submit", function(event) {
    event.preventDefault();
    requestFrame();
    responseFrame();
});

function decimalToBinary(decimalNumber) { 
    let binary = ""; 
    for (; decimalNumber > 0; decimalNumber >>= 1) { 
        binary = (decimalNumber & 1) + binary; 
    } 
    return binary || "0"; 
} 

function DLC (number) {
    const number2 = Math.ceil(number.length/4)
    return number2.toString(2);
}




function calculateCRC(binaryData, polynomial) {
    let dataWithZeros = binaryData + "0".repeat(polynomial.length - 1);
    let dataBits = dataWithZeros.split("").map(Number);
    let polyBits = polynomial.split("").map(Number);
    
    let xorSteps = []; 

    for (let i = 0; i < binaryData.length; i++) {
        if (dataBits[i] === 1) {
            xorSteps.push(dataBits.slice(i).join("") + " : " + polynomial);
            let step = dataBits.slice(i).join("") + " : " + polynomial + "<br>";
            step += " ".repeat(step.indexOf(":") + 1) + polynomial + "<br>";
            step += "-".repeat(polynomial.length + 2) + "<br>";
            xorSteps.push(step);
            for (let j = 0; j < polyBits.length; j++) {
                dataBits[i + j] ^= polyBits[j];
            }
            xorSteps.push(dataBits.join(""));
        }
    }

    let resultCRC = dataBits.slice(-polynomial.length + 1).join("");

    return { result: resultCRC };
}