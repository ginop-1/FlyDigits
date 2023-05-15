console.log("Using AFrame", AFRAME.version);
console.log("Using ZapparAFrame", ZapparAFrame);

window.addEventListener("load", setup);
const result = JSON.parse(localStorage.getItem("result"));
result.index = 1;

/* JSON RESULT IS BUILT AS FOLLOWS:
    [
        "modelName": "name",
        [
            {
                "sensorName": "name",
                "type": "type",
                "unit": "unit", 
                "measurements": [
                    [value, timestamp],
                    [value, timestamp],
                    ...,
                ]
            },
        ]
    ] */

function changeSensor(index) {
    console.log("changeSensor", index);
    result.index += index;
    if (result.index <= 0) {
        result.index = result.length - 1;
    }
    if (result.index >= result.length) {
        result.index = 1;
    }
    const valuesGroup = document.getElementById("values-group");
    valuesGroup.innerHTML = "";
    generate3dTextList(valuesGroup);
}

function generate3dTextElement(coordinates, value, id) {
    return `<a-entity position="${coordinates}" scale="0.25 0.25 1" text-geometry="value: ${value}" material="color: green" id="${id}"></a-entity>`;
}

function generate3dTextList(valuesGroup) {
    // add modelname 3d text + arrows
    valuesGroup.innerHTML += `
    <a-entity position="-1 0.6 0.1" scale="0.5 0.5 1" text-geometry="value: ${result[0].modelName}" material="color: red" id="model-name-3dtext"></a-entity>
    `;

    var index = result.index;

    if (result[index].measurements.length === 0) {
        return;
    }
    try {
        // current measurement type
        var type = result[index].type;
        // current measurement unit
        var unit = result[index].unit;
        // last value
        var lastMeasure = result[index].measurements[result[index].measurements.length - 1][0].toFixed(2);
        // last pressure
        var lastTime = result[index].measurements[result[index].measurements.length - 1][1].replace("T", " ").replace("Z", " ");
    } catch (error) {
        console.log(error);y
        return;
    }
    valuesGroup.innerHTML += `
        ${generate3dTextElement(`-1 0.2`, `${type}: ${lastMeasure} ${unit}`, `${type}-${index}`)}
        ${generate3dTextElement(`-1 -0.2`, `time: ${lastTime}`, `${type}-${index}-time`)}
        `;
}

function setup() {
    const target = document.getElementById("target");
    target.setAttribute("src", `../models/${result[0].modelName}.zpt`); // set model for tracking

    // setup visibility of 3d text and arrows
    const groups = document.getElementsByClassName("tracking-group"); // all tracking groups
    let is3dVisible = false;

    for (let i = 0; i < groups.length; i++) {
        groups[i].addEventListener("zappar-visible", () => {
            // The image has appeared so show the group
            groups[i].setAttribute("visible", "true");
            is3dVisible = true;
        });
        groups[i].addEventListener("zappar-notvisible", () => {
            // The image has disappeared so hide the group after a short delay
            is3dVisible = false;
            setTimeout(() => {
                if (is3dVisible === false) groups[i].setAttribute("visible", "false");
            }, 500)
        });
    }

    const valuesGroup = document.getElementById("values-group"); // container for 3d text
    generate3dTextList(valuesGroup);

    const arrowGroup = document.getElementById("arrow-group"); // container for arrows
    arrowGroup.innerHTML += `
    <a-entity id="left-arrow" arrow="length: 0.5; direction: -1 0 0; color: red" position="-0.75 -1 0.1" scale="1 6 1"></a-entity>
    <a-entity id="right-arrow" arrow="length: 0.5; direction: 1 0 0; color: red" position="0.75 -1 0.1" scale="1 6 1"></a-entity>
    `;

    // left arrow\
    const leftArrow = document.getElementById("left-arrow");
    leftArrow.addEventListener("click", () => {
        changeSensor(-1);
    });
    // right arrow
    const rightArrow = document.getElementById("right-arrow");
    rightArrow.addEventListener("click", () => {
        changeSensor(1);
    });
}

// rescan button
const placementUI = document.getElementById("re-scan-ui");
placementUI.addEventListener("click", () => {
    window.location.href = "scanner.html";
});

console.log(JSON.stringify(result));