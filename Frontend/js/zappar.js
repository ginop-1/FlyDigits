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
    const myImageGroup = document.getElementById("image-group");
    myImageGroup.innerHTML = "";
    generate3dTextList(myImageGroup);
}

function generate3dTextElement(coordinates, value, id) {
    return `<a-entity position="${coordinates}" scale="0.25 0.25 1" text-geometry="value: ${value}" material="color: green" id="${id}"></a-entity>`;
}

function generate3dTextList(myImageGroup) {
    // add modelname 3d text + arrows
    myImageGroup.innerHTML += `
    <a-entity position="-1 0.6 1" scale="0.5 0.5 1" text-geometry="value: ${result[0].modelName}" material="color: red" id="model-name-3dtext"></a-entity>
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
        console.log(error);
        return;
    }
    myImageGroup.innerHTML += `
        ${generate3dTextElement(`-1 0.2`, `${type}: ${lastMeasure} ${unit}`, `${type}-${index}`)}
        ${generate3dTextElement(`-1 -0.2`, `time: ${lastTime}`, `${type}-${index}-time`)}
        `;
}

function setup() {
    const target = document.getElementById("target");
    target.setAttribute("src", `../models/${result[0].modelName}.zpt`);

    const myImageGroup = document.getElementById("image-group");
    generate3dTextList(myImageGroup);

    const arrowGroup = document.getElementById("arrow-group");
    arrowGroup.innerHTML += `
    <a-entity id="left-arrow" arrow="length: 0.5; direction: -1 0 0" position="-0.75 -1 -1" scale="1 6 1"></a-entity>
    <a-entity id="right-arrow" arrow="length: 0.5; direction: 1 0 0" position="0.75 -1 -1" scale="1 6 1"></a-entity>
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

    let imageVisible = false;

    myImageGroup.addEventListener("zappar-visible", () => {
        // The image has appeared so show the group
        myImageGroup.setAttribute("visible", "true");
        imageVisible = true;
    });

    myImageGroup.addEventListener("zappar-notvisible", () => {
        // The image has disappeared so hide the group after a short delay
        imageVisible = false;
        setTimeout(() => {
            if (imageVisible === false) myImageGroup.setAttribute("visible", "false");
        }, 500)
    });
}

// rescan button
const placementUI = document.getElementById("zappar-placement-ui");
placementUI.addEventListener("click", function () {
    window.location.href = "scanner.html";
});

console.log(JSON.stringify(result));