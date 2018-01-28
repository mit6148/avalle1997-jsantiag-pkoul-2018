//Helper function **********************************************************
/* */
//---------------------------------------------------------------------
function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}

function isBoolean(value) {
  return typeof value === "boolean";
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
    //if()

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

var liCount = 1;
var liMAX = 20;
var terminal = document.getElementById("terminal");
var userresponse = "";

var i = 0;
var txt = "Testing terminal abilities";
var speed = 70;

//working
function makeSection(type) {
  var section = document.createElement(type);
  section.style.color = " #55ff55";
  section.class = "prompt";
  section.style.fontSize = "40px";
  section.id = "textTo";
  liCount += 1;
  //insertBefore(elementtoInsert, BeforeWhatElement)
  terminal.appendChild(section);
  return section;
}
//var narrator = makeWendy("div");  //Working\
function terminaloutput(narrator, txt, rapid, wordlimit) {
  var i = 0;
  var words = 0;
  var speed = 80;

  if (rapid !== null) {
    speed = rapid;
  }
  function typeWriter() {
    if (i < txt.length) {
      var charNow = txt.charAt(i);
      console.log(charNow);
      if (charNow === " ") {
        if (words == wordlimit) {
          narrator.innerHTML += "</br>";
          words = 0;
        }

        words += 1;
        console.log(words);
        if (
          (txt.charAt(i - 1) === ".") |
          (txt.charAt(i - 1) === "?") |
          (txt.charAt(i - 1) === "!") |
          (txt.charAt(i - 1) === "”")
        ) {
          narrator.innerHTML += "</br>";
          words = 0;
          console.log("fdfgdgfdgdfgd");
        }
      }
      narrator.innerHTML += charNow;
      i++;
      setTimeout(typeWriter, speed);
    }
  }
  typeWriter();
}
function addInput(beforeNode) {
  var temp = document.createElement("div");
  temp.contentEditable = true;

  temp.setAttribute("onkeypress", "getResponse(event)");

  temp.id = "user-input";
  insertAfter(temp, beforeNode);
  temp.focus();
}

var title = "Based God takes no L's.";
var description =
  "You were walking home from school when you noticed that the Based God forgot to fuck all your bitches. What do you do?";
var intro =
  "Welcome to the game. It is intended to do really important things for the Based God.";

function eventStory() {
  var titleEvent = makeSection("div");
  titleEvent.style.display = "block";
  titleEvent.style.textAlign = "center";
  // titleEvent.style.paddingLeft = "20px;"

  titleEvent.innerHTML = title + "</br>";
  var descriEvent = makeSection("div");
  descriEvent.style.fontSize = "20px";
  descriEvent.style.paddingLeft = "150px";
  setTimeout(terminaloutput, 2000, descriEvent, description, 30, 10);
  setTimeout(addInput, 6000, descriEvent);
}

setTimeout(eventStory,1000);

function insertAfter(el, referenceNode) {
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function getResponse(event) {
  var ctrl = event.ctrlKey;
  console.log("checking");
  console.log(event.keyCode);
  if (event.keyCode === 13) {
    event.target.setAttribute("contenteditable",false);
    console.log("User selects input.");
    console.log(event.target);
    //console.log("User input length: " + event.innerText.length);
    if (event.target.innerText > 1) {
      console.log("Invalid entry. Must be one char long");
      event.target.innerText = "";
      event.target.focus();
    } else {
      var selection = event.keyCode;
      var el = event.target;
      el.setAttribute("disabled", true);
      if ((event.keyCode >= 97) & (event.keyCode >= 122)) {
        console.log("Selected: Story option [A-Z]");
        console.log("Go to selection.");
        el.parentNode.removeChild(el);
      }
      if ((event.keyCode >= 48) & (event.keyCode <= 57)) {
        console.log("Selected: Beloning option [0-9]");
        console.log("View belongings");
      }
    }
  }

  if (ctrl & (event.keyCode === 17)) {
    console.log("quit game. ");
  }
  if (event.shiftKey & (event.keyCode === 63)) {
    console.log("Get game instructions.");
  }
}

//var myVar = setTimeout(addInput,intro.length*30+1000);
