// ==UserScript==
// @name         Youtube Music Autoplayer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Automatically continues playing if current URL is in playlist
// @author       You
// @match        https://music.youtube.com/watch?*list=PLp5DXYs2mxpyaMwwiy4GmrKhxoi4SG1zB
// @grant        GM_xmlhttpRequest
// @connect      0.0.0.0
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const THE_PLAYLIST = 'https://music.youtube.com/watch?v=caUNCpySMmM&list=PLp5DXYs2mxpyaMwwiy4GmrKhxoi4SG1zB';

    const PLAY_DURATION = 28 * 60 * 1000;
    const SKIP_THRESHOLD = 0;
    const ENABLED = true;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let lastAdvertiser = "";

    function mylog(...args) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] YTC:`, ...args);
    }

    async function checkForVideoAd() {
        const ctaButton = document.querySelector(".ytp-ad-visit-advertiser-button");
        const skipButton = document.querySelector(".ytp-ad-skip-button-text-centered");
        const smw = document.querySelector(".html5-video-container");

        if (ctaButton && skipButton) {
            let btnText = ctaButton.innerText.toLowerCase();

            const skipStrings = [
                'google',
                'youtube'
            ];
            let containsSkipString = skipStrings.some(str => btnText.includes(str));

            let skipClick = Math.random() >= SKIP_THRESHOLD || btnText == lastAdvertiser || containsSkipString;

            if (skipClick) {
                mylog("Skipping click for CTA: ", btnText);
            } else {
                mylog("Clicking CTA: ", btnText);
                btnText = lastAdvertiser;
                ctaButton.click();
                await sleep(1000);
                smw.click();
            }
        }
    }

    function simulateClick(element) {
        if (!element) return;

        // Define the sequence of mouse events to trigger
        const events = ['mouseover', 'mousedown', 'mouseup', 'click'];

        events.forEach(eventType => {
            // Create a configurable mouse event
            const event = new MouseEvent(eventType, {
                view: window,
                bubbles: true,
                cancelable: true,
                button: 0
            });
            element.dispatchEvent(event);
        });
    }

    async function mainLoop() {
        mylog('🚀 Main loop started');
        let sessionStartTime = Date.now();

        let shuffleBtn = document.querySelector(".shuffle");
        mylog(shuffleBtn);
        simulateClick(shuffleBtn);

        while (Date.now() - sessionStartTime < PLAY_DURATION) {
            await checkForVideoAd();
            await sleep(5000);
            //mylog("Checking for video");
        }
        unsafeWindow.location.href = THE_PLAYLIST;
    }

    if (ENABLED) mainLoop();


})();