//Helper function **********************************************************
/* */
//---------------------------------------------------------------------
function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}

function isBoolean(value) {
  return typeof value === "boolean";
}

//Refocus on input when terminal is clicked since user won't be able to see it.
//Expand to work on other containers as well.
function terminalFocus() {
  //Should not occur but if does, choose the very first input element
  var inputEl = terminal.getElementsByTagName("input")[0];
  console.log("found input tag");
  inputEl.focus();
}

/***************************FOR TEXT CURSOR***********/
//http://jsfiddle.net/Paulpro/adpBM/
function inputBox() {
  var min = 10,
    max = 300,
    pad_right = 5,
    input = document.getElementById("user-input");

  input.style.width = min + "px";

  input.onkeydown = input.onkeyup = function() {
    var input = this;
    setTimeout(function() {

      var tmp = document.createElement("label");
      tmp.style.padding = "0";
      if (getComputedStyle)
        tmp.style.cssText = getComputedStyle(input, null).cssText;
      if (input.currentStyle) tmp.style = input.currentStyle;
      tmp.style.width = "";
      tmp.style.position = "absolute";
      tmp.innerHTML = input.value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/ /g, "&nbsp;");
      if(tmp.innerText.length>1){
        tmp.innerText = "";
      }
      input.parentNode.appendChild(tmp);
      var width = tmp.clientWidth + pad_right + 1;
      tmp.parentNode.removeChild(tmp);
      if (min <= width && width <= max) input.style.width = width + "px";
    }, 1);
  };
}

// STATS*******************************************************
/* */
//---------------------------------------------------------------------

//Used to take in the rank names and weights to create the stat ranks list.
function rankParser(parser, maxValue) {
  var ranking = {};
  var min;
  var max = maxValue;
  for (i = 0; i < parser.length; i++) {
    min = Math.floor(max - maxValue * parser[i][1]);
    if (i !== 0) {
      max = max - 1;
    }
    ranking[parser.length - 1 - i] = { name: parser[i][0], max: max, min: min };
    max = min;
  }
  return ranking;
}

//Creates a stat object using the specified info
////Stat: # | ".." | "..." | 0.#  |  [6][2] (["..."][0.#])  | # | #
//FIGURE OUT WHAT TO D ABOUT WEIGHTS!!!!
//current rank default **add
function statTemplate(
  id,
  name,
  title,
  maxValue,
  rankParse,
  hitRate,
  ctrlRate,
  currentRank,
  max,
  weight
) {
  var stat = {
    id: id,
    name: name,
    title: title,
    maxValue: maxValue,
    ctrlRate: 0.01, //Rate to set if value is in rank 0.
    ranks: rankParser(rankParse, maxValue),
    status: true, //Used for dice and for damageControl
    currentRank: 5,
    hitRate: 1,
    value: maxValue,
    weight: weight
  };

  if (hitRate !== null) {
    stat.hitRate = hitRate;
  }
  if (ctrlRate !== null) {
    stat.ctrlRate = ctrlRate;
  }

  if ((currentRank !== null) & (currentRank !== 0)) {
    stat.currentRank = currentRank;
    if (max) {
      stat.value = stat.ranks[stat.currentRank].max;
    } else {
      stat.value = stat.ranks[stat.currentRank].min;
    }
  }
  return stat;
}


/* Find the rank of the newly computed value. If the rank changes update the stats currentRank.
   The value is assumed to be checked before function is called and up is a condition that is passed as a
   parameter. Returns the value of the old Rank.*/
function computeNewRank(stat, up) {
  //up is  abool value.
  //Check to see if still in same rank after a value change.
  var oldRank = stat.currentRank;
  if (
    (stat.ranks[stat.currentRank].min <= stat.value) &
    (stat.value <= stat.ranks[stat.currentRank].max)
  ) {
    console.log("Value change does not change the rank.");
  }
  //If increasing the value, checks to see what the new rank is. deal will null here
  if (up) {
    i = stat.currentRank + 1;
    while (i < stat.ranks.length) {
      if (stat.value < stat.ranks[stat.currentRank].max) {
        stat.currentRank = i;

        console.log("Rank increase happened. New rank: " + i);

        break;
      }
      i++;
    }
  }
  //If decreasing the value check to see what the new rank is. deal will null here.
  if (!up) {
    i = stat.currentRank - 1;
    while (i > -1) {
      if (stat.value > stat.ranks[i].min) {
        stat.currentRank = i;

        console.log("Rank decrease happened. New rank: " + i);
        break;
      }
      i--;
    }
  }

  if (stat.currentRank != oldRank) {
    console.log("old and new rank are not the same.");
    if (stat.currentRank === 0) {
      console.log("New rank is zero");
      damageCtrl_Stat(stat, up);
    }
    //UPDATE WHAT TO DO ABOUT ACTIVE VERSUS UNACTIVE AFTER COMING BACK FROM A NULL.
    /* What to do when going from rank 0 to another rank.
             What to set the hitRate to be.*/
    if (oldRank === 0) {
      console.log("Leave danger of rank 0.");
      damageCtrl_Stat(stat, up);
    }
  }
}

