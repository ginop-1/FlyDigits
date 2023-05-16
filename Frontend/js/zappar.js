console.log("Using AFrame", AFRAME.version);
console.log("Using ZapparAFrame", ZapparAFrame);

window.addEventListener("load", setup);
const result = JSON.parse(localStorage.getItem("result"));
result.index = 1; // index of current measurement type
result.measures_index = 0; // index of current measurement type

// index è quello generale -> cioè quello che indica il sensore
// measures_index è quello che indica la misura in particolare

/* JSON RESULT IS BUILT AS FOLLOWS:
    guarda test.json
*/

function changeSensor(index) {
    result.index += index;
    console.log("change sensor: ", result.index);
    if (result.index < 1) {
        result.index = result.length - 1;
    }
    if (result.index >= result.length) {
        result.index = 1;
    }
    result.measures_index = 0;
    const valuesGroup = document.getElementById("values-group");
    valuesGroup.innerHTML = "";
    generate3dTextList(valuesGroup);
}

function changeMeasure(index) {
    result.measures_index += index;
    console.log("change measure: ", result.measures_index);
    if (result.measures_index < 0) {
        result.measures_index = 0;
    }
    if (result.measures_index >= result[result.index].measurements.length) {
        result.measures_index = result[result.index].measurements.length - 1;
    }
    const valuesGroup = document.getElementById("values-group");
    valuesGroup.innerHTML = "";
    generate3dTextList(valuesGroup);
}

function generate3dTextElement(coordinates, value, id) {
    return `<a-entity position="${coordinates}" scale="0.25 0.25 1" text-geometry="value: ${value}" material="color: white" id="${id}"></a-entity>`;
}

function generate3dTextList(valuesGroup) {
    // add modelname 3d text + arrows
    valuesGroup.innerHTML += `
    <a-entity position="-1 0.6 0.1" scale="0.5 0.5 1" text-geometry="value: ${result[0].modelName}" material="color: yellow" id="model-name-3dtext"></a-entity>
    <a-entity position="-1 0.3 0.1" scale="0.3 0.3 1" text-geometry="value: ${result[result.index].sensorName}" material="color: yellow" id="model-name-3dtext"></a-entity>
    `;

    var general_index = result.index; // index of current measurement
    var measurements_index = result.measures_index; // index of current measurement type
    var curr_measures = result[general_index].measurements[measurements_index]; // current measurements

    if (curr_measures.length === 0) {
        return;
    }
    try {
        // current measurement type
        var type = result[result.index].type;
        // current measurement unit
        var unit = result[result.index].unit;
        // last value
        var lastMeasure = curr_measures[0].toFixed(2);
        // last pressure
        var lastTime = curr_measures[1].replace("T", " ").replace("Z", " ");
    } catch (error) {
        console.log(error);
        return;
    }
    valuesGroup.innerHTML += `
        ${generate3dTextElement(`-1 -0.1`, `${type}: ${lastMeasure} ${unit}`, `${type}-${general_index}-value`)}
        ${generate3dTextElement(`-1 -0.3`, `time: ${lastTime}`, `${type}-${general_index}-time`)}
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
    <a-entity id="left-arrow" arrow="length: 0.5; direction: -1 0 0; color: yellow" position="-0.75 -1 0.1" scale="1 10 1"></a-entity>
    <a-entity id="right-arrow" arrow="length: 0.5; direction: 1 0 0; color: yellow" position="0.75 -1 0.1" scale="1 10 1"></a-entity>
    `;

    // if i click on sensor name, change sensor
    const change_sensor_button = document.getElementById("change-sensor-ui");
    change_sensor_button.addEventListener("click", () => {
        changeSensor(-1);
    });
    // left arrow\
    const leftArrow = document.getElementById("left-arrow");
    leftArrow.addEventListener("click", () => {
        changeMeasure(-1);
    });
    // right arrow
    const rightArrow = document.getElementById("right-arrow");
    rightArrow.addEventListener("click", () => {
        changeMeasure(1);
    });
}

// rescan button
const placementUI = document.getElementById("re-scan-ui");
placementUI.addEventListener("click", () => {
    window.location.href = "scanner.html";
});

console.log(JSON.stringify(result));