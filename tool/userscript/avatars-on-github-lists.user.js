// ==UserScript==
// @name         avatars-on-github-lists
// @version      0.1
// @match        https://github.com/*
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
.list-avatar img {
  width: 32px;
}
`);

const PROCESSED_CLASS = '__AVATAR_ADDED__';

var observer = new MutationObserver(() => {
  const rows = document.querySelectorAll(`.js-issue-row > div:not(.${PROCESSED_CLASS})`);

  rows.forEach((row) => {
    row.classList.add(PROCESSED_CLASS);

    const userEl = row.querySelector('[data-hovercard-url]');
    const hovercardUrl = userEl.dataset.hovercardUrl;
    const userId = hovercardUrl.match(/\d+$/)[0];

    const avatarWrapper = document.createElement('div');
    avatarWrapper.className = 'list-avatar float-left pl-3 py-2';
    avatarWrapper.title = userEl.textContent;

    const avatarImg = document.createElement('img');
    avatarImg.src = `https://avatars3.githubusercontent.com/u/${userId}?s=32&amp;v=4`;

    avatarWrapper.appendChild(avatarImg);

    row.insertBefore(avatarWrapper, row.querySelector('.pt-2.pl-3'));

    // Fix vertical alignment.
    const rowTitle = row.querySelector('.col-9');
    rowTitle.classList.add('col-8');
    rowTitle.classList.remove('col-9');
  });
});

observer.observe(document.querySelector('.application-main'), { subtree: true, childList: true });
