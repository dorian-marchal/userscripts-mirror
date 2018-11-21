// ==UserScript==
// @name         github-stars.user
// @version      0.2
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

const pageHtmlPromises = {};

(function() {
  const showStars = () =>
    document
      .querySelectorAll('.markdown-body a:not([href^="#"])')
      .forEach((link) => {
        if (link.classList.contains('anchor')) {
          return;
        }
        if (new URL(link.href).hostname !== 'github.com') {
          return;
        }
        if (!pageHtmlPromises[link.href]) {
          pageHtmlPromises[link.href] = fetch(link.href).then((res) =>
            res.text()
          );
        }
        pageHtmlPromises[link.href].then((html) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const starCount = parseInt(
            doc
              .querySelector('[aria-label$=" users starred this repository"]')
              .getAttribute('aria-label'),
            10
          );
          const color =
            starCount > 500 ? 'green' : starCount > 100 ? 'orange' : 'red';
          link.insertAdjacentHTML(
            'afterend',
            ` <span style="color:${color};">(${Intl.NumberFormat(
              'fr-FR'
            ).format(starCount)}&nbsp;★)</span>`
          );
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
