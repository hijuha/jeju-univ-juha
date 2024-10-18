let highestZIndex = 10;
let topPlant = "plant1";

console.log(document.getElementById("plant1"));
dragElement(document.getElementById("plant1"));
dragElement(document.getElementById("plant2"));
dragElement(document.getElementById("plant3"));
dragElement(document.getElementById("plant4"));
dragElement(document.getElementById("plant5"));
dragElement(document.getElementById("plant6"));
dragElement(document.getElementById("plant7"));
dragElement(document.getElementById("plant8"));
dragElement(document.getElementById("plant9"));
dragElement(document.getElementById("plant10"));
dragElement(document.getElementById("plant11"));
dragElement(document.getElementById("plant12"));
dragElement(document.getElementById("plant13"));
dragElement(document.getElementById("plant14"));

function displayCandy() {
  let candy = ["jellybeans"];
  function addCandy(candyType) {
    candy.push(candyType);
  }
  addCandy("gumdrops");
}
displayCandy();
console.log(candy);

function dragElement(terrariumElement) {
  let pos1 = 0;
  let pos2 = 0;
  let pos3 = 0;
  let pos4 = 0;
  terrariumElement.onpointerdown = pointerDrag;

  terrariumElement.ondblclick = () => {
    const top = terrariumElement.id;
    document.getElementById(topPlant).zIndex = 5;
    top.zIndex = 6;
    topPlant = top;

    highestZIndex++;
    terrariumElement.style.zIndex = highestZIndex;
  };

  function pointerDrag(e) {
    e.preventDefault();
    console.log(e);
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onpointermove = elementDrag;
    document.onpointerup = stopElementDrag;
  }

  function elementDrag(e) {
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    console.log(pos1, pos2, pos3, pos4);
    terrariumElement.style.top = terrariumElement.offsetTop - pos2 + "px";
    terrariumElement.style.left = terrariumElement.offsetLeft - pos1 + "px";
  }

  function stopElementDrag() {
    document.onpointerup = null;
    document.onpointermove = null;
  }
}
