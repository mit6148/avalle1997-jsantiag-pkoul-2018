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

  //Show an entire event on the terminal.
  function eventStory(eventNode) {
    var descriEvent=null;
    if (eventNode.attriType === "Event") {
      var titleEvent = makeElement("div", "title", "game","'" + eventNode.title + "'</br>");
      terminal.appendChild(titleEvent);
      console.log("title");

      descriEvent = makeElement("div", "description", "game","");
      terminal.appendChild(descriEvent);
      console.log("description");
    }

    var question = makeElement("div", "question", "game","");
    terminal.appendChild(question);
    console.log("question");

    var timing = 500;

    //If it is an event and not a decision point
    if(descriEvent !==null){
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

    setTimeout(
      terminaloutput,
      timing,
      question,
      eventNode.question,
      30,
      10
    );

    timing += eventNode.question.length *50;
    setTimeout(setTimeout,timing,displayOptions,500,eventNode,5000,50);
  }


    function displayOptions(eventNode,timing,txtSpeed){
      var optTiming = 300;
      var optionLabels = Object.keys(eventNode.options);
      var optionsBox = makeElement("div","optionsBox","game","");
      terminal.appendChild(optionsBox);

      console.log(optionLabels);
      for (i = 0; i < optionLabels.length; i++) {
        var option = makeElement(
          "p",
          "options",
          "game",
          "["+optionLabels[i]+"] "
        );
        var status = eventNode.options[optionLabels[i]][1];
        if(status ==false | status==null){
          option.style.color = "red";
        }
        optionsBox.appendChild(option);

        var text = eventNode.options[optionLabels[i]][0];

         setTimeout(terminaloutput, optTiming, option, text, txtSpeed, 15);
        optTiming += timing;
      }
      // setTimeout(addInput, optTiming, optionsBox);
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



  // const descriptionDiv = document.getElementById('description');
  // descriptionDiv.innerHTML = "This is a text based role playing game about navigating Wellesley College.";
  //
  //
  // renderStories(user);
  //
  // const socket = io();
  //
  // socket.on('post', function(msg) {
  //     const storiesDiv = document.getElementById('stories');
  //     storiesDiv.prepend(storyDOMObject(msg,user));
  // });
  //
  // socket.on('comment', function(msg) {
  //   const commentDiv = document.getElementById(msg.parent + '-comments');
  //   commentDiv.appendChild(commentDOMObject(msg));
  // });
