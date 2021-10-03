//HTML References
const gridContainer = document.querySelector(".grid-container");
const inputElems = document.querySelectorAll("input");

//Paint Mode:
const SOLID = "solid";
const DARKEN = "darken";
const LIGHTEN = "lighten";

//Color Mode:
const SINGLE = "single";
const RANDOM = "random";

//Variable Declarations/Initializations
let gridSize = 16;
let colorMode = SINGLE;
let paintMode = SOLID;
let selectColor = "#000000";

initializeInputElems();






//Function Definitions
function initializeInputElems(){
    for (let i = 0; i < inputElems.length; i++) {
        const inputElem = inputElems[i];
        if(!(inputElem instanceof HTMLElement)) return;
    
        if(inputElem.type === "number"){
            gridSize = 16;
            inputElem.parentElement.firstElementChild.textContent = gridSize;
            inputElem.value = gridSize;
            inputElem.max = 100;
            inputElem.min = 1;
            inputElem.addEventListener("input", function(){
                if(isNaN(Number(inputElem.value))) {
                    alert("Please input an integer value from 1 to 100");
                    return;
                }
                gridSize = Number(inputElem.value);
                inputElem.parentElement.firstElementChild.textContent = gridSize;
            });
        }
    
        if(inputElem.type === "color"){
            inputElem.addEventListener("change", function(){selectColor = inputElem.value})
            selectColor = inputElem.value;
        }
    
        if(inputElem.type === "button"){
            const id = inputElem.id;
            switch(id){
                case "create":
                    inputElem.addEventListener("click", createGrid);
                    createGrid(inputElem);
                    break;
                case "single":
                    inputElem.addEventListener("click", function(){colorMode = SINGLE})
                    inputElem.addEventListener("click", applyButtonsToggleStyles)
                    applyButtonsToggleStyles(inputElem);
                    break;
                case "random":
                    inputElem.addEventListener("click", function(){colorMode = RANDOM})
                    inputElem.addEventListener("click", applyButtonsToggleStyles)
                    break;
                case "solid":
                    inputElem.addEventListener("click", function(){paintMode = SOLID})
                    inputElem.addEventListener("click", applyButtonsToggleStyles)
                    applyButtonsToggleStyles(inputElem);
                    break;
                case "darken":
                    inputElem.addEventListener("click", function(){paintMode = DARKEN})
                    inputElem.addEventListener("click", applyButtonsToggleStyles)
                    break;
                case "lighten":
                    inputElem.addEventListener("click", function(){paintMode = LIGHTEN})
                    inputElem.addEventListener("click", applyButtonsToggleStyles)
                    break;
                default:
                    console.log(`Error in initializations - invalid id: ${id}`);
                    break;
            }
        }
    }
}

function applyButtonsToggleStyles(e){
    let button;
    if(e instanceof HTMLElement) {
        button = e;
    } else {
        button = e.target;
    }

    if(!(button instanceof HTMLElement)) return;

    switch(button.id){
        case "single":
            button.classList.add("toggled");
            document.querySelector("#random").classList.remove("toggled");
            break;
        case "random":
            button.classList.add("toggled");
            document.querySelector("#single").classList.remove("toggled");
            break;
        case "solid":
            button.classList.add("toggled");
            document.querySelector("#darken").classList.remove("toggled");
            document.querySelector("#lighten").classList.remove("toggled");
            break;
        case "darken":
            button.classList.add("toggled");
            document.querySelector("#solid").classList.remove("toggled");
            document.querySelector("#lighten").classList.remove("toggled");
            break;
        case "lighten":
            button.classList.add("toggled");
            document.querySelector("#solid").classList.remove("toggled");
            document.querySelector("#darken").classList.remove("toggled");
            break;
        default:
            console.log(`Error in applyButtonsToggleStyles - invalid id: ${id}`);
            break;
    }
}


