const narrator = document.getElementById('narrator');
const codeImg = document.getElementById('codeImg');
const directions = document.getElementById('directions');
const serverImg = document.getElementById('serverImg');

class Step{
    constructor(narrator, codeImg, directions, serverImg){
        this.narrator = narrator
        this.codeImg = codeImg
        this.directions = directions
        this.serverImg = serverImg
    }
}

const steps = [];

const displayStep = step => {
    narrator.innerText = step.narrator;
    codeImg.src = step.codeImg;
    directions.innerText = step.directions;
    serverImg.src = step.serverImg;
};

const displayNext = i => {
    if (i >= steps.length - 1){
        alert('its over, youve done it, close your ticket and tell the bobs to hop off it')
        return;
    }
    const text = directions.textContent;
    let currIndex = steps.findIndex(step => step.directions = text);
    console.log(currIndex)
    displayStep(steps[currIndex + 1])
}

const displayPrev = i => {
    if (i <= 0){
        alert('theres no turning back, its mvc or bust')
        return;
    }
    const text = directions.textContent;
    let currIndex = steps.findIndex(step => step.directions = text);
    console.log(currIndex)
    displayStep(steps[currIndex - 1])
}

document.getElementById('nextBtn').addEventListener('click', displayNext)
document.getElementById('prevBtn').addEventListener('click', displayPrev)

document.addEventListener('DOMContentLoaded', () => {
    displayStep(steps[0])
})