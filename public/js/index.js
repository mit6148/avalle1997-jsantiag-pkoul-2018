function main() {
  get('/api/whoami', {}, function(user) {
    renderNavbar(user);

    // //Show an entire event on the terminal.
    // function eventStory(eventNode) {
    //   var descriEvent=null;
    //   if (eventNode.attriType === "Event") {
    //     var titleEvent = makeElement("div", "title", "game","'" + eventNode.title + "'</br>");
    //     terminal.appendChild(titleEvent);
    //     console.log("title");
    //
    //     descriEvent = makeElement("div", "description", "game","");
    //     terminal.appendChild(descriEvent);
    //     console.log("description");
    //   }
    //
    //   var question = makeElement("div", "question", "game","");
    //   terminal.appendChild(question);
    //   console.log("quesion");
    //
    //   var timing = 1000;
    //
    //   //If it is an event and not a decision point
    //   if(descriEvent !==null){
    //   setTimeout(
    //     terminaloutput,
    //     timing,
    //     descriEvent,
    //     eventNode.description,
    //     30,
    //     10
    //   );
    //     timing += eventNode.description.length * 50;
    //   }
    //
    //   setTimeout(
    //     terminaloutput,
    //     timing,
    //     question,
    //     eventNode.question,
    //     30,
    //     10
    //   );
    //
    //
    //   timing += eventNode.question.length *50;
    //   setTimeout(setTimeout,timing,displayOptions,500,eventNode,5000,50);
    // }

    // const descriptionDiv = document.getElementById('description');
    // descriptionDiv.innerHTML = "This is a text based role playing game about navigating Wellesley College.";


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
  });
}

main();
