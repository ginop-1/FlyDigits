function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
    
    // callback function when the scanner returns a result
    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            lastResult = decodedText;
            console.log(`Scan result = ${decodedText}`, decodedResult);
            // hide "qr-reader" element
            document.getElementById("qr-reader").style.display = "none";
            // test
            console.log(resultContainer);
            // Optional: To close the QR code scannign after the result is found
            results_html = document.getElementById("qr-reader-results");
            _html5QrcodeScanner.clear();
            results_html.innerHTML += `<h1>ID found: ${decodedText}</h1>`;
            results_html.innerHTML += `<h1 id="loading">Loading 3D model...</h1>`;
            // Sample fetch request to the REST API
            fetch(`http://localhost:3000/api/qr?${decodedText}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json()).then(data => {
                console.log('Success:', data);

                // TODO: do things here
            }).catch((error) => {
                console.error('Error:', error);
            });
            // TODO: remove
            sleep(1000).then(() => {
                // redirect to 3dmodel page
                // window.location.replace(`3dmodel.html?${decodedText}`);
                window.location.replace(decodedText);
            });
        }
    }
    
    // Optional callback for error, can be ignored.
    function onScanError(qrCodeError) {}
    
    _html5QrcodeScanner.render(onScanSuccess, onScanError);
});