/* Given a stat and a wanted hitRate, update the stats hit rate only if
   currently able to and the entry is valid.*/
function changeHitRate_Stat(stat, rate) {
  //Check to see if hitRate given is of type number
  if (isNumber(rate)) {
    //Check to see if hitRate given is in valid range.
    if ((rate < 0) | (rate > 1)) {
      console.log("Hit rate given not in range 0-1.");
    } else {
      //Checks to see if status is set to null i.e no hitRate change is allowed.
      if (stat.status === null) {
        console.log("At this time the stat is too low to change.");
      } else {
        console.log("Old hitRate: " + stat.hitRate);
        stat.hitRate = rate;
        console.log("New hit rate: " + stat.hitRate);
      }
    }
  } else {
    console.log("Hit rate given not a number.");
  }
}

/*If status is null, use ctrlRate instead of hitRate.*/
function damageCtrl_Stat(stat, up) {
  //Check if the current rank is  now zero. If it is,

  if (up) {
    console.log("Recovered from rank 0.");
    stat.hitRate = 0.2;
    stat.status = true;
  }
  if (up === false) {
    stat.hitRate = ctrlRate;
    stat.status = null;
    console.log("Recovered from rank 0.");
  }
  if (up === null) {
    console.log(
      "Stat was the same before and after and still at zero. Do nothing."
    );
  }
}

/*Change the status of the stat as being
    affectable(true), nonaffectable(false), notaffectable(null) until no longer in rank 0. */
function changeStatus_Stat(stat, status) {
  //If the user's status is already null
  if (stat.status === null) {
    console.log("At this time the status of this stat cannot be changed.");
  } else {
    //If null is attempted to be used to change the status. not allowed in game play.
    if (status === null) {
      console.log("You cannot change status to null.");
    } else if (isBoolean(status)) {
      //If true/false and the user's current status is not null. Update.
      stat.status = status;
      console.log("Status was changed. New Status: " + stat.status);
    } else {
      console.log("Invalid status entered. Stat status was not changed.");
    }
  }
}

/* Changes the current value of the user. If the new value is larger than the max than set to max.
   If the value is smaller than the min than see use stat weight to see if player dies. If player
   doesn't die give do something. Else, end the game. If the new value causes a rank change,
   enable the damage control if the new rank is now zero. If the value change causes a status change, fill with active bool.'*/
function changeValue_Stat(stat, change, active) {
  //Determine whether change can be applied.
  if (!isNumber(change)) {
    console.log("Invalid entry for stat value change.");
  } else if (change === 0) {
    console.log("Change of zero applied. No effect.");
  } else {
    if (stat.status !== false) {
      console.log("Change can be applied.");

      var success = Math.floor(Math.random() * 101);

      console.log("You got the number: " + success);
      console.log(
        "Effect successful if number in range: 0-" + stat.hitRate * 100
      );

      //Determines whether change is successful.
      if (success <= stat.hitRate * 100) {
        console.log("Effect will successfully happen.");

        stat.value = Math.min(stat.value + change * hitRate, stat.maxValue);
        if (stat.value < 0) {
          stat.value = 0;
        }
        computeNewRank(stat, change > 0);
      } else {
        console.log("Change was not successful.");
      }
    } else {
      console.log("Change cannot be applied"); //If false only.
    }
  }
}

/*Computes the new rank for the stat with respects to its max bound(true) or min bound(false) */
function changeRank_Stat(stat, newRank, max) {
  //Check if valid bool given
  if (max === null) {
    console.log("Invalid entry given for max/min bool. Rank not changed.");
  } else {
    //Check if the value will be the lower or upper bound of the rank
    if (max) {
      stat.value = stat.ranks[newRank].max;
      stat.rank = newRank;
      console.log("Value is the max of rank: " + newRank);
    } else {
      stat.value = stat.ranks[newRank].min;
      stat.rank = newRank;
      console.log("Value is the min of rank: " + newRank);
    }
  }
}

