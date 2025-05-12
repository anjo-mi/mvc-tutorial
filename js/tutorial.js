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

// traversy link
const publicViewsLink = 'https://www.youtube.com/watch?v=fBNz5xF-Kx4';

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
        this.currentlyTyping = false;
        this.typingInterval = null;
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
        if (this.currentlyTyping){
            this.cancelTyping();
            return null;
        }
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
        if (this.currentlyTyping){
            this.cancelTyping();
        }
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

    typeText(element,text,speed=30){
        this.currentlyTyping = true;
        element.textContent = '';

        return new Promise(res => {
            let i = 0;
            this.typingInterval = setInterval(() => {
                if (i < text.length){
                    element.textContent += text.charAt(i);
                    i++;
                }else{
                    clearInterval(this.typingInterval);
                    this.typingInterval = null;
                    this.currentlyTyping = false;
                    res();
                }
            },speed);
        });
    }

    cancelTyping(){
        if (this.typingInterval){
            clearInterval(this.typingInterval);
            this.typingInterval = null;
            this.currentlyTyping = false;
        }
        const {
            type,
            content,
            mainStep
        } = this.getCurrentContent();
        if (type === 'substep'){
            subStepText.textContent = content.innerMonologue;
            directions.textContent = mainStep.fixInstructions;
        }else if(type === 'mainstep'){
            directions.textContent = mainStep.fixInstructions;
        }
    }

    async displayCurrentContent(){
        const {
            type,
            content,
            mainStep,
            subStepIndex
        } = this.getCurrentContent();
        if (type === 'substep'){
            subStepBox.style.display = 'block';
            void subStepBox.offsetWidth;
            subStepBox.classList.remove('hidden');
            if (serverImg.src !== mainStep.serverImg){
                serverImg.src = mainStep.serverImg;
            }
            if (bossImg.src !== mainStep.bossImg){
                bossImg.src = mainStep.bossImg;
            }
            if (directions.textContent !== mainStep.fixInstructions){
                await this.typeText(directions, mainStep.fixInstructions);
            }
            if (!content.changesImg){
                subStepImg.classList.add('hidden');
                setTimeout(() => {
                    subStepImg.style.display = 'none';
                },400)
            }else{
                subStepImg.src = content.changesImg;
                subStepImg.style.display = 'block';
                void subStepImg.offsetWidth;
                subStepImg.classList.remove('hidden');
            }
            if (!content.icon){
                subStepIcon.classList.add('hidden');
                setTimeout(() => {
                    subStepIcon.style.display = 'none';
                },400)
            }else{
                subStepIcon.textContent = content.icon;
                subStepIcon.style.display = 'block';
                void subStepIcon.offsetWidth;
                subStepIcon.classList.remove('hidden');
            }
            await this.typeText(subStepText, content.innerMonologue);
        }else if(type === 'mainstep'){
            subStepBox.classList.add('hidden');
            setTimeout(() => {
                subStepBox.style.display = 'none';
            },400)
            narrator.textContent = mainStep.narrator;
            serverImg.src = mainStep.serverImg;
            bossImg.src = mainStep.bossImg;
            await this.typeText(directions, mainStep.fixInstructions);
        }
    }

    reset(){
        this.currentStep = this.head;
        this.currentSubStepIndex = -1;
        this.displayCurrentContent();
    }

    detectDoubleTapClosure(){
        let lastTap = 0;
        let timeout;
        return function detectDoubleTap(event) {
            // const xPos = event.changedTouches[0].clientX;
            let xPos;
            if (event.changedTouches[0].clientX) xPos = event.changedTouches[0].clientX
            else if(event.touches[0].clientX) xPos = event.touches[0].clientX
            else if(event.targetTouches[0].clientX) xPos = event.targetTouches[0].clientX
            else if (event.clientX) xPos = event.clientX
            else {
                console.error('no detectable x position');
                return;
            }
            const curTime = new Date().getTime();
            const tapLen = curTime - lastTap;
            if (tapLen < 500 && tapLen > 0) {
            //   console.log('Double tapped!');
              event.preventDefault();
              if (xPos <= 100){
                this.prev();
              }else if(xPos >= window.innerWidth - 100){
                this.next();
              }
            } else {
              timeout = setTimeout(() => {
                clearTimeout(timeout);
              }, 500);
            }
            lastTap = curTime;
        };
      }
}
const list = new List();

