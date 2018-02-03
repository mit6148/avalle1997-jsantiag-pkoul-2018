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
