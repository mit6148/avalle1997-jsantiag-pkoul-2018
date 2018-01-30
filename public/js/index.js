function main() {
  get('/api/whoami', {}, function(user) {
    renderNavbar(user);
  });
}



var terminal = document.getElementById("terminal");
//For styling different elements most set to general unless specified.
function styleElement(el) {
  el.style.color = " #CFD8DC";
  //el.style.fontFamily = "Dhurjati";
  console.log("Styling an element from the terminal.");
  //Style the Game text
  if (el.className === "game") {
    console.log("is in fact in game");
    if (el.id === "title") {
      el.style.display = "block";
      el.style.textAlign = "center";
      el.style.fontSize = "36px";
      el.style.lineHeight = "1";
      el.style.textTransform = "capitalize";
      console.log("Element styled is in terminal-->game-->" + el.id);
    }

    // ADDED LEFT AND RIGHT PADDING TO THE DESCRIPTION

    if (el.id === "description") {
      el.style.display = "block";
      el.style.padding =  "0px 30px 0px 30px";
      el.style.textAlign = "none";
      el.style.lineHeight = ".9";
      el.style.justifyContent = "initial";
      el.style.fontSize = "26px";
      console.log("Element styled is in terminal-->game-->" + el.id);
    }

    // ADDED LEFT AND RIGHT PADDING TO THE QUESTIOn

    if (el.id === "question") {
      console.log("Is in fact a question.");
      el.style.display = "block";
      el.style.padding =  "0px 30px 0px 30px";
      el.style.lineHeight = "1.5";
      // el.style.textAlign = "none";
      //el.style.justifyContent = "initial";
      el.style.fontSize = "26px";
      console.log("Element styled is in terminal-->game-->" + el.id);
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

  }
}

  /* Make an element object*/
  function makeElement(type, id, className,content) {
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

  //Show text in a type writer fashion on the terminal **FIX**
  function terminaloutput(narrator, txt, rapid, wordlimit) {
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
        if (charNow === " ") {
          // if (words == wordlimit) {
          //   console.log("Break for word length");
          //   console.log("word length: " + words);
          //   narrator.innerHTML += "</br>";
          //   words = 0;
          // } else {
          //   words += 1;
          // }
          console.log(words);
          //         if ( //(txt.charAt(i - 1) === "!") | add?
          //           (txt.charAt(i - 1) === ".") |

          //           (txt.charAt(i - 1) === "”")
          //         ) {
          //           console.log("Break for '.' or '!' or 'quotes' ");
          //           console.log("word length: " + words);
          //           narrator.innerHTML += "</br>";
          //           words = 0;
          //         }
        }

        narrator.innerHTML += charNow;
        i++;
        setTimeout(typeWriter, speed);
      }
    }
    typeWriter();
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
    // terminal.append(lineHead);
    // terminal.append(userIn);
    // inputBox();
    userIn.focus();
    console.log(beforeNode);
    var cursor = makeElement("label", "input-cursor", "game", "");
    terminal.append(cursor);
    cursor.style.display = "inline";
  }

  //Add an input line for the user to respond in and call the getResponse onkeypress.
  // function addInput(beforeNode, before) {
  //   var userIn = makeElement("INPUT", "user-input", "game", "");
  //   userIn.style.display = "inline-block";
  //   var lineHead = makeElement(
  //     "div",
  //     "terminal-head",
  //     "game",
  //     "SW-ELL-ESL-EY:~ avalle$"
  //   );
  //   lineHead.style.display = "inline-block";
  //   lineHead.style.fontSize = "18px";
  //   lineHead.style.paddingBottom = "4px";
  //   userIn.style.paddingBottom = "4px";
  //   // terminal.append(lineHead);
  // //  terminal.append(userIn);
  //   // inputBox();
  //   userIn.focus();
  //   console.log(beforeNode);
  //   var cursor = makeElement("label", "input-cursor", "game", "");
  //   terminal.append(cursor);
  //   cursor.style.display = "inline";
  // }

  //Show an entire event on the terminal.
  function eventStory(eventNode) {
    var ctrls = makeElement(
      "div",
      "terminal-ctrls",
      "game",
      "CTRL+Q   |  CTRL+?"
    ); /*ADD */
    console.log(ctrls);
    //terminal.appendChild(ctrls);

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

    setTimeout(terminaloutput, timing, question, eventNode.question, 30, 10);
    timing += eventNode.question.length * 70;
    setTimeout(displayList, timing, testEvent, "options", "p", 6000, 30);
    // displayList(player, "belongings", "div", null, null);
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
      var status = listObj[labels[i]][1];
      console.log(status);
      if (status === false) {
        el.style.color = "red";
      }
      if (status === null) {
        el.style.color = "#424242";
      }
      container.appendChild(el);
      console.log(listObj[labels[i]]);
      if (timing !== null) {
        var text = listObj[labels[i]][0];
        setTimeout(terminaloutput, optTiming, el, text, txtSpeed);
        optTiming += timing;
      } else {
        el.innerHTML += listObj[labels[i]][0];
      }
    }
    if (list === "options") {
      setTimeout(addInput, optTiming, document.getElementById(list + "Box"));
    }
    terminal.appendChild(container);
  }


  var testEvent = {
    attriType: "Event",
    title: "Welcome to Back to the Routes",
    description:
    "Back to the Routes is a text based game on navigating the hard parts of college. \
    You will experience many events and have to make many decisions, but you'll have \
    your belongings and friends to help you out on the way.",
    question: "Would you like to play?",
    options: {
      A: [
        "Yes! I am ready to get hurt again.",
        true
      ],
      B: ["No but I'd like to find out more about the game.", true],
      C: ["No but I'd like to contribute stories to the game.", true]
    },
    belongings: { 0: "Get Phone", 1: "Open Backpack", 3: "View Journal" }
  };

  eventStory(testEvent);


  main();
