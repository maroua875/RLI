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

    let resultCRC = binaryData + dataBits.slice(-polynomial.length + 1).join("");

    return { result: resultCRC, steps: xorSteps, errorDetected: resultCRC === '0'.repeat(polynomial.length - 1) };
}

function displayCRCResult() {
    const form = document.getElementById("crcForm");
    const binaryData = form.elements["binaryData"].value;
    const polynomial = form.elements["polynomial"].value;
    
    const { result, steps, errorDetected } = calculateCRC(binaryData, polynomial); 
    const resultDiv = document.getElementById("result");

    
    let stepsDisplay = steps.join("<br>");

    resultDiv.innerHTML = `The result is : ${result}<br><br>Steps:<br>${stepsDisplay}<br><br>`;
    
}

const form = document.getElementById("crcForm");
form.addEventListener("submit", function(event) {
    event.preventDefault();
    displayCRCResult();
});
