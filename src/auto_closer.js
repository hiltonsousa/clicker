// ==UserScript==
// @name         Close Non-Music YouTube Tabs
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Forces non-music tabs to close
// @author       You
// @match        *://*/*
// @grant        window.close
// ==/UserScript==

const ENABLED = true;
(function() {
    'use strict';
    if (ENABLED && window.location.hostname !== 'www.youtube.com') {
        //window.close();
        setTimeout(() => {
             window.close()
        }, 10000);
    }
})();