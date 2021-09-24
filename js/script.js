const gridContainer = document.querySelector(".grid-container");
const createGridButton = document.querySelector("input[type='button']");


createGridButton.addEventListener("click", createGrid);

function colorCell(e){
    e.target.style.backgroundColor = "black";
}

function clearGrid(){
    for (let i = gridContainer.childElementCount-1; i >= 0; i--) {
        const cellElement = gridContainer.children[i];
        gridContainer.removeChild(cellElement);
    }
    gridContainer.style.display = "none";
}

function createGrid(e){
    
    const gridSizeText = prompt("Please specify grid size in number of cells per side (Max: 100)", "16");

    if (gridSizeText === null) {
        return;
    }

    let gridSize = Number(gridSizeText);

    if (gridSize === NaN) {
        return;
    } 
    if (gridSize > 100){
        gridSize = 100;
        alert("Specified size is greater than the max size of 100. Size of 100 shall be used instead.");
    }

    if (gridContainer.childElementCount > 0){
        clearGrid();
    }

    if (e.target === createGridButton) {
        for (let j = gridSize; j > 0; j--) {
            for (let i = gridSize; i > 0; i--) {
                const cell = document.createElement("div");
                cell.style.color = "red";
                cell.style.border = "1px solid black";
                cell.addEventListener("mouseover", colorCell);
                gridContainer.appendChild(cell);
            }
        }

        gridContainer.style.display = "grid";
        gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        console.log("grid created");
    }
    else{
        console.log("grid not created");
    }
}