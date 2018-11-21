// ==UserScript==
// @name         github-stars.user
// @version      0.1
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

(function() {
  const showStars = () =>
    document.querySelectorAll('.markdown-body a').forEach((link) => {
      if (link.classList.contains('anchor')) return;
      fetch(link)
        .then((res) => res.text())
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const starCount = parseInt(
            doc.querySelector('[aria-label$=" users starred this repository"]').getAttribute('aria-label'),
            10
          );
          console.log(starCount);
          const color = starCount > 500 ? 'green' : starCount > 100 ? 'orange' : 'red';
          link.insertAdjacentHTML('afterend', ` <span style="color:${color};">(${starCount} ★)</span>`);
        });
    });

  const button = document.createElement('button');
  button.innerText = 'Show ★';
  button.style = `
  position: fixed;
  bottom: 0;
  right: 0;
`;
  button.onclick = showStars;
  document.body.appendChild(button);
})();
