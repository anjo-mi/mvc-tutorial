// overAllInstructions variables
const mainStepBox = document.getElementById('overAllInstructions');
const narrator = document.getElementById('narrator');
const bossImg = document.getElementById('bossImg');
const directions = document.getElementById('directions');

// innerMonologue Variables
const subStepBox = document.getElementById('innerMonologue');
const subStepText = document.getElementById('subStepText');
const subStepImg = document.getElementById('subStepImg');
const subStepIcon = document.getElementById('subStepIcon');

// server image variable
const serverImg = document.getElementById('serverImg');

// next and prev buttons
const mainPrev = document.getElementById('mainPrevBtn');
const subPrev = document.getElementById('subPrevBtn');
const mainNext = document.getElementById('mainNextBtn');
const subNext = document.getElementById('subNextBtn');

class Step{
    constructor(narrator, fixInstructions, serverImg, bossImg , otherProps = {}){
        this.narrator = narrator;
        this.fixInstructions = fixInstructions;
        this.serverImg = serverImg;
        this.bossImg = bossImg;
        this.subSteps = [];
        this.next = null;
        this.prev = null;

        Object.assign(this, otherProps);
    }

    addSubStep(subStep){
        this.subSteps.push(subStep);
        return this;
    }
}

class SubStep{
    constructor(innerMonologue, changesImg = null, icon = null){
        this.innerMonologue = innerMonologue;
        this.changesImg = changesImg;
        this.icon = icon;
    }
}

class List{
    constructor(){
        this.head = null;
        this.tail = null;
        this.currentStep = null;
        this.currentSubStepIndex = -1;
    }

    appendStep(step){
        if (!this.head){
            this.head = step;
            this.tail = step;
            this.currentStep = step;
        }else{
            this.tail.next = step;
            step.prev = this.tail;
            this.tail = step;
        }
        return step;
    }

    next(){
        if (!this.currentStep) return null;

        if (this.currentStep.subSteps.length > 0 && 
            this.currentSubStepIndex < this.currentStep.subSteps.length - 1){
                this.currentSubStepIndex++;
                this.displayCurrentContent();
        }else if(this.currentStep.next){
            this.currentStep = this.currentStep.next;
            this.currentSubStepIndex = -1;
            this.displayCurrentContent();
        }
        return null;
    }

    prev(){
        if (!this.currentStep) return null;

        if (this.currentSubStepIndex >= 0){
            this.currentSubStepIndex--;
            this.displayCurrentContent();
        }else if(this.currentStep.prev){
            this.currentStep = this.currentStep.prev;
            if (this.currentStep.subSteps.length > 0){
                this.currentSubStepIndex = this.currentStep.subSteps.length - 1;
            }else{
                this.currentSubStepIndex = -1;
            }
            this.displayCurrentContent();
        }
        return null;
    }

    getCurrentContent(){
        if (!this.currentStep) return null;

        if (this.currentSubStepIndex >= 0 &&
            this.currentSubStepIndex < this.currentStep.subSteps.length){
                return {
                    type: 'substep',
                    content: this.currentStep.subSteps[this.currentSubStepIndex],
                    mainStep: this.currentStep,
                    subStepIndex: this.currentSubStepIndex,
                };
        }else{
            return {
                type: 'mainstep',
                content: this.currentStep,
                mainStep: this.currentStep,
                subStepIndex: -1,
            };
        }
    }

    displayCurrentContent(){
        console.log('attempting')
        const {
            type,
            content,
            mainStep,
            subStepIndex
        } = this.getCurrentContent();
        if (type === 'substep'){
            subStepBox.classList.remove('hidden');
            if (serverImg.src !== mainStep.serverImg){
                serverImg.src = mainStep.serverImg;
            }
            subStepText.textContent = content.innerMonologue;
            if (!content.changesImg){
                subStepImg.classList.add('hidden');
            }else{
                subStepImg.classList.remove('hidden');
                subStepImg.src = content.changesImg;
            }
            if (!content.icon){
                subStepIcon.classList.add('hidden');
            }else{
                subStepIcon.classList.remove('hidden');
                subStepIcon.textContent = content.icon;
            }
        }else if(type === 'mainstep'){
            subStepBox.classList.add('hidden');
            narrator.textContent = mainStep.narrator;
            serverImg.src = mainStep.serverImg;
            bossImg.src = mainStep.bossImg;
            directions.textContent = mainStep.fixInstructions;
        }
    }

    reset(){
        this.currentStep = this.head;
        this.currentSubStepIndex = -1;
        this.displayCurrentContent();
    }
}
const list = new List();
const step1 = new Step(
    'Project Manager',
    `Nice job! You've just gotten our server running exactly the way we asked you to!.......... but..... you should have known that I wanted it done differently. You need to make it fit into industry best practices, and convert this whole thing to the MVC format.`,
    'images/full-server.png',
    'images/bobs.jpeg'
);
const step1a = new SubStep(
    `didnt he just say nice job?? and why in the hell would i have thought to do that? and what the hell is mvc?`,
    null,
    String.fromCodePoint(0x1F621)
);
const step1b = new SubStep(
    `whatever, i guess ive gota figure this out.. it seems like its basically the same thing, just organized a little differently`,
    null,
    String.fromCodePoint(0x1F926)
);
const step1c = new SubStep(
    `ok, so lets start with the M part of mvc.. it seems like i need to have a model with which to follow along when submitting data to the database`,
    null,
    String.fromCodePoint(0x1F9E0)
);
const step1d = new SubStep(
    `i should prolly toss that in a models folder, and label the file with what it is.. so ill mkdir models and then touch models/Todo.js, and place my mongoose schema in there`,
    `images/server-schema.png`,
);
step1.addSubStep(step1a);
step1.addSubStep(step1b);
step1.addSubStep(step1c);
step1.addSubStep(step1d);
list.appendStep(step1);
list.displayCurrentContent();

        
document.addEventListener('DOMContentLoaded', () => {
    const moveOver = list.next.bind(list);
    const moveBack = list.prev.bind(list);

    mainNext.addEventListener('click', moveOver);
    subNext.addEventListener('click', moveOver);
    mainPrev.addEventListener('click', moveBack);
    subPrev.addEventListener('click', moveBack);
});