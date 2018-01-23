
  timeOut: null,
  timing: { unitType:"decision", duration: 5, frequency: 60}
}
 var statusEffects = [period];
//---------------------------------------------------------------------
// ITEMS*******************************************************
   /* */
   //---------------------------------------------------------------------
  var  weed= {
    name: "special" ,
    description: " -deep inhale- *cough* *cough*, you'll be good to go for the rest of the day",
    howTo: "Break down into small bits and roll in fine paper, apply flame, repeat until golden brown",
    warning: { 1: "you might not want to go class for a few hours", 2: "enjoy your trip" },
    delayText: { 1: "high, how are you?" },
   // goodLuck:
   // badLuck:
    PickUp: { 1: {text:" Added item to backpack.",action: function(){
        spStat.value = Math.min(spStat.value+10, spStat.maxValue);
      }} },
      Use: { 1: "Item used." },
      ThrowAway: { 1: "You no longer have item in backpack." },
      Gift: { 1: "You helped your friend out by giving them an item." },

     Robbed: { 1: "Oh no. You left your backpack and someone stole it." },
     Received: { 1: "You received this from a class acquaintance." },
     Lost: { 1: "Oh no. You can't remember where you put it. It's forever lost" },
     Gifted: { 1: "You friend accepted your request and gave you a gift to help." },
    attrType: "Item",
    interactionType: "some interaction", //what kind
    userRequirement: {1: null},
    gameRequirement: {1: null},
    status: null, 
    priorityRank: 1, 
    hitRate: 1, 
    cue: 15, // in seconds. Range of acceptablilty.
    interruptPt: {preEvent: true ,preOpts: true, preOpt: true, preRoot: true},  
    timing: { unitType:"decision", duration: 45, frequency: 3}
}
  
var itemList = [weed];
//---------------------------------------------------------------------
// BELONGING*******************************************************
   /* */
   //---------------------------------------------------------------------
  var cellPhone={
  name:"cellphone", 
  description: "You can use this to get help from a friend",
  warning: {lost:"oh no, you lost your phone!",
            stolen:"damn, your phone was stolen",
            unavailable:"you can't use that right now",
            unfortunate:"you just don't have one--sucks to suck"},
  delayText: {call:"phone's a ringing, hopefully they answer", 
              incomingCall:"oh look, you've got a call!"},
  attrType: "belonging",
  interactionType: "some interaction", //what kind
  userRequirement: {1: null},
  gameRequirement: {1: null},
  status: null, 
  priorityRank: 1, 
  hitRate: 1, 
  cue: 15, // in seconds. Range of acceptablilty.
  interruptPt: {preEvent: true ,preOpts: true, preOpt: true, preRoot: true},  
  timing: { unitType:"decision", duration: 45, frequency: 3}
}
  var backpack={
  name:"backpack", 
  description: "just holding all your stuff, keeping it together, just keep swimming",
  warning: {lost:"damn, looks like your out of luck, all your stuff is gone",
            stolen:"So, looks like someone or something stole your bag :(",
            unavailable:"you left it at home, not accessible, oh well",
            unfortunate:"oh, that? it's gone friend"},
  delayText: {view: "fetching", discard:"we're getting rid of it for you"},
  attrType: "belonging",
  interactionType: "some interaction", //what kind
  userRequirement: {1: null},
  gameRequirement: {1: null},
  status: "active", 
  priorityRank: 1, 
  hitRate: .75, 
  interruptPt: {preEvent: true ,preOpts: true, preOpt: true, preRoot: true}, /*passive vs non passive accessibility boiiiii*/  
  timing: { unitType:"decision", duration: null, frequency: 3},
  inventory: null
}

 var journal={
  name:"dethNote", 
  description: "Log of all who have wronged you. Don't worry, your time will come.",
  warning: {concurrency:"looks like you're handling a lot at the moment, sorry friend. You know how that s**t goes"},
  delayText: {recount:"this is the story of your life la la la",
             path:null}, /*upon start, journal path set to 1st event*/
  attrType: "belonging",
  interactionType: "some interaction", //what kindmakethis a number
  userRequirement: {1: null},
  gameRequirement: {1: null},
  priorityRank: 1, 
  interruptPt: {preEvent: true ,preOpts: true, preOpt: true, preRoot: true},  
}

 var belongings =  [cellPhone,backpack,journal];
//---------------------------------------------------------------------
// DECISION*******************************************************
   /* */
   //---------------------------------------------------------------------
//CITE: https://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393
 

 var temp = function Decision( objType, id, name, description,question){//,options,effects,parentObj){
  this.objType = "Decision";
  this.id = id;
  this.name = name;
  this.description = description;
  this.question = question;
  //this.options = options;
 // this.effects = effects; 
 // this.parentObj= parentObj;   
}
 