var hpParse = [
  ["Superhuman", 0.3],
  ["Energized", 0.25],
  ["Adequate", 0.15],
  ["Tired", 0.15],
  ["Exhausted", 0.1],
  ["Burned Out", 0.05]
];

var hpStat = statTemplate(
  1,
  "HP",
  "Health Points",
  200,
  hpParse,
  null,
  null,
  null,
  null,
  null
);

var mpParse = [
  ["Confident", 0.15],
  ["Capable", 0.2],
  ["Okay", 0.2],
  ["Anxious", 0.15],
  ["Depresed", 0.15],
  ["Worthless", 0.15]
];
var mpStat = statTemplate(
  2,
  "MP",
  "Mental Points",
  150,
  mpParse,
  null,
  null,
  null,
  null,
  null
);

var ssParse = [
  ["Lengendary", 0.05],
  ["Notable", 0.25],
  ["Known", 0.4],
  ["Forgettable", 0.1],
  ["Loner", 0.1],
  ["Outcast", 0.1]
];
var ssStat = statTemplate(
  3,
  "SS",
  "Social Status",
  100,
  ssParse,
  null,
  null,
  2,
  true,
  null
);

var assParse = [
  ["Genius", 0.05],
  ["A-/B+", 0.1],
  ["B-", 0.3],
  ["Credit/None", 0.2],
  ["D's get Degrees", 0.2],
  ["Academic Probation", 0.15]
];
var assStat = statTemplate(
  4,
  "AS.S",
  "Academic Standing Status",
  200,
  assParse,
  null,
  null,
  2,
  null,
  null
);


function checkStat(name,check){
  if(name==="mpStat"){
   return !!(mpStat.value =check);
  }
  if(name==="hpStat"){
   return !!(hpStat.value === check);
  }
  if(name==="ssStat"){
   return !!(ssStat.value === check);
  }

  if(name==="assStat"){
   return !!(assStat.value === check);
  }
}
// Player*******************************************************
/* */
// //---------------------------------------------------------------------
function quitGame() {
  console.log("Game is ended");
}

function recall() {
  //   console.log("Random entries are read from the journals path property. ");
}
function help() {
  //   console.log("Re-instuct players on how to go about the game.");
}
function Decision(
  id,
  name,
  description,
  question,
  optionParse,
  requirementParse
) {
  var decision = {
    objType: "Decision",
    id: id,
    name: name,
    description: description,
    checkRequirements: null,
    disabledText: "Unfortunately this option is unavailable. ", //default
    question: question,
    options: { q: quitGame(), review: recall(), help: help() },
    outcomes: outcome,
    transitionType: "normal"
  };

  // parse the optionParse data into the decision object.
  // set inactive to any
  // id | attributeType
  function options() {
    return 0;
  }

  //When user selects, compares game condition and decision. If player meets it,
  //returns text asking the user to confirm. Else, it returns a disabled text,
  //because of so and so.
  function checkRequirements() {}

  //Return true or false if selection is successful.
  function select(decisionNode) {}
}

var journal = {
  name: "dethNote",
  description:
    "Log of all who have wronged you. Don't worry, your time will come.",
  warning: {
    concurrency:
      "looks like you're handling a lot at the moment, sorry friend. You know how that s**t goes"
  },
  delayText: {
    recount: "this is the story of your life la la la",
    path: null
  } /*upon start, journal path set to 1st event*/,
  attrType: "belonging",
  interactionType: "some interaction", //what kindmakethis a number
  userRequirement: { 1: null },
  gameRequirement: { 1: null },
  priorityRank: 1,
  interruptPt: { preEvent: true, preOpts: true, preOpt: true, preRoot: true }
}; //

