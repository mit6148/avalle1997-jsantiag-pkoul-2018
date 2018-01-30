// FROM CATBOOK WORKSHOP ADVANCED
// https://github.com/mit6148/catbook-advanced


function newNavbarItem(text, url) {
  itemLink = document.createElement('a');
  itemLink.className = 'nav-item nav-link';
  itemLink.innerHTML = text;
  itemLink.href = url;

  return itemLink
}

function renderNavbar(user) {
  const navbarDiv = document.getElementById('nav-item-container');

  navbarDiv.appendChild(newNavbarItem('Home', '/'));

  // NOTE: this check is a lowkey hack
  if (user._id) {
    navbarDiv.appendChild(newNavbarItem('Game', '/u/game'));
    //navbarDiv.appendChild(newNavbarItem('Profile', '/u/profile?'+user._id));
    navbarDiv.appendChild(newNavbarItem('Forum', '/u/forum'));
    navbarDiv.appendChild(newNavbarItem('Logout', '/logout'));
  } else {
    navbarDiv.appendChild(newNavbarItem('Login', '/auth/google'));
  }
}
