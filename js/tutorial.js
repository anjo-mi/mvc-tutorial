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
            if (narrator.textContent !== mainStep.narrator){
                narrator.textContent = mainStep.narrator;
            }
            if (directions.textContent !== mainStep.fixInstructions){
                await this.typeText(directions, mainStep.fixInstructions);
            }
            if (!content.changesImg){
                subStepImg.classList.add('hidden');
                setTimeout(() => {
                    subStepImg.style.display = 'none';
                },400)
            }else if(content.changesImg !== subStepImg.src){
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
            console.log({xPos})
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
    `Nice job! You've just gotten our server running exactly the way we asked you to!.......... but..... obviously you should have known that I wanted it done differently! You need to make it fit into industry best practices, and convert this whole thing to the MVC format.`,
    'images/full-server.png',
    'images/bobs.jpeg'
);
const step1a = new SubStep(
    `Didn't he just say nice job?? And why in the hell would I have thought to do that? And what the hell is MVC?`,
    null,
    String.fromCodePoint(0x1F621) //angry face
);
const step1b = new SubStep(
    `Whatever, I guess I've gota figure this out.. it seems like its basically the same thing, just organized a little bit differently`,
    null,
    String.fromCodePoint(0x1F926) //face palm
);
const step1c = new SubStep(
    `OK, so let's start with the M part of MVC.. it seems like I need to have a model with which to follow along when submitting data to the database`,
    null,
    String.fromCodePoint(0x1F9E0) //brain
);
const step1d = new SubStep(
    `I should prolly toss that in a models folder, and label the file with what it is.. so I'll run "mkdir models" and then "touch models/Todo.js", and place my mongoose schema in there.`,
    `images/server-schema.png`,
);
const step1d1 = new SubStep(
    `For those of us who haven't experienced the joy that is Tears of the Kingdom, a Schema is essentially a blueprint. In this case it's going to dictate the format for data being inserted to the database.`,
    `images/server-schema.png`,
);
const step1d2 = new SubStep(
    `The Schema expects an object to be created with properties matching what will be accepted. In this instance, only objects that have properties 'todo' and 'completed' with types of 'String' and 'Boolean' respectively, will be accepted.`,
    `images/server-schema.png`,
);
const step1e = new SubStep(
    `Well that was easy... except.. goddamnit.. Now I need to convert the implementation so it can be exported from the models/Todo.js file.. and make sure to require mongoose here as well.`,
    `images/models-schema.png`,
);
const step1e1 = new SubStep(
    `Now that it's in a new file, I need to make certain that this file has access to mongoose by requiring it at the top (line 1).`,
    `images/models-schema.png`,
);
const step1e2 = new SubStep(
    `And since I'll be using it in a different file, I'll make sure to export it from here (line 14).`,
    `images/models-schema.png`,
);
const step1f = new SubStep(
    `Alright cool, that was easy enough.. and since I know that I'll eventually be moving all of my get, post, put and delete methods out of the server, I won't waste the time importing the schema to the server.`,
    null,
    String.fromCodePoint(0x1F9E0)
);
const step1g = new SubStep(
    `But first, since I've taken the logic affecting database insertions out, I should prolly take out the logic involving the database connection, too.`,
    `images/server-connect.png`,
);
const step1h = new SubStep(
    `Since it's part of the configuration, I'll move that to the config folder, and make a database.js file in which to put it.. then be certain to export it so I can still connect on the server (line 20 in server.js)`,
    `images/config-connect.png`,
);
const step1h1 = new SubStep(
    `I'll be certain to do the same thing here (require mongoose at the top [line 1]) so that I can use the mongoose syntax.`,
    `images/config-connect.png`,
);
const step1h2 = new SubStep(
    `And again, I'll make sure to export the const variable that I created, so that it can communicate with the server (line 18).`,
    `images/config-connect.png`,
);
const step1i = new SubStep(
    `Lastly, now I need to make sure my server.js file imports the configuration in order to connect to the database, since everything is still technically taking place on the server. Then, I should be done with this step!`,
    `images/new-server-connect.png`,
    String.fromCodePoint(0x1F38A)//confetti
);