//Imported or stored somewhere. Database or in game?
//TO be used between events.
var transitionText = [
  "Time went by until...",
  "You settled into your life until..."
];
function journal(transitionText, currentEvent, eventCarryLimit) {
  var journal = {
    name: "deathNote",
    desciption:
      "Log of all who have wronged you. Don't worry, your time will come.",
    warningText:
      "looks like you're handling a lot at the moment, sorry friend. You know how that s**t goes",
    //toggleText:  ,
    //randomText,
    //
    eventCarryLimit: 3,
    actions: null,
    attributeType: "beloning",
    transitionText: transitionText,
    currentEvent: null,
    currentDecision: null,
    path: null
  };

  var entry = {
    titie: null,
    description: null,
    status: null, //terminated, ongoing,
    eventId: null,
    eventRecap: null,
    transitionType: "normal"
  };

  if (currentEvent !== null) {
    journal.currentEvent = currentEvent;
    //journal.currentDecision = currentEvent.root;
  }
  if (eventCarryLimit !== null) {
    journal.eventCarryLimit = eventCarryLimit;
  }

  function addEntry(currentNode, nextNode, interruption, status) {
    var transitionType;

    //Save the last Event and last decision made by player.
    var lastEvent = path[path.length - 1];
    var lastDecision = lastEvent[lastEvent.length - 1];

    //Check if the node is an Event by looking at it's attribute type.
    if (currentNode.attributeType == "Event") {
      //If the event was not found in end, Add event.
      //**For recaping the story, find all of the rows with same Id retell.
      if (currentNode.Id != lastEvent.Id) {
        path.push(currentNode);
        console.log("New chapter written into you journal.");
      } else {
        console.log("This chapter already exists within here.");
      }
    }
    //terminated "Which you ran out of time , completed,"which you finished" , dropped "you had so much going on you had to give this one up." place on event. If currently still have, "which you are currently dealing with".
    //Check if the node is a decision by looking at it's attribute type.
    if (currentNode.attributeType == "Decision") {
      if (currentNode.Id != lastDecision) {
        lastEvent.push(currentNode);
        console.log("New update written into your journal.");
      } else {
        console.log("This update already exists within here.");
      }
    }
  }

  //   function recapEvent(){

  //   }

  function recapStory() {
    var story = path;
    if (story.path === 0) {
      console.log("No story to recount at this time");
    }
    //     else{

    //     }
  }
  // getTransitionText
  // changeFocus
  // replaceEvent
  // sendReminder
  // setEventStatus//terminated, completed, null(for static required)
}

/*****************************PAGE STYLING AND ELEMENT CREATING***/
/* Make an element object*/
function makeElement(type, id, className, content) {
  if (type === null) {
    console.log("Element has no type and no reference. Couldn't be created");
  } else {
    //Create an element of said type.
    var el = document.createElement(type);
    el.id = id;
    el.className = className;
    el.innerHTML = content;
    console.log("New ELEMENT id: " + el.id);
    console.log("ClassName: " + el.className);
    console.log(el);
    styleElement(el);
    return el;
  }
}

