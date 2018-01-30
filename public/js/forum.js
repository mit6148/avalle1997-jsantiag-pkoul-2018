// FROM CATBOOK WORKSHOP ADVANCED
// https://github.com/mit6148/catbook-advanced

function main() {
  get('/api/whoami', {}, function(user) {
    renderNavbar(user);
    renderStories(user);
    renderUserData(user);

    const socket = io();

    socket.on('post', function(msg) {
        const storiesDiv = document.getElementById('stories');
        storiesDiv.prepend(storyDOMObject(msg,user));
    });

    socket.on('comment', function(msg) {
      const commentDiv = document.getElementById(msg.parent + '-comments');
      commentDiv.appendChild(commentDOMObject(msg));
    });
  });
}

function renderUserData(user) {
  // rendering latest post
	const latestPostCard = document.getElementById('latest-post-card');

  const creatorSpan = document.createElement('a');
  creatorSpan.className = 'story-creator card-title';
  creatorSpan.innerHTML = user.name;
  creatorSpan.setAttribute('href', '/u/profile?'+user._id);
  latestPostCard.appendChild(creatorSpan);

	const latestPost = document.createElement('p');
	latestPost.className = 'story-content card-text';
  latestPost.innerHTML = user.last_post;
  latestPostCard.appendChild(latestPost);
}

main();