// STEP 2 and substeps
const step2 = new Step(
    'Coworkers',
    `Well would you look at that! The new version of your server (hint: look below) looks pretty darn good..... BUT, we're all super annoying, and even though you've extracted all of the logic regarding database connections, we'll certainly find a way to screw up your server methods! MUAHAHAHAHA!!!!`,
    'images/post-mod-server.png',
    'images/coworkers.jpg'
);
const step2a = new SubStep(
    `Just.... why?`,
    null,
    String.fromCodePoint(0x1F621) //angry face
);
const step2b = new SubStep(
    `Thankfully, I've already set up the server to render the pages from another folder's files, so they can't mess that up.`,
    'images/server-views.png',
    String.fromCodePoint(0x1F64C) //celebration hands
);
const step2b1 = new SubStep(
    `And all of my ejs files were already in the views folder, waiting to be accessed by the server!`,
    'images/views-folder.png'
);
const step2c = new SubStep(
    `So with the V of MVC handled, I guess the next logical step is to tackle the C.`,
    null,
    String.fromCodePoint(0x1F9E0)
);
const step2d = new SubStep(
    `This is what 'controls' the behavior of my application, so I'll prolly need to make another folder for that, and a file for any page that has control over the application.`,
    'images/controller-folder.png',
);
const step2e = new SubStep(
    `Well, let's eat the biggest frog first.. I'll take all of my logic regarding the todo page out first.`,
    'images/server-todo-methods.png',
);
const step2e1 = new SubStep(
    `So any of the CRUD methods in my server that start with the path '/todos/', I'll extract.`,
    'images/server-todo-methods.png',
);
const step2f = new SubStep(
    `And I'll move them to the controllers/todos.js file, while making sure theyre in a format that can be exported to be used elsewhere.`,
    'images/contro-todo-methods.png',
);
const step2f1 = new SubStep(
    `It seems really messy to export each method separately, though, so I'll big brain this bitch and reformat them all to be methods within an object.`,
    'images/contro-todo-methods.png',
);
const step2f2 = new SubStep(
    `Then I can just export the object as a whole using 'module.exports.'`,
    'images/contro-todo-methods.png',
);
const step2g = new SubStep(
    `And !!!CRUCIALLY!!! I'll import my Todo variable from its new place of residence in the models folder, since the todo page needs to be able to talk to the database.`,
    'images/contro-import.png',
);
const step2h = new SubStep(
    `Now I'll eat the little frog.. because the home page should be easier since it's only one method that does need to connect to the database.`,
    'images/server-home-method.png',
);
const step2i = new SubStep(
    `And again I'll convert it to a form that can be exported to be used in the server, while not actually residing there.`,
    'images/contro-home-method.png',
);
const step2i1 = new SubStep(
    `Conveniently, this one does not need to communicate with the database, so there's no need to import anything from the models folder.`,
    'images/contro-home-method.png',
);