function getFilterValue(htmlElement, filterName){
    if(!(htmlElement instanceof HTMLElement)) return;

    const filters = window.getComputedStyle(htmlElement).getPropertyValue("filter");

    let propertyValue;

    switch(filterName){
        // case "grayscale":
        //     propertyValue = filters.match(/grayscale\((.*?)%\)/);
        //     break;
        // case "hue-rotate":
        //     propertyValue = filters.match(/hue-rotate\((.*?)d/);
        //     break;
        case "brightness":
            propertyValue = filters.match(/brightness\((.*?)\)/);
            break;
        default:
            console.log(`Error in getFilterValue - filtername: ${filterName}`);
            break;
    }

    return Number(propertyValue[1]);
}

function setFilterValue(htmlElement, filterName, filterValue){
    if(!(htmlElement instanceof HTMLElement) && (typeof filterName !== "string") && (typeof filterValue !== "string")) return;

    const prevFilters = window.getComputedStyle(htmlElement).getPropertyValue("filter");

    let newFilters;
    let regex;

    switch(filterName){
        // case "hue-rotate":
        //     regex = /hue-rotate\(.*?\)/;
        //     newFilters = prevFilters.replace(regex, `${filterName}(${filterValue}deg)`);          break;
        case "brightness":
            regex = /brightness\(.*?\)/;
            newFilters = prevFilters.replace(regex, `${filterName}(${filterValue})`);
            break;
        default:
            console.log(`Error in setFilterValue - filterName: ${filterName}`);
            break;
    }

    htmlElement.style.filter = newFilters;
}

function modCellBrightness(cellElement){
    if(!(cellElement instanceof HTMLElement)) return;
    
    let newBrightness = getFilterValue(cellElement, "brightness");
    newBrightness *= 100;

    switch(true){
        case paintMode === SOLID:
            newBrightness = 100;
            break;
        case paintMode === DARKEN:
            newBrightness -= 10;
            break;
        case paintMode === LIGHTEN:
            newBrightness += 10;
            break;
        default:
            console.log(`Error in setCellBrightness - paintMode: ${paintMode}`);
            break;
    }

    newBrightness = (newBrightness > 100) ? 100 : 
    (newBrightness < 0) ? 0 : newBrightness;

    newBrightness /= 100;
    setFilterValue(cellElement, "brightness", newBrightness)
}

function setCellColor(cellElement){
    if(!(cellElement instanceof HTMLElement)) return;

    if(colorMode === SINGLE){
        const prevColor = window.getComputedStyle(cellElement).getPropertyValue("background-color");
        if(prevColor != selectColor) cellElement.style.backgroundColor = selectColor;

    } else {
        const randomColor = "#"+(Math.floor(Math.random()*16777215)+1).toString(16).padStart(2, "0");
        cellElement.style.backgroundColor = randomColor;
    }
}

function paintCell(e){
    cell = e.target;
    if(!(cell instanceof HTMLElement)) return;

    setCellColor(cell);

    modCellBrightness(cell);

}




function clearGrid(){
    for (let i = gridContainer.childElementCount-1; i >= 0; i--) {
        const cellElement = gridContainer.children[i];
        gridContainer.removeChild(cellElement);
    }
    gridContainer.style.display = "none";
}

function createGrid(e){
    let createGridButton;
    if(e instanceof HTMLElement) {
        createGridButton = e;
    } else {
        createGridButton = e.target;
    }

    if(!(createGridButton instanceof HTMLElement) && createGridButton.id === "create") return;

    if(gridSize > 100 || gridSize < 2) {
        alert("Please specify grid size in number of cells per side from 2 to 100.");
        return;
    }

    if (gridContainer.childElementCount > 0) clearGrid();

    for (let j = gridSize; j > 0; j--) {
        for (let i = gridSize; i > 0; i--) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.addEventListener("mouseenter", paintCell);
            gridContainer.appendChild(cell);
        }
    }

    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
}