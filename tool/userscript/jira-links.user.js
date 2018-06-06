// ==UserScript==
// @name         Better links
// @version      0.12
// @description  Replaces link text for Github PRs and JIRA tickets.
// @updateURL    https://github.com/dorian-marchal/phoenix/raw/userscript-jira-links/tool/userscript/jira-links.user.js
// @downloadURL  https://github.com/dorian-marchal/phoenix/raw/userscript-jira-links/tool/userscript/jira-links.user.js
// @match        https://wgaming.slack.com/*
// @match        https://github.com/*
// @grant        GM_xmlhttpRequest
// @connect      jira.webedia.fr
// @connect      github.com
// ==/UserScript==

const parser = new DOMParser();

const CACHE_DURATION_MS = 1 * 60 * 1000;
const ALREADY_REPLACED_CLASS = '__REPLACED__';

const pageNamesPromises = {};

// From https://github.com/lodash/lodash/blob/4.17.5/lodash.js#L14242
const htmlEscape = (stringToEscape) => {
  const reUnescapedHtml = /[&<>"']/g;
  const reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return stringToEscape && reHasUnescapedHtml.test(stringToEscape)
    ? stringToEscape.replace(reUnescapedHtml, (key) => htmlEscapes[key])
    : stringToEscape;
};

const iconTemplate = (base64png) => `<img style="vertical-align: middle;" src="data:image/png;base64,${base64png}"/>`;
const jiraIconHtml = iconTemplate(`
  iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBI
  WXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gQaCjgfynw1ygAAATRJREFUOMuNk8FRw0AMRd9mKMBU
  QKgAZ7J3QgWEDsgle0xSAVCB4bgnQgVJB7iAncEdxB2QDsRFmxHGYawZj7TS15es1ToR4Zw4H77V
  nEiKbS/GEjgf1kAFbIENkAmugRWwBl4kxeecMzpTvJAUj5qYqxcau/qFFBFEBKbLWdZMl0X2289g
  yuxzIoLzYQwcgCOwlxQXzocCKLVOKym2zocKmANj4E5SrE8zcD4cNACw0JYrPW+ABvjU81FSvOzO
  4MPYFVBrUgPsgZ2Jv2XjwjhfgXttuwDegQeN7cwQW8X2XmOpbWZwo7o0hSaSYtNLcIbEykJS3FrH
  nz1Q9s2Q5P8WqdGbsHLTBxz17P8Y+AJuOyRr58NsSAdPqh9V701sNYRgbuy6M4/5EILCrq8+pLrz
  iyf5AXqfkHABePGAAAAAAElFTkSuQmCC
`);
const storyIconHtml = iconTemplate(`
  iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBI
  WXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4gYGEAckUhdrMwAAAMtJREFUOMvNkj8LQXEUhp/fLx/A
  jkk22WysDD6GuotRyEcwSQYMfA3FyqSQVVlcw83/kpiOicJN7r0GZzznvE/v2zngsRRAtp/MKJGW
  QOBLnSkiRic97GoARJoOxABBpVQLQN8bLtyHAHx2k3K8QdgfferNDzMqo9zbrrYDvIoBIv6YrQ3t
  9Qp/DlidFqxOC3eA43VLbVKkOs6zv6ydAayzSW1SYHexOFw31KclrLP54ZV7CXGTv50aqLsD04V+
  +YggIoZDyBKNwS/qBtsbQG+4ScWxAAAAAElFTkSuQmCC
`);
const subTaskIconHtml = iconTemplate(`
  iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBI
  WXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4gYGEAsAwqHA7gAAAS1JREFUOMutkz1Pg1AUhp8D2CKo
  S6Oplg46mOjE6mB3w2Ti5A9g8Q/ZP+Dm3EmHOjs5uLcYMcZJmyLhw4FASgBDou92zrnnzXnuuRf+
  KAFwbl8dRMbAoGWbl0jiTs53J0oWK9ftmwFSS1IZA2h5AkBT4HSg01tXi6Mfy5iHl4AoqYw+XDHI
  NLJ0nAODp/ewyJ3sGYjA/SyonaVk0Dc1Ht9Cbp6/itzl0QZ9U2uEaazkOMe9NQAuDs1anEaDkaVz
  ZW/RVQUAe7vDd5xWcEoG/iLibN8gjE3snU7RnKurSgWnFE29AEEYbqp0FGm10JJBlMDdbFlcXs7/
  m5Smgr+ICOK0lAviFH8RtdvCKk6u2WfE1AvqDMTLX2MdTu1jhnmBkEjiZiYtfwLMQXH5D/0AniNg
  2xMh/vUAAAAASUVORK5CYII=
`);
const githubIconHtml = iconTemplate(`
  iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBI
  WXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gQaCwgTHU4lJQAAAiBJREFUOMuNUzFrFEEU/ua93dwm
  3s7d7t4RA3aCYCFYnhqNWAYsbASLFLb5BzaWgp2iRVDBIoUpRGxsRRPFwkaw1iAKicnd7dyRnLnb
  nXkWuQ2roMmr3jy+73vfvJmn8FfU6/VLzHwDwBUlMgMAotQGgNfW2mfGmNUyXpVybkTRU/a8Bfwn
  bJ4vt9P0JgBbFuAkSdY8onM4QuTOfeh0OhcBWAaARhQte8zzWZ6vjrLsejdNN4j5BCm1LSIdAarb
  7fatUZbd9jzvlM88O1mpnBzs7b2A1ro13WzKdLMpcRwvjZtUAUyVmlYLt3EcLxV4rXWLJpgXD+5n
  7ZNxugNgUBLYASAA4JxbKYoTzIsE5lkAsM6NAHSOMIJ169xwf3I8Sxg/FZTa7PV664exjTHfoNRP
  AIDIDBXWANQA0BEcEETq41xIgO8AwErVkiS5ehg7iqJ5JtLY7/yDSKk1J4Ktdtu6PH8eheGFf5Hj
  MDzPRI+Ls4i8oSzPH46GGUTEmn6/39vdfUdEA611qwAGQXCZiLb9IHjPRMdLAg/IGPPJr/iPppvN
  ibrvz1Wr1YUwDD8qpbYKYKVS2dFaN/740iL30jT9fLALcRS9JaIz1rmzItI3xpgSPmwkySYTTY33
  4WU7Ta+hPPVums5BqRUm+uoxfwEwUxI4VpDzPL9TkAGAy7YGg8GrySDYg1IN3/eXh8PhLwCo1Wq+
  EjntgPudbvdumfMbJe7aBenMssIAAAAASUVORK5CYII=
`);

const tagHtml = (label, backgroundColor, textColor = '#FFF') =>
  `<span style="
    background-color: ${backgroundColor};
    color: ${textColor};
    font-size: 12px;
    padding: 1px 3px;
    border-radius: 3px;
  ">${label}</span>`;

const crossOriginRequest = (url) =>
  new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method: 'GET',
      onload: resolve,
      onerror: reject
    });
  });

