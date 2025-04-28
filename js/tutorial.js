const narrator = document.getElementById('narrator');
const codeImg = document.getElementById('codeImg');
const directions = document.getElementById('directions');
const serverImg = document.getElementById('serverImg');

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

class subStep{
    constructor(innerMonologue, changesImg = null, icon = null){
        this.innerMonologue = innerMonologue;
        this.changesImg = changesImg;
        this.icon = icon;
        
        Object.assign(this, picture)
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
        // to do add display animation!!!
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
        const {
            type,
            content,
            mainStep,
            subStepIndex
        } = this.getCurrentContent();
        if (type === 'substep'){
            
        }else{

        }
    }

    reset(){
        this.currentStep = this.head;
        this.currentSubStepIndex = -1;
        this.displayCurrentContent();
    }
}