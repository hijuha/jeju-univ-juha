let highestZIndex = 10;
let topPlant = null;

let offsetX = 0;
let offsetY = 0;

function dragStart(e) {
  const plant = e.target;

  offsetX = e.clientX - plant.offsetLeft;
  offsetY = e.clientY - plant.offsetTop;

  e.dataTransfer.setData("text/plain", e.target.id);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();

  const id = e.dataTransfer.getData("text");
  const plant = document.getElementById(id);
  const newLeft = e.clientX - offsetX;
  const newTop = e.clientY - offsetY;

  console.log(newLeft);
  console.log(newTop);

  plant.style.left = `${newLeft}px`;
  plant.style.top = `${newTop}px`;
}

function bringToFront(e) {
  highestZIndex++;
  e.target.style.zIndex = highestZIndex;
  topPlant = e.target.id;
}

document.querySelectorAll(".plant").forEach((plant) => {
  plant.addEventListener("dragstart", dragStart);
  plant.addEventListener("dblclick", bringToFront);
});

document.body.addEventListener("dragover", dragOver);
document.body.addEventListener("drop", drop);
