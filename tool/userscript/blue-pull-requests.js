// ==UserScript==
// @name         PR bleues
// @match        https://github.com/search?q=-label%3A%E2%98%A0+org%3AWebediaGaming+is%3Apr+is%3Aopen+author%3Adorian-marchal++author%3Aantoinezimmermann+author%3ABrykou+author%3AadrienWeiss&type=Issues
// @grant        none
// ==/UserScript==

const ids = [];

document.querySelectorAll('.issue-list-item > span.ml-3').forEach((item) => {
  const id = item.textContent.trim().substr(1);
  ids.push(id);
});

const onRespawn = confirm('Respawn ? (Double "Echap" pour rester sur cette page).');
location.replace(
  `https://github.com/WebediaGaming/${
    onRespawn ? 'jvc-respawn' : 'phoenix'
  }/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+in%3Acomments+` + ids.join('+')
);
