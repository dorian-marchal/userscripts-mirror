// ==UserScript==
// @name         Slack links
// @version      0.1
// @description  Replaces link text for Github PRs and JIRA tickets.
// @match        https://wgaming.slack.com/*
// @grant        GM_xmlhttpRequest
// @connect      jira.webedia.fr
// @connect      github.com
// ==/UserScript==

const parser = new window.DOMParser();
const alreadyReplacedClass = '__REPLACED__';

// FIXME URL suffixes, lines, etc.

//  FIXME promises
const pageNames = {};

const crossOriginRequest = (url) =>
  new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method: 'GET',
      onload: resolve,
      onerror: reject
    });
  });

// FIXME async
function getPageName(pageUrl, extractNameFromDocument, callback) {
  if (pageNames[pageUrl]) {
    setImmediate(() => callback(pageNames[pageUrl]));
  }

  crossOriginRequest(pageUrl).then((response) => {
    const doc = parser.parseFromString(response.responseText, 'text/html');
    pageNames[pageUrl] = extractNameFromDocument(doc);
    callback(pageNames[pageUrl]);
  });
}

const nameExtractorCreatorByPattern = {
  '^https://jira.webedia.fr/browse/(.*)$': (jiraId) => (doc) => {
    const titleElement = doc.querySelector('#summary-val');
    return titleElement ? `${jiraId} ${titleElement.textContent}` : null;
  },
  '^https://github.com/.*?/(.*?)/pull/(\\d+)': (projectName, prId) => (doc) => {
    const titleElement = doc.querySelector('h1.gh-header-title span');
    return titleElement ? `PR ${titleElement.textContent.trim()} (${projectName}#${prId})` : null;
  }
};

function replaceLinksText() {
  window.document.querySelectorAll(`.c-message__body a:not(.${alreadyReplacedClass})`).forEach((link) => {
    const linkText = link.textContent.trim();
    Object.keys(nameExtractorCreatorByPattern).forEach((pattern) => {
      const matches = linkText.match(new RegExp(pattern));

      if (!matches) {
        link.classList.add(alreadyReplacedClass);
        return;
      }

      getPageName(linkText, nameExtractorCreatorByPattern[pattern](...matches.slice(1)), (pageName) => {
        if (pageName) {
          link.innerHTML = pageName;
        }
        link.classList.add(alreadyReplacedClass);
      });
    });
  });
}

var observer = new MutationObserver(replaceLinksText);
observer.observe(document.querySelector('.client_main_container'), { subtree: true, childList: true });