// STEP 1 and substeps
const step1 = new Step(
    'Project Manager',
    `Nice job! You've just gotten our server running exactly the way we asked you to!.......... but..... you should have known that I wanted it done differently. You need to make it fit into industry best practices, and convert this whole thing to the MVC format.`,
    'images/full-server.png',
    'images/bobs.jpeg'
);
const step1a = new SubStep(
    `didnt he just say nice job?? and why in the hell would i have thought to do that? and what the hell is mvc?`,
    null,
    String.fromCodePoint(0x1F621) //angry face
);
const step1b = new SubStep(
    `whatever, i guess ive gota figure this out.. it seems like its basically the same thing, just organized a little differently`,
    null,
    String.fromCodePoint(0x1F926) //face palm
);
const step1c = new SubStep(
    `ok, so lets start with the M part of mvc.. it seems like i need to have a model with which to follow along when submitting data to the database`,
    null,
    String.fromCodePoint(0x1F9E0) //brain
);
const step1d = new SubStep(
    `i should prolly toss that in a models folder, and label the file with what it is.. so ill mkdir models and then touch models/Todo.js, and place my mongoose schema in there`,
    `images/server-schema.png`,
);
const step1e = new SubStep(
    `except.. goddamnit.. now i need to convert the implementation so it can be exported from the models/Todo.js file.. and make sure to require mongoose here as well`,
    `images/models-schema.png`,
);
const step1f = new SubStep(
    `alright cool, that was easy enough.. and since i know that ill eventually be moving all of my get, post, put and delete methods out of the server, i wont waste the time importing the schema to the server`,
    null,
    String.fromCodePoint(0x1F9E0)
);
const step1g = new SubStep(
    `but first, since ive taken the logic affecting database insertions out, i should prolly take out the logic involving the database connection, too`,
    `images/server-connect.png`,
);
const step1h = new SubStep(
    `and since its part of the configuration, ill move that to the config folder, and make a database.js file in which to put it.. then be certain to export it so i can still connect on the server (line 20 in server.js)`,
    `images/config-connect.png`,
);
const step1i = new SubStep(
    `lastly, now i need to make sure my server.js file imports the configuration in order to connect to the database, since everything is still technically taking place on the server and i should be done with this step`,
    `images/new-server-connect.png`,
    String.fromCodePoint(0x1F38A)//confetti
);

// STEP 2 and substeps
const step2 = new Step(
    'Coworkers',
    `Well would ya look at that! The new version of your server (hint: look below) looks pretty good..... BUT, we're all super annoying, and even though you've extracted all of the logic regarding connecting to the database, we'll certainly find a way to screw up your server methods`,
    'images/post-mod-server.png',
    'images/coworkers.jpg'
);
const step2a = new SubStep(
    `just.... why?`,
    null,
    String.fromCodePoint(0x1F621) //angry face
);
const step2b = new SubStep(
    `well at least i remembered this video from traversy media (see link at end!) about putting html files into a public folder and decided it was the same concept for ejs and views`,
    null,
    String.fromCodePoint(0x1F64C) //celebration hands
);
const step2c = new SubStep(
    `so with the V of mvc handled (already had my ejs in a views folder), i guess the next logical step is to tackle the C`,
    null,
    String.fromCodePoint(0x1F9E0)
);
const step2d = new SubStep(
    `this is what 'controls' the behavior of my application, so i prolly need to make a folder for that, and file for any page that has control over the application`,
    'images/controller-folder.png',
);
const step2e = new SubStep(
    `well, lets eat the biggest frog first.. ill take all of my logic regarding the todo page out first`,
    'images/server-todo-methods.png',
);
const step2f = new SubStep(
    `and ill move them to the controllers/todos.js file, while making sure theyre in a format that can be exported to be used elsewhere`,
    'images/contro-todo-methods.png',
);
const step2g = new SubStep(
    `and CRUCIALLY! ill import my Todo variable from its new place of residence in the models folder, since the todo page needs to be able to talk to the database`,
    'images/contro-import.png',
);
const step2h = new SubStep(
    `and now ill eat the little frog.. because the home page should be easier since its only one method that does need to connect to the database`,
    'images/server-home-method.png',
);
const step2i = new SubStep(
    `and again ill convert it to a form that can be exported to still be used in the server, while not actually residing there`,
    'images/contro-home-method.png',
);