//For styling different elements most set to general unless specified.
function styleElement(el) {
  el.style.color = " #CFD8DC";
  //el.style.fontFamily = "Dhurjati";
  console.log("Styling an element from the terminal.");
  //Style the "Start Game" page.
  if (el.className === "start") {
    el.style.display = "block";
    el.style.textAlign = "center";
    el.style.justifyContent = "center";
    el.style.marginTop = "15%";
    el.style.fontSize = "90px";
    el.style.lineHeight = "1";
    el.style.textTransform = "capitalize";
    console.log("Element styled is in terminal of type: start");
  }

  //Style the Game text
  if (el.className === "game") {
    console.log("is in fact in game");

    if (el.id === "title") {
      el.style.display = "block";
      el.style.padding =  "1% 0% 0% 0%";
      el.style.textAlign = "center";
      el.style.fontSize = "200%";
      el.style.lineHeight = "1";
      el.style.textTransform = "capitalize";
      console.log("Element styled is in terminal-->game-->" + el.id);
    }
    if (el.id === "description") {
      el.style.display = "block";
      el.style.padding =  "0% 6% 0% 6%";
      el.style.textAlign = "none";
      el.style.lineHeight = ".9";
      el.style.justifyContent = "initial";
      el.style.fontSize = "150%";
      console.log("Element styled is in terminal-->game-->" + el.id);
    }
    if (el.id === "question") {
      console.log("Is in fact a question.");
      el.style.display = "block";
      el.style.padding =  "0% 6% 0% 6%";
      el.style.lineHeight = "1";
      el.style.fontSize = "150%";
      console.log("Element styled is in terminal-->game-->" + el.id);
    }
    if (el.id === "optionsBox") {
      el.style.padding =  "0% 6% 0% 6%";
      el.style.lineHeight = "1";
      el.style.marginTop = "0%";
      el.style.fontSize = "100%";
      // el.style.lineSpacing = "0.5em";
      el.style.marginRight = "5%";
      el.style.marginLeft = "5%";
      el.style.textAlign = "left";
      console.log("Element styled is in terminal-->game-->" + el.id);
    }

    if (el.id === "belongingsBox") {
      //ADD
      el.style.display = "flex";
      el.style.paddingRight = "30px";
      el.style.paddingLeft = "30px";
      el.style.marginRight = "30px";
      el.style.marginLeft = "30px";
      el.style.width = "80%";
      el.style.verticalAlign = "middle";
      el.style.justifyContent = "space-between";
      el.style.borderStyle = "dashed ";
      el.style.position = "fixed";
      el.style.top = "85%";
      console.log("Element styled is in terminal-->game-->" + el.id);
    }

    if (el.id === "terminal-ctrls") {
      /*ADD */
      el.innerHTML = "CTRL+Q";
      el.style.background = "#757575";
      el.style.height = "3%";
      el.style.fontSize = "100%";
      el.style.color = "white";
      el.style.paddingLeft = "7px";
      el.style.paddingRight = "7px";
      el.style.background = "transparent";
      el.style.borderStyle = "dashed double dashed double";
      el.style.position = "fixed";
      el.style.left = "85.5%";
      el.style.bottom = "93%";
      console.log("Element styled is in terminal-->game-->" + el.id);
    }

    //Style the "End Game" text.
    if (el.id === "end") {
      el.style.display = "block";
      el.style.textAlign = "center";
      el.style.justifyContent = "center";
      el.style.fontSize = "44px";
      console.log("Element styled is in terminal of type: end");
    }
  }
  //Style the user input element.
  if (el.id === "user-input") {
    el.style.fontSize = "16px";
    el.style.background = "transparent";
    el.style.color = "transparent";
    el.style.border = "none";
    el.style.letterSpacing = "2px";
    el.setAttribute("maxLength",1);
    el.setAttribute("onkeypress", "getResponse(event)");
    console.log(el);
    console.log("Element styled is in terminal of type: input");
  }
  if (el.className === "statPanel") {
    console.log("Styling an element of the statPanel");
  }

  if (el.className === "map") {
    console.log("Styling an element of the statPanel");
  }

  if (el.className === "progressBar") {
    console.log("Styling an element of the statPanel");
  }
}

//Insert new element on page.
function insert(newElement, targetElement, before) {
  //Check if valid input
  if ((newElement === null) | (targetElement === null)) {
    console.log(
      "No element entered. Either new element or target element is null."
    );
  } else {
    //Target Element is the parent. Insert element at end of list.
    if (before === null) {
      referencept = null;
      targetElement.appendChild(newElement);
      console.log(
        "Target element is the target parent. Elemnet added at end of child node list."
      );
    } else if (!before) {
      //Add the element after the target Element
      targetElement.parentNode.insertBefore(
        newElement,
        targetElement.nextSibling
      );
      console.log(
        "Position  new element after target Element: " + targetElement.id
      );
    } else {
      targetElement.parentNode.insertBefore(newElement, targetElement);
      console.log(
        "Position  new element after target Element: " + targetElement.id
      );
    }
    //Insert the element at specifed location.
  }
}

//Add an input line for the user to respond in and call the getResponse onkeypress.
function addInput(beforeNode, before) {
  var userIn = makeElement("INPUT", "user-input", "game", "");
  userIn.style.display = "inline-block";
  var lineHead = makeElement(
    "div",
    "terminal-head",
    "game",
    "SW-ELL-ESL-EY:~ avalle$"
  );
  lineHead.style.display = "inline-block";
  lineHead.style.fontSize = "18px";
  lineHead.style.paddingBottom = "4px";
  userIn.style.paddingBottom = "4px";
  terminal.append(lineHead);
  terminal.append(userIn);
  inputBox();
  userIn.focus();
  console.log(beforeNode);
  var cursor = makeElement("label", "input-cursor", "game", "");
  terminal.append(cursor);
  cursor.style.display = "inline";
}

var liCount = 1;
var liMAX = 20;
var terminal = document.getElementById("terminal");
var userresponse = "";

