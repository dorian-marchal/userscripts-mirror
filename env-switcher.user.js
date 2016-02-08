// ==UserScript==
// @name        JVC Environment Switcher
// @namespace   dorian.marchal
// @include     http://*.jeuxvideo.com/*
// @require     http://code.jquery.com/jquery-2.2.0.min.js
// @version     1
// @grant       none
// ==/UserScript==


var $j = jQuery.noConflict(true);

if (window.top !== window.self) return;

(function($) {

var createButton = function(domain, name) {

  var currentDomain = location.href.match(/^https?:\/\/([a-z]+)\./)[1];

  return $('<a>', {
    class: '' + (currentDomain === domain ? 'primary' : 'default'),
    text: name,
    href: location.href.replace(/^(https?:\/\/)[a-z]+(\..*)/, '$1' + domain + '$2'),
    css: {
      marginRight: '3px',
      display: 'inline-block',
      backgroundColor: (currentDomain === domain ? '#58C' : '#DDD'),
      color: (currentDomain === domain ? '#FFF' : '#000'),
      padding: '1px 3px',
      fontSize: '12px',
      borderRadius: '2px',
    },
  });
};

var $container = $('<div>', {
  css: {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: 1000000,
  },
});

$('body').append($container);
$container.append(createButton('dorianm', 'Dorian'));
$container.append(createButton('demo', 'Démo'));
$container.append(createButton('seo', 'SEO'));
$container.append(createButton('preprod', 'Préprod'));
$container.append(createButton('www', 'Prod'));

})($j);
