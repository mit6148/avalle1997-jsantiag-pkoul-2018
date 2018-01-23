// HELPER FUNCTIONS*******************************************************
   /* Any made to perform specific computatins/repetitive operations*/
   //---------------------------------------------------------------------

//Taken from: https://www.webbjocke.com/javascript-check-data-types/
// Returns if a value is a string
function isString (value) {
return typeof value === 'string' || value instanceof String;
};

//Taken from: https://www.webbjocke.com/javascript-check-data-types/
// Returns if a value is really a number
function isNumber (value) {
return typeof value === 'number' && isFinite(value);
};

//---------------------------------------------------------------------
// DATABASE***************************************************************
   /* Attribute object lists stored in a database Pulled from the server
      when you enter the game. Global vars and functions.*/
    // + Parse one row at a time into an array. Each row is an attribute object and the columns are the values for its properties
  //---------------------------------------------------------------------
/*note about start and end deadlines, range from 10secs */
 
var hpStat= {
  name: "HP",  //Game Name
  this: "Physical Health", //Real Name
  status: 5,
  ranks:     {    5: "Superhuman",
                        4:"Energized", 
                        3:"Adequate", 
                        2:"Tired",
                        1:"Exhausted",
                        0:"Burned Out"},
  value: 90, //Current Value
  maxValue: 100,  //Max Stat value
  hitRate: 1,   // 0-1 How much is absorbed
  probability: .5, //Appearance in pother attributes
}
  
var spStat= {
  name : "SP",  //Game Name
  def : "Mental Health", //Real Name
  status: 5,
  ranks: {  5: "Confident",
                  4:"Capable", 
                  3:"Okay", 
                  2:"Anxious",
                  1:"Depresed",
                  0:"Worthless"},
  value : 100, //Current Value
  maxValue : 100,  //Max Stat value
  hitRate : 1,   // 0-1 How much is absorbed
  probability : .5, //appearance in other attributes
}
  
  var  ssStat = {
  name :"SS",  //Game Name
  def:"Social Status", //Real Name
  status: 2,
  ranks:  { 5: "Lengendary",
                  4:"Notable", 
                  3:"Known", 
                  2:"Forgettable",
                  1:"Loner",
                  0:"Outcast"},
  value: 50, //Current Value
  maxValue: 100,  //Max Stat value
  hitRate:1,   // 0-1 How much is absorbed
  probability: .5, //appearance in other attributes
}
  
  var assStat = { 

  name: "AS.S",  //Game Name
  def: "GPA", //Real Name
  status: 2,
  ranks :  { 5: "Genius",
                  4:"A-/B+", 
                  3:"B-", 
                  2:"Credit/None",
                  1:"D's get Degrees",
                  0:"Academic Probation"},
  value: 2.0, //Current Value
  maxValue: 4.0,  //Max Stat value
  hitRate: 1,   // 0-1 How much is absorbed
  probability: .5, //appearance in other attributes
}
  
 function statRank(stat){
   
 }
  
//---------------------------------------------------------------------

//Current stats
const userStats = {"HP":2,"SP": 2,"SS":3 ,"ASS": 4};

// STATUS EFFECT*******************************************************
   
   //---------------------------------------------------------------------
  var period = { 

  id: 1,  
  name:"period",  
  description: "Ready or not, the red seas have begun to flow from your loins",
  sideEffect: "Bloating, cramps, and fatigue headed your way" ,
  delayText: null,
  attrType: "statEffect",  
  interactionType: "no interaction",  
  userRequirement: {1: null},
  gameRequirement: {1: null},
  status:"inactive", 
  priorityRank: 4, 
  hitRate: .5, 
  startDeadline: null,
  cue: null, 
  endDeadline: null,  
  interruptPt: {preEvent: true ,preOpts: true, preOpt: true, preRoot: true},  
  timeIn: null, 
  timeOut: null,
  timing: { unitType:"decision", duration: 5, frequency: 60}
}
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
    itemOpts: {
      PickUp: { 1: {text:" Added item to backpack.",action: function(){
        spStat.value = Math.min(spStat.value+10, spStat.maxValue);
      }} },
      Use: { 1: "Item used." },
      ThrowAway: { 1: "You no longer have item in backpack." },
      Gift: { 1: "You helped your friend out by giving them an item." }
    },
    possessOpts: {
              Robbed: { 1: "Oh no. You left your backpack and someone stole it." },
              Received: { 1: "You received this from a class acquaintance." },
              Lost: { 1: "Oh no. You can't remember where you put it. It's forever lost" },
              Gifted: { 1: "You friend accepted your request and gave you a gift to help." }},
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
  timing: { unitType:"decision", duration: null, frequency: 3}
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

 var belongings= [cellPhone];
 var events={
   
 }
 var statEffects={
    period  
 }
 var items={
   weed
 }
 

//---------------------------------------------------------------------
// DECISION*******************************************************
   /* */
   //---------------------------------------------------------------------
//CITE: https://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393
 

function Decision(id, name, question, options, outcome) {
  this.objType = "Decision";
  this.id = 4;
  this.name = name;
  this.question = question;
  this.options = options;
  this.outcomes = outcome; //Can statically set what outcome has to be to be selected
}


//---------------------------------------------------------------------
// EVENTS****************************************************
   /* */
  //---------------------------------------------------------------------



//---------------------------------------------------------------------
// DICE*******************************************************
   /* */
   //-------------------------------------------------------------------
var randomAttributes = ["Event","statEffect", "Belongings", "Items" ]

function outerDie(attribute){
  this.name=attribute.name;
  this.roll=function(){
    var randomNumber =  Math.floor(Math.random() *10);
    if(randomNumber < attribute.probability) {
      attribute.status = active;
    }
  }
}


//---------------------------------------------------------------------
// PLAYER*******************************************************
   /* */
   //---------------------------------------------------------------------



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
  wendy.innerText = liCount + ": "+text;
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
  wendy.innerText = liCount + ": "+text;
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
// PLAYER*******************************************************
   /* */
   //---------------------------------------------------------------------