var node0 =  new Decision( 1, 
                          null,
                          "You experience a very traumatic family event in the middle of the semester. Your mental health is not great, and you are worried you may not finish the semester on time.",
                          "what do you do?", 
                          ["Talk to your Dean and try to explain the situation to all your Professors. You could use some relaxed deadlines right now.",
                           "Your main priority is to try to get home and be with family during break. You start looking for a second job, in the meantime you start selling things on free and for sale.",
                           "You just want to get through being on campus right now and smoking weed helps a lot It’s an expensive habit...",
                           "You decide to seek out your friends for extra support."],
                          {1:{spStat:-5,assStat:-5},
                           2:{hpStat:-5,aa:-5},
                           3:{spStat:5},
                           4:{ssStat:-5,spStat:-5}}, 
                          null);

var node1 = new Decision( 2,
                         "a:Talk to your Dean",
                         "Only one of your four professors this semester responds with support. The professor in your major track tells you that this institution is a place of intense academic rigor and that this was what you chose. They end their message with the following: '...perhaps you should consider pursuing another field of study.'", 
                         "You are feeling more desperate now than before, what do you do?",
                         ["put in all your effort in one class and hope for the best in the others", 
                          "Drop the class in your major track and take the hit in the hopes that it will make getting through your remaining courses doable.",
                          "c: Stop going to class and put all your effort into getting home ASAP."], 
                         {1:{assStat:-10},
                          2:{assStat:-15},
                          3:{assStat:-20}},
                          node0);

var node2 = new Decision(3,
                         "Your main priority is",
                         "You’ve spent hours on applications and asking around for leads, but this far into the semester opportunities for on campus employment are far and few between. Your sale posts of the few extra garments you have aren’t garnering much attention and you still need to come up with cash for plane tickets home.",
                         " What do you do?", 
                         ["Go to the student aid society for a travel loan", 
                          "Ask a friend for money", 
                          "Give up on the tickets, accept that you won’t be home for the funeral, and try to make it through the semester at Hellesley in one piece"] ,
                         {1:{null:null},
                          2:{ssStat:-10}, 
                          3:{spStat:-15, assStat:10}}, 
                           node0);
var node3 = new Decision(4, 
                         "You just want to get through",
                         "You smoked what was left of your stash that night in the comfort of your own room and one of your floormates slipped an anonymous note under the door notifying you that they are planning on reaching out to campus police out of 'concern for your wellbeing'",
                         "how do you deal?",
                         ["Angrily knock on everyone’s door in search of the culprit",
                         "Immediately stash all of your paraphernalia outside in the bushes and febreeze until you can hardly breathe. Plan of action? Deny, deny, deny.",
                         "Decide that whoever it is might have a point and just let it happen, risking your scholarship and aid."],
                         {1:{ssStat:-10},
                         2:{null:null}, 
                         3:{assStat:-10,spStat:-10}},
                         node0);  