const getLinkHtml = async function(pageUrl, extractLinkHtmlFromDocument) {
  if (!pageNamesPromises[pageUrl] || pageNamesPromises[pageUrl].expireDate < new Date()) {
    const expireDate = new Date(new Date().getTime() + CACHE_DURATION_MS);
    pageNamesPromises[pageUrl] = {
      expireDate,
      linkHtml: crossOriginRequest(pageUrl).then((response) => {
        const doc = parser.parseFromString(response.responseText, 'text/html');
        return extractLinkHtmlFromDocument(doc);
      })
    };
  }

  return pageNamesPromises[pageUrl].linkHtml;
};

const nameExtractorCreatorByPattern = {
  '^https://jira.webedia.fr/browse/([^?]*)': (jiraId) => (doc) => {
    const titleElement = doc.querySelector('#summary-val');
    const title = htmlEscape(titleElement.textContent);
    const stateElement = doc.querySelector('#status-val');
    const stateText = stateElement ? stateElement.textContent.trim() : null;
    const typeElement = doc.querySelector('#type-val');
    const typeText = typeElement ? typeElement.textContent.trim() : null;
    let iconHtml = jiraIconHtml;
    if (typeText === 'Story') {
      iconHtml = storyIconHtml;
    } else if (typeText === 'Sub-task') {
      iconHtml = subTaskIconHtml;
    }
    return titleElement
      ? `
        ${iconHtml}
        ${stateText === 'Prêt' ? tagHtml('prêt', '#4a6785') : ''}
        ${stateText === 'Open' ? tagHtml('open', '#4a6785') : ''}
        ${stateText === 'A raffiner' ? tagHtml('à raffiner', '#4a6785') : ''}
        ${stateText === 'À faire' ? tagHtml('à faire', '#4a6785') : ''}
        ${stateText === 'In Progress' ? tagHtml('in progress', '#ffd351', '#000') : ''}
        ${stateText === 'À revoir' ? tagHtml('à revoir', '#ffd351', '#000') : ''}
        ${stateText === 'À valider' ? tagHtml('à valider', '#ffd351', '#000') : ''}
        ${stateText === 'Terminé' ? tagHtml('✔', '#14892c') : ''}
        ${jiraId} ${title}
      `
      : null;
  },
  '^https://github.com/.*?/(.*?)/pull/(\\d+)': (projectName, prId) => (doc) => {
    const titleElement = doc.querySelector('h1.gh-header-title span');
    const title = htmlEscape(titleElement.textContent.trim());
    const stateElement = doc.querySelector('.gh-header .State');
    const stateText = stateElement ? stateElement.textContent.trim() : null;
    return titleElement
      ? `
        ${githubIconHtml}
        ${stateText === 'Merged' ? tagHtml('✔', '#6f42c1') : ''}
        ${stateText === 'Open' ? tagHtml('open', '#2cbe4e') : ''}
        ${stateText === 'Closed' ? tagHtml('✘', '#cb2431') : ''}
        PR ${title} (${projectName}#${prId})
      `
      : null;
  }
};

const replaceLinksText = function() {
  const jiraLinksSelector = '.c-message__body a';
  const githubLinksSelector = '.markdown-body a';
  const links = document.querySelectorAll(`
    ${jiraLinksSelector}:not(.${ALREADY_REPLACED_CLASS}),
    ${githubLinksSelector}:not(.${ALREADY_REPLACED_CLASS})
  `);
  links.forEach((link) => {
    const linkText = link.textContent.trim();
    Object.keys(nameExtractorCreatorByPattern).forEach((pattern) => {
      link.classList.add(ALREADY_REPLACED_CLASS);

      const matches = linkText.match(new RegExp(pattern));

      if (!matches) {
        return;
      }

      const capturedParams = matches.slice(1).map(htmlEscape);
      getLinkHtml(linkText, nameExtractorCreatorByPattern[pattern](...capturedParams)).then((linkHtml) => {
        if (linkHtml) {
          link.innerHTML = linkHtml;
        }
      });
    });
  });
};

var observer = new MutationObserver(replaceLinksText);
const jiraAppSelector = '.client_main_container';
const githubAppSelector = '.application-main';
observer.observe(document.querySelector(`${jiraAppSelector}, ${githubAppSelector}`), { subtree: true, childList: true });