//Show text in a type writer fashion on the terminal **FIX**
function terminaloutput(narrator, txt, rapid) {
  console.log("print to terminal");

  var i = 0;
  var words = 0;
  var speed = 80;
  console.log(narrator);
  console.log(txt);

  if (narrator.id === "description") {
    narrator.innerHTML = "STORY: ";
  }

  if (narrator.id === "question") {
    narrator.innerHTML = "Q: ";
  }

  if (rapid !== null) {
    speed = rapid;
  }
  function typeWriter() {
    if (i <= txt.length) {
      var charNow = txt.charAt(i);
      //console.log(charNow);
      if (txt.charAt(i) === "?") {
        console.log("Break for '?'");
        console.log("word length: " + words);
        charNow += "</br>";
      }
      narrator.innerHTML += charNow;
      i++;
      setTimeout(typeWriter, speed);
    }
  }
  typeWriter();
}

function displayList(obj, list, type, timing, txtSpeed) {
  var optTiming = 600; //if want to have one line appear at a time.
  var listObj = obj[list];
  console.log(listObj);
  var labels = Object.keys(listObj);
  var container = makeElement("div", list + "Box", "game", "");

  console.log(labels);
  for (i = 0; i < labels.length; i++) {
    var el = makeElement(type, list, "game", "[" + labels[i] + "] ");
    var status = listObj[labels[i]][0];
    console.log(status);
    if (status === false) {
      el.style.color = "red";
    }
    if (status === null) {
      el.style.color = "#424242";
    }
    container.appendChild(el);
    console.log(listObj[labels[i]]);
    // if (timing !== null) {
    //   var text = listObj[labels[i]][1];
    //   setTimeout(terminaloutput, optTiming/2, el, text, txtSpeed);
    //   optTiming += timing;
    // } else {
      el.innerHTML += listObj[labels[i]][1];
   // }
  }
  if (list === "options") {
    setTimeout(addInput, optTiming/2, document.getElementById(list + "Box"));
  }
  terminal.appendChild(container);
}

function clearCanvas(parentNode) {
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild);
  }
}

function displayunicode(e){
var unicode=e.keyCode? e.keyCode : e.charCode;
return unicode;
}
//Prompts the user for a valid response. Returns the selection.
//User can enter at most one char.
function getResponse(event) {
  console.log(event.keyCode);

  try{
    var input = event.target.value.charCodeAt(0);
    console.log(input);
  if((event.target.value==="") & event.keyCode==13){
    console.log("Invalid entry.");
  }

  //Hits the space bar and is avaiable.
  if(validCodes[32][0] & event.keyCode===32 ){
         console.log("START GAME.");
         parentPointer = testEvent;
         computeLists([player.belongings,parentPointer.options], true,false);
         eventStory(testEvent); //First node
      }

  //User quits game and opt avaiable.
  if (validCodes[17]!==null & validCodes[17]!==undefined & event.ctrlKey & event.keyCode===17 & validCodes[17][0]) {
    console.log("QUIT GAME.");
    parentPointer = null;
    childPointer = null;
    clearCanvas(terminal);
    end();
  }

  //User gets game instructions and is avaiable.
  if ( validCodes[63]!==null & validCodes[63]!==undefined & event.shiftKey & event.keyCode===63& validCodes[63][0]){
      console.log("INSTRUCTIONS.");
       // childPointer = testEvent;
      clearCanvas(terminal);
      help();
     }

  //Selects something that requres ENTER and is avaiable.
  if(event.keyCode===13){
    console.log("testing controls of user");
    console.log(event.target.value);
    console.log(validCodes[input]);
    if(validCodes[input][2].attriType==="Decision"| validCodes[input][2].attriType==="Event"){
      if(validCodes[input][0]!==null){
       parentPointer = validCodes[input][2];
      console.log(parentPointer);
      childPointer = null;
      }

      clearCanvas(terminal);
      //console.log(validCodes[input]);
      eventStory(parentPointer);

      console.log("Selected an option.");
    }
    if(validCodes[input][1]==="belonging"){
      clearCanvas(terminal);
      //disable for now
      //childPointer = validCodes[input][2];
      console.log("Selected a belonging");
    }
  }
    return 1;
  }
  catch(err){
    console.log("invalid entry");
    return 0;
  }

  }