// STEP 3 and substeps
const step3 = new Step(
    'Clueless Boss',
    `Hey, so I'm going to need you to stay late today, because git blamed you.. I tried submitting our TPS reports, but the server you built (hint: see below) doesn't have any sort of route to connect with the controllers.`,
    'images/post-contro-server.png',
    'images/lumbergh.jpg'
);
const step3a = new SubStep(
    `*rubs bridge of nose* I hate him.. I hate him so goddamn much.. this was all working a couple hours ago and I swear they told me nice job.. but goddamnit hes right, I need to make a routes folder.`,
    null,
    String.fromCodePoint(0x1F926)
)
const step3b = new SubStep(
    `orrrrr maybeeeee.. I'll just burn it all!`,
    null,
    String.fromCodePoint(0x1F525) + String.fromCodePoint(0x1F92C) // fire + angry
)
const step3c = new SubStep(
    `*SIGH* no I'll just make the folder. There are only two files so it shouldn't be too difficult..`,
    'images/routes-folder.png',
)
const step3d = new SubStep(
    `OK, so these files are going to import from our controllers folder. And I need to make sure I'm picking from within the correct file in that folder.. so let's start with the todos again, and set up an express router.`,
    'images/router-todos-imports.png',
)
const step3d1 = new SubStep(
    `And I'll make sure that I'm importing the object that has all of my CRUD methods for the Todo page (line 3).`,
    'images/router-todos-imports.png',
)
const step3e = new SubStep(
    `Now, since all of my methods are defined in the controllers folder, all I have to do is set up 'listeners' to call them and export them so they can be used by the server.`,
    'images/routes-todo.png',
)
const step3e1 = new SubStep(
    `I should take note of the fact that, since this is now separated from the CRUD methods affecting other pages, I can omit the '/todos/' at the beginning of each path. *!!!and I should really remember this for a few steps from now!!!*`,
    'images/routes-todo.png',
)
const step3f = new SubStep(
    `Then I can do the same thing for the home page (make an express router, import the defined methods from the controllers folder, add them to the router, and export the router so the server can use it).`,
    'images/routes-home.png',
)
const step3g = new SubStep(
    `So, it seems like the last thing I need to do is import the routes to the server.`,
    'images/server-route-imports.png',
)
const step3h = new SubStep(
    `And set up my app to use them!`,
    'images/server-routes-use.png',
)
const step3h1 = new SubStep(
    `Doing this is what allows the omission of the beginning of the paths in my routes folder.`,
    'images/server-routes-use.png',
)
const step3h2 = new SubStep(
    `I'm telling the server that for any requests made that start with '/' or '/todos/, to use the router file specified by the variable.`,
    'images/server-routes-use.png',
)
const step3i = new SubStep(
    `So that should be it! It's time to push the code and call it a day!`,
    null,
    String.fromCodePoint(0x1F38A) + String.fromCodePoint(0x1F64C)
)
// step 4 / conclusion
const step4 = new Step(
    'Self Absorbed CEO',
    `Well well well.. would you look at what a great job I!!! did!`,
    'images/server-final.png',
    'images/ceo.jpg'
);
const step4a = new SubStep(
    `That's it.. I'm out`,
    'images/blow-up.png',
    String.fromCodePoint(0x1F926)
)
// add step 1 and its substeps
step1.addSubStep(step1a);
step1.addSubStep(step1b);
step1.addSubStep(step1c);
step1.addSubStep(step1d);
step1.addSubStep(step1d1);
step1.addSubStep(step1d2);
step1.addSubStep(step1e);
step1.addSubStep(step1e1);
step1.addSubStep(step1e2);
step1.addSubStep(step1f);
step1.addSubStep(step1g);
step1.addSubStep(step1h);
step1.addSubStep(step1h1);
step1.addSubStep(step1h2);
step1.addSubStep(step1i);
list.appendStep(step1);

// add step 2 and its substeps
step2.addSubStep(step2a);
step2.addSubStep(step2b);
step2.addSubStep(step2b1);
step2.addSubStep(step2c);
step2.addSubStep(step2d);
step2.addSubStep(step2e);
step2.addSubStep(step2e1);
step2.addSubStep(step2f);
step2.addSubStep(step2f1);
step2.addSubStep(step2f2);
step2.addSubStep(step2g);
step2.addSubStep(step2h);
step2.addSubStep(step2i);
step2.addSubStep(step2i1);
list.appendStep(step2);

// add step 3 and its substeps
step3.addSubStep(step3a);
step3.addSubStep(step3b);
step3.addSubStep(step3c);
step3.addSubStep(step3d);
step3.addSubStep(step3d1);
step3.addSubStep(step3e);
step3.addSubStep(step3e1);
step3.addSubStep(step3f);
step3.addSubStep(step3g);
step3.addSubStep(step3h);
step3.addSubStep(step3h1);
step3.addSubStep(step3h2);
step3.addSubStep(step3i);
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