var node4 = new Dictionary(5,
                           "You decide to seek out your friends", 
                           "You only reach out to three people and they are all too busy with preparing for their upcoming midterms to spend any time talking or being in the same space with you.",
                           "You feel let down, but tell each of them that you’re okay and everything is fine. Everything is not fine, how do you cope?",
                           ["retreat to your room to cry it out and hope that things get better.",
                            "Go into hibernation mode and sleep through the week.",
                            "Throw yourself into your work and use that as an escape"],
                                            {1:{spStat:2},
                                             2:{ssStat:-10, assStat:-10},
                                             3:{hpStat:-5,ssStat:10,assStat:5},
                                                      node0);   
var node5 = new Dictionary(6, "put in all your effort in one class",
                                             "Two weeks go by. You are doing well in your focus and that has helped your general state some. Unfortunately, the professor in your major track notifies you that you are at risk of not passing their class",
                                             "What do you do?",
                                             ["set up a meeting with your professor to discuss any ways to salvage the grade.",
                                             "Drop the class.",
                                             "Go to your dean and see if they can help facilitate asking for an incomplete to be finished during the first week of the next semester"],
                                             {1:{null:null},
                           2:{assStat:-10},
                           3:{spStat:-10}},
                           node1);

                           

                         

//---------------------------------------------------------------------
// EVENTS****************************************************
   /* */
  //---------------------------------------------------------------------




var requiredEvents = "List of Events that have to happen before";
var requiredDirections = "List of Events that have to happen afterwards";
var eventName = "Chronicles of A College Atrocity";

function eventTree(eventName, decision0, requiredEvents, requiredDirections) {
  this.objType = "Event";
  this.prereq = requiredEvents;
  this.requiredDirections = requiredDirections;
  this.eventName = eventName;
  var root = decision0;
  this._root = root;
}

var leaves = [];
//Give each object an objType field since cannt use type of for opbecjts

// // var options = {options:[...], personalItem:[...], Item:
// var option1 = new Decision("Option A", "", leaves, null);
// var option2 = new Decision("Option B", "", leaves, null);
// var option3 = new Decision("Option c", "", leaves, null);
var option4 = { objType: "Item", name: "Unknown Item" }; //How does discard work here? Make sure that you don't increment a counte if you don't want to by setting
var option5 = { objType: "Belonging", name: "cellphone" };
var option6 = "Terminal Commands";

var options = [node1, node2, node3, option4, option5, option6];
var rootDecision = node0;
var fakeEvent = eventTree(
  eventName,
  rootDecision,
  requiredEvents,
  requiredDirections
);


function printOptions(decisionpt) {
  var opts = [];
  var tempOpts = decisionpt._root.options;

  //Loops through the options to make them look presentable
  for (i = 0; i < tempOpts.length; i++) {
    //Check if option is a string.
    var current = tempOpts[i];
    console.log(tempOpts[i].objType + " " + i);
    if (isString(tempOpts[i])) {
      //Check if option is for the terminal.
      if (tempOpts[i] === "Terminal Commands") {
        opts.push(tempOpts[i]);
        console.log("fallthrough1");
      }
    }

    if (tempOpts[i].objType === "Item") {
      opts.push("item");
    }

    if (tempOpts[i].objType === "Belonging") {
      opts.push("belonging");
    }
    //console.log("Made it prev");
    //conolse.log(current.objType);
    //console.log();
    console.log(current.objType === "Decision");
    if (current.objType === "Decision") {
      console.log("Made it");
      opts.push(current.name);
    }
  }
  console.log("Options:  \n" + opts);
}

//printOptions(fakeEvent);
//printOptions(option1);


//---------------------------------------------------------------------
// DICE*******************************************************
   /* */
   //-------------------------------------------------------------------
// var randomAttributes = ["Event","statEffect", "Belongings", "Items" ]

// function outerDie(attribute){
//   this.name=attribute.name;
//   this.roll=function(){
//     var randomNumber =  Math.floor(Math.random() *10);
//     if(randomNumber < attribute.probability) {
//       attribute.status = active;
//     }
//   }
// }


//---------------------------------------------------------------------
// PLAYER*******************************************************
   /* */
   //---------------------------------------------------------------------

//Create some random player for testing purpoawa.
function createPlayer(){
  this.name = "Wholana";
  this.bag = backpack;
  this.cellphone = cellPhone.status();
  this.journal = journal;  
}

//---------------------------------------------------------------------
// HTML AND CSS EFFECTS***************************************************
   /*  Holds all of the functions and variables used in the game to manipulate the game page.*/
    // + Enter from the sign-in sheet by force, or by clicking a button on the forum page.
   //---------------------------------------------------------------------

//Used to make sure text doesnt overflow the container. When hit the max, set counter back to one.
var liCount = 1;
var liMAX = 20;
var terminal = document.getElementById("terminal");

//Show on page what the terminal will output on game.
function wendyRes(text){
  var wendy = document.createElement("p");
  wendy.style.color = " #55ff55"; 
  wendy.innerText = liCount + ":~ "+text;
  wendy.class = "prompt";
  wendy.style.marginLeft = "40px";
  wendy.style.fontWeight= "900";
  wendy.style.fontSize= "20px";
  wendy.id = liCount;
  liCount +=1;
  terminal.appendChild(wendy);
}

//Show on page fake selections used primarily for testing.
function wandaRes(text){
  var wendy = document.createElement("p");
  wendy.innerText = liCount + ":~ "+text;
  wendy.style.color = "#a146ff";
  wendy.style.marginLeft = "40px";
  wendy.style.fontWeight= "900";
  wendy.style.fontSize= "20px";
  wendy.class = "response";
  wendy.id = liCount;
  liCount +=1;
  terminal.appendChild(wendy);
}

//Show on page how the different elements on the page might get affected.
function helpRes(text){
  var wendy = document.createElement("p");
  wendy.innerText = liCount + ":~ "+text;
  wendy.style.color = "white ";
  wendy.style.marginLeft = "40px";
  wendy.style.fontWeight= "900";
  wendy.style.fontSize= "20px";
  wendy.class = "hidden";
  wendy.id = liCount;
  liCount +=1;
  terminal.appendChild(wendy);
}

/* //Add to the different boxes
function statusFormat(){
  var formatl1 = document.createElement("li");
  var text1 = hpStat.name + " (" + hpStat.def + ")";
  var test2 =hpStat.name + " (" + hpStat.def + ")";
  var text1 = hpStat.name + " (" + hpStat.def + ")";
  var test2 =hpStat.name + " (" + hpStat.def + ")";
  var formatl2 = document.createElement("li");
  
}
*/

//Fix line
function statusBar(text){
  var wendy = document.createElement("li");
  wendy.innerText =  ": "+text;
  wendy.style.color = "white ";
  wendy.style.marginLeft = "40px";
  wendy.style.fontWeight= "900";
  wendy.style.fontSize= "20px";
  wendy.class = "hidden";
  wendy.id = liCount;
  liCount +=1;
  terminal.appendChild(wendy);
}

function inventory(text){
  var wendy = document.createElement("li");
  wendy.innerText = liCount + ": "+text;
  wendy.style.color = "white ";
  wendy.style.marginLeft = "40px";
  wendy.style.fontWeight= "900";
  wendy.style.fontSize= "20px";
  wendy.class = "hidden";
  wendy.id = liCount;
  liCount +=1;
  terminal.appendChild(wendy);
}

function progress(text){
  var wendy = document.createElement("li");
  wendy.innerText = liCount + ": "+text;
  wendy.style.color = "white ";
  wendy.style.marginLeft = "40px";
  wendy.style.fontWeight= "900";
  wendy.style.fontSize= "20px";
  wendy.class = "hidden";
  wendy.id = liCount;
  liCount +=1;
  terminal.appendChild(wendy);
}

helpRes("text");
helpRes("text");

 
//---------------------------------------------------------------------
//*******sample Game***


wendyRes(Welcome to our game, ple)

//Create a game clock.
var gameTimer = new Date();
function startGame(){
//Start the clock
console.log("Working timer: "+ isNumber(gameTimer.getSeconds()));
  
  //Set timer for when to end game. (Simulation time = 2min*)
  console.log("Start Game.");
  window.setTimeout(function(){console.log("Game End.")}, 60000*2);
  
  //Create a random wait time between getting events. (Simulation func())
  function eventDelay() {
      //Randomly select a value from 0 to 1s
      return Math.floor(Math.random() * 1001);
  }
  
 /*Simulates  player managing multiple events while receving progress updates (Simulation: max=3). */
  function e(max=3){
    console.log("Max events at a time: " + max);
    //Let sample event list be the random events a ply gets in a game.(simluation)
    var eventEntrances = eventList;
    
    //Constant time
    
    for(i = 0; i< eventList;i++){
    //Select random delay time
    randomGenerator = eventDelay();
    
   }
   //Determine a random delay. To represent plyr playing game.
    
    
    
  }
 
  console.log("Selected Delay: " );
              
  window.setTimeout(eventTimeout(e1, gameTimer),randomGen1);
  
  //Testing purposes only.
  var randomGen2 = Math.floor(Math.floor(Math.random() * 501)/5)*5
  window.setTimeout(eventTimeout(e2, gameTimer),randomGen2);
  
  //Testing purposes only.
  var randomGen3 = Math.floor(Math.floor(Math.random() * 501)/5)*5
  window.setTimeout(eventTimeout(e3, gameTimer),randomGen3);
  
  //Testing purposes only.
  var randomGen4 = Math.floor(Math.floor(Math.random() * 501)/5)*5
  window.setTimeout(eventTimeout(e4, gameTimer),randomGen4);
  
  //Testing purposes only.
  var randomGen5 = Math.floor(Math.floor(Math.random() * 501)/5)*5
  window.setTimeout(eventTimeout(e5, gameTimer),randomGen5);
  
   //Testing purposes only.
  var randomGen6 = Math.floor(Math.floor(Math.random() * 501)/5)*5
  window.setTimeout(eventTimeout(e6, gameTimer),randomGen6); 

//also simulate using setinterval for progress bar

function timeoutMsg(e, gameTime){ 
     console.log(e);
   
    //console.log("Event" + e[id] + "terminated on: " + gameTime.getSeconds() + (gameTime.getMinutes()*60));
   // delete concur[e.id];  //Remove property
    
}

function timeStamp(e, gameTime){
  //Is there a notable delay between getting muinutes first than getting seconds? May need to switch
  // to some other date methond to get both and them seperate to prevent certain cases especially when 
  //dealing with ms.
  // console.log("Current running processes:\t" + concur);
  //Set the event's timeout
   console.log(e);
   e.timeout = gameTime.getSeconds() + (gameTime.getMinutes()*60);
   console.log("Cont: past assigning timeout");
   //console.log("Event " + e[id] + "started on: " + e[timeout]);
   
}

//Create a window time queue for event attributes
function eventTimeout(e, gameTime){
  //Create a timestamp for when the event starts.
  timeStamp(e, gameTime);
  console.log("Aprox start: "+ e.timeout);
  //Set a timeout for the end of the event's duration period.
  window.setTimeout(timeoutMsg(e,gameTime), e.interval*1000);//fix
}




}