//Show an entire event on the terminal.
function eventStory(eventNode) {
  clearCanvas(terminal);
  var ctrls = makeElement(
    "div",
    "terminal-ctrls",
    "game",
    "CTRL+Q   |  CTRL+?"
  ); /*ADD */
  console.log(ctrls);
  terminal.appendChild(ctrls);

  var descriEvent = null;
  if (eventNode.attriType === "Event") {
    var titleEvent = makeElement(
      "div",
      "title",
      "game",
      "'" + eventNode.title + "'</br>"
    );
    terminal.appendChild(titleEvent);
    console.log("title");

    descriEvent = makeElement("div", "description", "game", "");
    terminal.appendChild(descriEvent);
    console.log("description");
  }

  var question = makeElement("div", "question", "game", "");
  terminal.appendChild(question);
  console.log("quesion");

  var timing = 1000;

  //If it is an event and not a decision point
  if (descriEvent !== null) {
    setTimeout(
      terminaloutput,
      timing,
      descriEvent,
      eventNode.description,
      30,
      10
    );
    timing += eventNode.description.length * 50;
  }

  setTimeout(terminaloutput, timing, question, eventNode.question, 30, 60);
  setTimeout(displayList, timing, parentPointer, "options", "p", 500, 70);
  displayList(player, "belongings", "div", null, null);
}

var d1d = {
  attriType: "Decision",
  title:"You decide to seek out your friends",
  description: "You only reach out to three people and they are all too busy with preparing for their upcoming midterms to spend any time talking or being in the same space with you.",
  question: "You feel let down, but tell each of them that everything is fine. Everything is not fine,how do you cope?",
  options: {
    A: [null,"retreat to your room to cry it out and hope that things get better."],
    B: [null,"Go into hibernation mode and sleep through the week"],
    C: [null,"Throw yourself into your work and use that as an escape"]
     }
};

var d1c = {
  attriType: "Decision",
  title: "You just want to get through being on campus right now, and smoking weed helps a lot. It’s an expensive habit...",
  description: "You just want to get through, You smoked what was left of your stash that night in the comfort of your own room and one of your floormates slipped an anonymous note under the door notifying you that they are planning on reaching out to campus police out of concern for your wellbeing",
  question:"how do you deal?",
  options: {
    A: [null,"Angrily knock on everyone’s door in search of the culprit"],
    B: [null,"Immediately stash all of your paraphernalia outside in the bushes and febreeze until you can hardly breathe. Plan of action? Deny, deny, deny."],
    C: [null,"Decide that whoever it is might have a point and just let it happen, risking your scholarship and aid."]
     }
};


var d1b = {
  attriType: "Decision",
  title: "Your main priority is to try to get home and be with family during break. You start looking for a second job, in the meantime you start selling things on free and for sale.",
  description: "Two weeks go by. You are doing well in your focus and that has helped your general state some. Unfortunately, the professor in your major track notifies you that you are at risk of not passing their class",
  question:"What do you do?",
  options: {
    A: [null,"Set up a meeting with your professor to discuss any ways to salvage the grade."],
    B: [null,"Drop the class."],
    C: [null,"Go to your dean and see if they can help facilitate asking for an incomplete to be finished during the first week of the next semester."]
     }
};

var d1a= {
  attriType: "Decision",
  title: "Talk to your Dean, and try to explain the situation to all your Professors. You could use some relaxed deadlines right now..",
  description: "Only one of your four professors this semester responds with support. The professor in your major track tells you that this institution is a place of intense academic rigor and that this was what you chose. They end their message with the following: ‘...perhaps you should consider pursuing another field of study.’",
  question:"You are feeling more desperate now than before, what do you do?",
  options: {
    A: [null,"Put all your effort into one class and hope for the best in the others."],
    B: [ null,"Drop the class in your major track and take the hit in the hopes that it will make getting through your remaining courses doable"],
    C: [ null,"Stop going to class and put all your effort into getting home"]
     }
};


var testEvent = {
  attriType: "Event",
  title: "The Blue Period",
  description:"You experience a very traumatic family event in the middle of the semester. Your mental health isn't doing great, and you're worried you may not finish the semester on time.",
  question:"What do you do?",
  options: { A: [true, d1a.title, d1a], B: [true, d1b.title, d1b],
  C: [ true, d1c.title, d1c], D:[true, d1d.title, d1d]
     }
};


//Belongings
var player = {
  name: "Player",
  age: 52,
  belongings: {
    0: [null,"Backpack"],
    1: [true,"Journal"],
    2: [ null,"Journal"],
  }
};

//Default: testingEvent and start page
var parentPointer = null;
var childPointer = null;
var validCodes = {
};


