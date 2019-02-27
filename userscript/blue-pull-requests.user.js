// ==UserScript==
// @name         blue-pull-requests.user
// @version      3
// @match        https://github.com/search?o=desc&s=updated&p=1&q=-label%3A%E2%98%A0+-label%3Aold+org%3AWebediaGaming+is%3Apr+is%3Aopen+author%3Adorian-marchal++author%3AadrienWeiss+author%3Abibislayer+author%3Aantca+author%3Aericroge-webedia+author%3ARomainCorralJVC&type=Issues
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
.project-link {
  display: block;
}
`);

const ids = [];
document.querySelectorAll('.issue-list-item > span.ml-3').forEach((item) => {
  const id = item.textContent.trim().substr(1);
  ids.push(id);
});

const respawnLink = document.createElement('a');
respawnLink.href =
  `https://github.com/WebediaGaming/jvc-respawn/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+in%3Acomments+` + ids.join('+');
respawnLink.textContent = '- Liste des PR sur Respawn';
respawnLink.className = 'project-link';

const phoenixLink = document.createElement('a');
phoenixLink.href =
  `https://github.com/WebediaGaming/phoenix/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+in%3Acomments+` + ids.join('+');
phoenixLink.textContent = '- Liste des PR sur Phoenix';
phoenixLink.className = 'project-link';

const listWrapper = document.querySelector('#issue_search_results');

listWrapper.parentNode.insertBefore(respawnLink, listWrapper);
listWrapper.parentNode.insertBefore(phoenixLink, listWrapper);

// Warning more than 10 PR.
const issueCountEl = document.querySelector('.border-bottom h3');
if (parseInt(issueCountEl.textContent.match(/(\d+)/)[0], 10) > 10) {
  issueCountEl.innerHTML = `<g-emoji class="g-emoji" alias="warning" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/26a0.png"><img class="emoji" alt="warning" height="20" width="20" src="https://assets-cdn.github.com/images/icons/emoji/unicode/26a0.png"></g-emoji> ${
    issueCountEl.innerHTML
  }`;
}
