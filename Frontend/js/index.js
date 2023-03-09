// console.log("Using AFRAME", AFRAME.version);
// console.log("Using ZapparAFrame", ZapparAFrame);

// window.addEventListener("load", setup);

// function setup() {
//     // When the user taps on the placement UI
//     const placementUI = document.getElementById("zappar-placement-ui");
//     placementUI.addEventListener("click", () => {
//         // Set placement-mode to false on the instant tracker group
//         const instantGroup = document.getElementById("instant-group");
//         instantGroup.setAttribute("zappar-instant", "placement-mode: false");

//         // Remove the placement UI
//         placementUI.remove();
//         }
//     );
// }

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function() {
    var resultContainer = document.getElementById('qr-reader-results');
    var lastResult = 0;
    
    var _html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 15, qrbox: 350 });
    
    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            lastResult = decodedText;
            console.log(`Scan result = ${decodedText}`, decodedResult);
            // hide "qr-reader" element
            document.getElementById("qr-reader").style.display = "none";
            // test
            // document.getElementById("qr-reader-results").innerHTML += `<h1 class=\"results\">${decodedText}</h1>` 
            console.log(resultContainer);
            // Optional: To close the QR code scannign after the result is found
            _html5QrcodeScanner.clear();
            document.getElementById("qr-reader-results").innerHTML += `<h1>Waiting server response...</h1>`
            // TODO: send decodedText to the REST API and wait for the response
            
        }
    }
    
    // Optional callback for error, can be ignored.
    function onScanError(qrCodeError) {
        // This callback would be called in case of qr code scan error or setup error.
        // You can avoid this callback completely, as it can be very verbose in nature.
    }
    
    _html5QrcodeScanner.render(onScanSuccess, onScanError);
});