function computeLists(dic1,terminal,spacebar){
  console.log(dic1);
  if(terminal){
  validCodes[17] = [true,"terminal"];
  validCodes["?".charCodeAt(0)] = [true,"terminal"];
  }
  if(spacebar){
    validCodes[32] = [ true,"spacebar"];
  }

  try{
    console.log("Number of lists: "+dic1.length);
    for(i=0;i<dic1.length;i++){

      var opts = Object.keys(dic1[i]);
      console.log(opts.length);
      for(j=0; j<opts.length;j++){
        console.log([opts[j].charCodeAt(0)]);
        validCodes[opts[j].charCodeAt(0)] = dic1[i][opts[j]];
      }

    }
  }
  catch(err){
     //alert("No items present");
    console.log("Testing try/catch in list dispaly");
  }

  }



// computeLists(player.belongings);
// computeLists(testEvent.options);

// validCodes[17] = ["terminal", true];
// validCodes["A".charCodeAt(0)] = ["option", true];
// validCodes["?".charCodeAt(0)] = ["terminal", true];
//
console.log(validCodes);

function game() {
  terminal.setAttribute("onclick",terminalFocus);
  validCodes[32] = [ true,"spacebar"];

  start();

  console.log(start);
}

function start(){
  clearCanvas(terminal);
  var home = makeElement("div", "title", "start", "WANDA'S WORLD");
  terminal.append(home);
  //SPACE keycode= 32.
  var instrI = makeElement("div", "title", "game", "Hit the ");
  instrI.style.fontSize = "26px";
  instrI.style.marginLeft = "28%";
  instrI.style.display = "inline";
  terminal.append(instrI);

  var key = makeElement("div", "title", "start-key", "SPACE BAR");
  key.style.fontSize = "32px";
  key.style.display = "inline";
  key.style.textDecoration = "underline";
  terminal.append(key);

  var instrE = makeElement("div", "title", "game", " to Enter");
  instrE.style.fontSize = "26px";
  instrE.style.display = "inline";
  terminal.append(instrE);

  var start = makeElement("INPUT", "user-input", "startIn", "");
  start.style.display = "block";

  start.addEventListener('onkeypress', getResponse);
  terminal.addEventListener('click',terminalFocus);
  start.focus();
  terminal.append(start);
}

function end(){
  clearCanvas(terminal);
  //terminal.onclick = false;
  terminal.removeEventListener('onclick',terminalFocus);
  var home = makeElement("div", "title", "start", "THE END");
  home.style.marginBottom = "none";
  terminal.append(home);


  //SPACE keycode= 32.
  var instrI = makeElement("a", "title", "dog", "Forum ");
  instrI.style.fontSize = "26px";
  instrI.style.marginLeft = "36%";
  instrI.style.display = "inline";
  instrI.style.marginRight = "5%";
  instrI.style.textDecoration = "underline";
  instrI.href = "https://78.media.tumblr.com/7db4fea6413654d8e7ce6db6dbf59cd0/tumblr_n7edj9VHt51sfzzico1_500.gif";
  terminal.append(instrI);


  var instrE = makeElement("a", "title", "game", " Play Game");
  console.log(instrE);

  instrE.style.fontSize = "26px";
  instrE.style.display = "inline";
  instrE.style.padding = "10px";
  instrE.style.textDecoration = "underline";
  instrE.setAttribute('onclick',start);
  console.log(instrE);
  terminal.append(instrE);

}

//end();

function help(){
   //terminal.onclick = false;
  clearCanvas(terminal);
  terminal.removeEventListener('onclick',terminalFocus);
  var home = makeElement("div", "title", "game", "How to Play");
  home.style.textDecoration = "underline";
  home.style.marginBottom = "none";
  terminal.append(home);

  //SPACE keycode= 32.
  var instrI = makeElement("a", "title", "dog", "Important stuff here about playing blah blah blah here here here it goes yeah ");
  instrI.style.fontSize = "26px";
  instrI.style.marginLeft = "10%";
  instrI.style.display = "inline";
  instrI.style.marginRight = "5%";

  terminal.append(instrI);



}
game();
//help();

//eventStory(testEvent,player);
//displayList(testEvent,"options",5000,null);

// function Timer(callback, delay) {
//     var timerId, start, remaining = delay;

//     this.pause = function() {
//         window.clearTimeout(timerId);
//         remaining -= new Date() - start;
//     };

//     this.resume = function() {
//         start = new Date();
//         window.clearTimeout(timerId);
//         timerId = window.setTimeout(callback, remaining);
//     };

//     this.resume();
// }

// var timer = new Timer(function() {
//     alert("Done!");
// }, 1000);

// timer.pause();

// timer.resume();
