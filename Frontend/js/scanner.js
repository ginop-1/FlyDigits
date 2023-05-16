import QrScanner from "../js/qr-scanner.min.js";

const video = document.getElementById('qr-video');
const flashToggle = document.getElementById('flash-toggle');
const camToggle = document.getElementById('camera-toggle');

let camList = [];
let currentCam = 0;
let flashState = false; // false = off, true = on

function setResult(label, qrResult) {
    scanner.stop();
    let server_ip = "flydigitsforfermi.hopto.org" // TODO: move to config file
    console.log("result: ", qrResult);
    // make http request to server
    let url = "https://" + server_ip + "/sensor/?modelname=" + qrResult.data;
    fetch(url, {
        "headers": {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
            "Origin": "https:\/\/" + server_ip,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
            "Access-Control-Allow-Credentials": "true"
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "error") {
                scanner.start();
                alert("Error: " + data.motivation);
                return;
            }
            // data.modelName = qrResult.data;
            localStorage.setItem("result", JSON.stringify(data));
            window.location.href = "3dmodel.html";
        })
        .catch(error => {
            console.log(error);
            alert("Error: " + error);
            scanner.start();
        });
}

// ####### Web Cam Scanning #######

const scanner = new QrScanner(video, result => setResult(null, result), {
    onDecodeError: error => { },
    highlightScanRegion: true,
    highlightCodeOutline: true,
});

const updateFlashAvailability = () => {
    scanner.hasFlash().then(hasFlash => {
        flashToggle.style.display = hasFlash ? 'inline-block' : 'inline-block';
    });
};

scanner.start().then(() => {
    updateFlashAvailability();
    // List cameras after the scanner started to avoid listCamera's stream and the scanner's stream being requested
    // at the same time which can result in listCamera's unconstrained stream also being offered to the scanner.
    // Note that we can also start the scanner after listCameras, we just have it this way around in the demo to
    // start the scanner earlier.
    QrScanner.listCameras(true).then(cameras => cameras.forEach(camera => {
        camList.push({ label: camera.label, id: camera.id });
    })).then(QrScanner.setCamera(camList[0].id).then(updateFlashAvailability));
});

// for debugging
window.scanner = scanner;

camToggle.addEventListener('click', event => {
    console.log(camList, currentCam);
    currentCam = (currentCam + 1) % camList.length;
    scanner.setCamera(camList[currentCam].id).then(() => {
        // console.log(`Using camera: ${scanner.getActiveCamera().label}`);
        updateFlashAvailability();
    });
});

flashToggle.addEventListener('click', () => {
    scanner.toggleFlash()
    flashState = !flashState;
    if (flashState === true) {
        flashToggle.classList.add("active");
    } else {
        flashToggle.classList.remove("active");
    }
});