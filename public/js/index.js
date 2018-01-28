function main() {
  get('/api/whoami', {}, function(user) {
    renderNavbar(user);

    const descriptionDiv = document.getElementById('description');
    descriptionDiv.innerHTML = "This is a text based role playing game about navigating Wellesley College.";


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
