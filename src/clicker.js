// ==UserScript==
// @name         YouTube Playlist Auto Player with Persistent State
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Automatically continues playing if current URL is in playlist
// @author       You
// @match        https://www.youtube.com/watch?*list=OLAK5uy_*
// @grant        GM_xmlhttpRequest
// @connect      0.0.0.0
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const PLAYLIST_URLS = [
        "https://www.youtube.com/watch?list=OLAK5uy_ny8Ggr4kEt3B0VpkkRkDW_yd8CBEIsBz0&v=WOyhIZvw9sc",
        "https://www.youtube.com/watch?list=OLAK5uy_mL9KKhg8bDSsBn7UMWnW29p49cuFPWESE&v=2_QGwCGFsro",
        "https://www.youtube.com/watch?list=OLAK5uy_ny8Ggr4kEt3B0VpkkRkDW_yd8CBEIsBz0&v=WOyhIZvw9sc",
        "https://www.youtube.com/watch?list=OLAK5uy_lrhTPHaDnDTMsSs3MpwVxiISffmUt5H2A&v=BLgg3PN6oM0",
        "https://www.youtube.com/watch?list=OLAK5uy_njfwHi2dFAKFRudvvFz4NcIZWO2qkQBEY&v=grYisoKc9pk",
        "https://www.youtube.com/watch?list=OLAK5uy_njJHUmGdgY_0ofWBk63uB7a7ZV4At_nlo&v=WZeyk4ObFqQ",
        "https://www.youtube.com/watch?list=OLAK5uy_kVOo1mef-1doWluoX1rouX5Lgqrhko5-s&v=eDL9FJS68UQ",
        "https://www.youtube.com/watch?list=OLAK5uy_kzQHStqF-VxHv5eBS4yaKhCqXTeztn4V8&v=PNUTU0vRqI8",
        "https://www.youtube.com/watch?list=OLAK5uy_lNXLYaLUOQG1HgUveu_awEOjavlPBgv84&v=f-GMYDQyTLg",
        "https://www.youtube.com/watch?list=OLAK5uy_mIJiKQScQ5-9mGg3z4HVmm_eXCILxywfU&v=vX_xeW1kbwU",
        "https://www.youtube.com/watch?list=OLAK5uy_midodhMrR-5Bh6CJDch-u3S8CFwcfLYvY&v=wCyffEmWll8",
        "https://www.youtube.com/watch?list=OLAK5uy_kD6s5v3EDtqep-DRaNL7MEf_byEPiRZR8&v=5HlhpOwzY_0",
    ];

    const PLAY_DURATION = 28 * 60 * 1000;
    const SKIP_THRESHOLD = 0.6;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function mylog(...args) {
        console.log("YTC: ", ...args);
    }

    async function notifyServer(jsonData) {
        mylog("Notifying server");
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://0.0.0.0:5007",
            data: JSON.stringify(jsonData),
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    async function checkForVideoAd() {
        //const adModule = document.querySelector('.video-ads.ytp-ad-module');
        const skipButton = document.querySelector('.ytp-skip-ad-button:not([style*="display: none"])')
        const ctaButton = document.querySelector('.ytp-ad-button-vm');
        const advertiser = document.querySelector('.ytp-visit-advertiser-link__text');
        const blueYesButton = document.querySelector('button[aria-label="Sim"]');

        if (blueYesButton) {
            mylog("Fount Yes button. Clicking");
            blueYesButton.click();
        }

        if (ctaButton && skipButton) {
            mylog("Buttons present");
            let btnText = ctaButton.querySelector('.ytp-ad-button-vm__text, .ytp-skip-ad-button__text').innerText.toLowerCase();
            if (btnText.includes("download") || btnText.includes("baixar")) {
                mylog("Download detected, ignoring: ", btnText);
            }
            else {
                mylog("CTA detected: ", btnText);
                let advertiserName = advertiser ? advertiser.innerText.toLowerCase() : "Unknown"
                let payload = {
                    "cta_text": btnText,
                    "advertiser": advertiserName
                }
                let skipClick = advertiserName.includes("google") || Math.random() > SKIP_THRESHOLD;
                mylog('Advertiser: ', advertiserName);
                if (skipClick) {
                    mylog("Skipping click for CTA: ", btnText);
                } else {
                    payload.event = "cta_clicked";
                    mylog("Clicking CTA: ", btnText);
                    ctaButton.click();
                }
                await notifyServer(payload);
                await sleep(20000);
            }
        }
    }

    async function mainLoop() {
        mylog('🚀 Main loop started');
        let sessionStartTime = Date.now();

        while (Date.now() - sessionStartTime < PLAY_DURATION) {
            await checkForVideoAd();
            await sleep(1000);
            //mylog("Checking for video");
        }
        const nextUrl = PLAYLIST_URLS[Math.floor(Math.random() * PLAYLIST_URLS.length)];
        unsafeWindow.location.href = nextUrl;
    }

    mainLoop();


})();