// STEP 3 and substeps
const step3 = new Step(
    'Clueless Boss',
    `hey, so im gona need you to stay late today, because git blamed you.. i tried submitting our TPS reports, but the server you built (hint: see below) doesnt have any sort of route to connect with the controllers`,
    'images/post-contro-server.png',
    'images/lumbergh.jpg'
);
const step3a = new SubStep(
    `i hate him.. i hate him so goddamn much.. this was all working a couple hours ago and i swear they told me nice job.. but goddamnit hes right, i need to make a routes folder`,
    null,
    String.fromCodePoint(0x1F926)
)
const step3b = new SubStep(
    `orrrrr maybeeeee.. ill just burn it all!`,
    null,
    String.fromCodePoint(0x1F525) + String.fromCodePoint(0x1F92C) // fire + angry
)
const step3c = new SubStep(
    `*SIGH* no ill just make the folder. there are only two files so it shouldnt be too difficult..`,
    'images/routes-folder.png',
)
const step3d = new SubStep(
    `ok, so these files are going to import from our controllers folder. and i need to make sure im picking from within the correct file in that folder.. so lets start with the todos again, and set up an express router`,
    'images/router-todos-imports.png',
)
const step3e = new SubStep(
    `and now since all of my methods are defined in the controllers folder, all i have to do is set up 'listeners' to call them and export them so they can be used by the server`,
    'images/routes-todo.png',
)
const step3f = new SubStep(
    `then i can do the same thing for the home page (make an express router, import the defined methods from the controllers folder, add them to the router, and export the router so the server can use it)`,
    'images/routes-home.png',
)
const step3g = new SubStep(
    `so it seems like the last thing i need to do is import the routes to the server`,
    'images/server-route-imports.png',
)
const step3h = new SubStep(
    `and set up my app to use them!`,
    'images/server-routes-use.png',
)
// step 4 / conclusion
const step4 = new Step(
    'Self Absorbed CEO',
    `well well well.. would you look at what a great job I!!! did!`,
    'images/server-final.png',
    'images/ceo.jpg'
);
const step4a = new SubStep(
    `thats it.. im out`,
    'images/blow-up.png',
    String.fromCodePoint(0x1F926)
)
// add step 1 and its substeps
step1.addSubStep(step1a);
step1.addSubStep(step1b);
step1.addSubStep(step1c);
step1.addSubStep(step1d);
step1.addSubStep(step1e);
step1.addSubStep(step1f);
step1.addSubStep(step1g);
step1.addSubStep(step1h);
step1.addSubStep(step1i);
list.appendStep(step1);

// add step 2 and its substeps
step2.addSubStep(step2a);
step2.addSubStep(step2b);
step2.addSubStep(step2c);
step2.addSubStep(step2d);
step2.addSubStep(step2e);
step2.addSubStep(step2f);
step2.addSubStep(step2g);
step2.addSubStep(step2h);
step2.addSubStep(step2i);
list.appendStep(step2);

// add step 3 and its substeps
step3.addSubStep(step3a);
step3.addSubStep(step3b);
step3.addSubStep(step3c);
step3.addSubStep(step3d);
step3.addSubStep(step3e);
step3.addSubStep(step3f);
step3.addSubStep(step3g);
step3.addSubStep(step3h);
list.appendStep(step3);

// step 4 and substep / conclusion
step4.addSubStep(step4a);
list.appendStep(step4);


list.displayCurrentContent();

        
document.addEventListener('DOMContentLoaded', () => {
    const moveOver = list.next.bind(list);
    const moveBack = list.prev.bind(list);
    const dubTap = list.detectDoubleTapClosure().bind(list);

    mainNext.addEventListener('click', moveOver);
    subNext.addEventListener('click', moveOver);
    mainPrev.addEventListener('click', moveBack);
    subPrev.addEventListener('click', moveBack);
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight'){
            e.preventDefault();
            moveOver()
        };
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft'){
            e.preventDefault();
            moveBack()
        };
    });
    // if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.addEventListener('touchend', dubTap, { passive: false });
    // }
});