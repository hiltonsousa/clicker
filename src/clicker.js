// ==UserScript==
// @name         YouTube Clicker
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Automatically continues playing if current URL is in playlist
// @author       You
// @match        *://*/*
// @grant        window.close
// @grant        GM_xmlhttpRequest
// @connect      0.0.0.0
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const PLAYLISTS = {
        "poesia_musicada" : {
            "urls": [
                "https://www.youtube.com/watch?v=_E0LexJATko&amp;list=OLAK5uy_mhO283OWSnQr4PDQOpzFZTHbvJCNnzfts", // Ialanda Fado
                "https://www.youtube.com/watch?v=0NCedyiKTN8&amp;list=OLAK5uy_m19EQIZg8Ci-a1mrvGq_cn37Jto_Qq6U4", // Ialanda Hills
                "https://www.youtube.com/watch?v=1r-HLt2i9Jw&amp;list=OLAK5uy_lUcRPxScF-M3xtm9vnhHJGWifjwDNdXeA", // Ialanda Caress
                "https://www.youtube.com/watch?v=2_QGwCGFsro&amp;list=OLAK5uy_mL9KKhg8bDSsBn7UMWnW29p49cuFPWESE", // Ialanda Grass
                "https://www.youtube.com/watch?v=2iHcRX1hdEo&amp;list=OLAK5uy_kDXIB4qEakDeFbhuHDlzCXgavqF-yUZlc", // Se você for à Bahia
                "https://www.youtube.com/watch?v=3zrySW-6qYQ&amp;list=OLAK5uy_khrjlZJGDjCiLOwMAmIRmenblaFSTRl_Y", // Ialanda Soul
                "https://www.youtube.com/watch?v=4kx83kAY6bk&amp;list=OLAK5uy_n4v3T6e09JS3do8caiPozIwOxYojk48u8", // Ialanda Plata
                "https://www.youtube.com/watch?v=570kd3Y0DOk&amp;list=OLAK5uy_nEwXf7rwzE-P9USl6O2zYXUyUyQjA43lw", // Passinho Patriótico
                "https://www.youtube.com/watch?v=5HlhpOwzY_0&amp;list=OLAK5uy_kD6s5v3EDtqep-DRaNL7MEf_byEPiRZR8", // Ialanda Rainbow
                "https://www.youtube.com/watch?v=5TB-Uyp2JjY&amp;list=OLAK5uy_n5VzCA_71XuI3zb6gZwkXXvDPGuyNEfg0", // Ialanda Shoegaze
                "https://www.youtube.com/watch?v=6iJsYcx5HP4&amp;list=OLAK5uy_mpRiyGGQ_PT5QNn3OwtZ84KrHEB8wUzWo", // Estações: Primavera (Vol. 2)
                "https://www.youtube.com/watch?v=Aheoz2EjcTI&amp;list=OLAK5uy_lzakOxkwzeR_q0zILJIdF0CJEJHk1fP6Q", // Reggae Symphony
                "https://www.youtube.com/watch?v=aPZwq9wV1jY&amp;list=OLAK5uy_l_opfAAAM7js-WeZTHXGuHMbnQnP9axWg", // Ialanda Waves
                "https://www.youtube.com/watch?v=AwmHShsQUKQ&amp;list=OLAK5uy_nnM3Yp-MDVz9rHJ56plj8fmbUuILzKgy8", // Xangô, Senhor da Riqueza
                "https://www.youtube.com/watch?v=BLgg3PN6oM0&amp;list=OLAK5uy_lrhTPHaDnDTMsSs3MpwVxiISffmUt5H2A", // Ialanda Shadows
                "https://www.youtube.com/watch?v=bniPraR3K9U&amp;list=OLAK5uy_moLW8gaBkxRTXOANGYsuTCEeWT8dOYIwc", // Ialanda For all
                "https://www.youtube.com/watch?v=C9Pu_UrX8pM&amp;list=OLAK5uy_lhxYe8GdXIRMRnX4oVH2ynQc98ZVyLUdI", // Kama Sutra Songs, Vol. 5
                "https://www.youtube.com/watch?v=caUNCpySMmM&amp;list=OLAK5uy_l4WEQzBUgmvLAYIwrMDul9otydrG2pas4", // Ialanda Skies
                "https://www.youtube.com/watch?v=CCHtY1bVwlY&amp;list=OLAK5uy_njc7yBJKHsWgB74Caf2Mbjod5Q6wkTkoE", // Estações: Verão
                "https://www.youtube.com/watch?v=cn7Vzt_gqjw&amp;list=OLAK5uy_kN688FCInsb17GqS9ugLqtKjUDmb5xLIM", // O ABC de Vilela
                "https://www.youtube.com/watch?v=CtLldlMkIfc&amp;list=OLAK5uy_l3pKHwi6HX7K5qEAog0YTabbqShm9aVE4", // Santo Antônio Pequenino (Encantaria Moderna)
                "https://www.youtube.com/watch?v=d4kwYVIux2g&amp;list=OLAK5uy_lvAB5WcBDwwuqdYnu6kIQdYU6AVQzJ6j8", // Ialanda Roots
                "https://www.youtube.com/watch?v=DR2TGoKPKX4&amp;list=OLAK5uy_k5oHQuJK8FmMZHL4k2N3c91DoCHWNR1SE", // Vencendo as demandas (Encantaria moderna)
                "https://www.youtube.com/watch?v=eDL9FJS68UQ&amp;list=OLAK5uy_kVOo1mef-1doWluoX1rouX5Lgqrhko5-s", // Ialanda Shallows
                "https://www.youtube.com/watch?v=EEcmjHyBYJU&amp;list=OLAK5uy_nzbxdSxVonMuNWoVxwWqLQfnHxkmUOXWU", // Ogum Beira-mar
                "https://www.youtube.com/watch?v=El3u6HjxzAY&amp;list=OLAK5uy_lHVic-miG08cAnrnbhSb2KcUfwUh3MlqI", // Estações: Outono (Vol. 2)
                "https://www.youtube.com/watch?v=EuxcM8F2cK8&amp;list=OLAK5uy_m2u0bi_gNJzmsSoQVuT7INgmk2S8dTEFg", // Ninguém igual à Pomba Gira
                "https://www.youtube.com/watch?v=eYYuMjslidI&amp;list=OLAK5uy_kLoAMgIrqVyB0fD5KMEfh2eq-NhLjSU0A", // Ialanda Sunset
                "https://www.youtube.com/watch?v=f-GMYDQyTLg&amp;list=OLAK5uy_lNXLYaLUOQG1HgUveu_awEOjavlPBgv84", // Ialanda Gumbo
                "https://www.youtube.com/watch?v=FdXRZCtHBXk&amp;list=OLAK5uy_ni-JzOb6k8dJWJAEiEa0kjnVM01QWxFnI", // Estações: Verão (Vol. 2)
                "https://www.youtube.com/watch?v=Fzkb3dgTJA0&amp;list=OLAK5uy_ku5MSVlcEsCo6ZEH178wr5_90k7F2g8WE", // Um tributo reggae à Capoeira
                "https://www.youtube.com/watch?v=g6JkRymOw_8&amp;list=OLAK5uy_lTswGeNkIUQbAbuGk_Ew3OSqAUyd_yOBw", // Ialanda Classic
                "https://www.youtube.com/watch?v=gEQUq6HxsbE&amp;list=OLAK5uy_l1Nu8dJC7HM3o8aVi7nluS8b_mvlGFbuc", // Estações: Primavera
                "https://www.youtube.com/watch?v=grYisoKc9pk&amp;list=OLAK5uy_njfwHi2dFAKFRudvvFz4NcIZWO2qkQBEY", // Ialanda Twilight
                "https://www.youtube.com/watch?v=HeJ5rU5Hx78&amp;list=OLAK5uy_kj6WZIdyX7bedh1QtBYL1-Wmn-lYS6fgc", // Coco mironga que tem dendê
                "https://www.youtube.com/watch?v=igwnJbw_Jkk&amp;list=OLAK5uy_n9d5CkgZCIi84mqmp1juUe4kHtxPnHpu8", // Ecos dos Orixás (Encantaria moderna)
                "https://www.youtube.com/watch?v=IxwUmPyzuds&amp;list=OLAK5uy_nA61Y4SL-cuVcw6XHDQyKRDSwoZRpZOiU", // O vento que sopra aqui
                "https://www.youtube.com/watch?v=ji6IykkkeZU&amp;list=OLAK5uy_kfwuRbOLXw6rDV8GvJdbrEt-znQzAcWrM", // Kama Sutra Songs, Vol. 1
                "https://www.youtube.com/watch?v=JJVCsUAlGK4&amp;list=OLAK5uy_kBGZdrj_GfYCY-82P9gGUA6eDzCwsfMEc", // Ialanda Winds
                "https://www.youtube.com/watch?v=Jk0u4RN67uA&amp;list=OLAK5uy_nfuWHFW0W3RPKb7NXtJ62jw0srsJSYlLA", // Ialanda Semba
                "https://www.youtube.com/watch?v=JZ-Kzzj3t0Y&amp;list=OLAK5uy_mLXC3llGGVYlxJHOlT5eSmcxxdLS0pEZE", // As cúmbias da Papuda - Vol. 3
                "https://www.youtube.com/watch?v=kdkF-CJAvgU&amp;list=OLAK5uy_meiAhAG6huqGLF9tgxV2GBTUn3RPNZB0Q", // Capoeira é defesa e ataque
                "https://www.youtube.com/watch?v=kKGVNyvL6ec&amp;list=OLAK5uy_m7LEkLuxewzsRmS1VvNwAtJedSfGW-jyo", // As cúmbias da Papuda
                "https://www.youtube.com/watch?v=klY7nT1phCI&amp;list=OLAK5uy_kGZRsHUYjivQXkOK5nGS-Hj9rbWvOG0W8", // Tabaréu que vem do sertão
                "https://www.youtube.com/watch?v=LPDZnX7RaX8&amp;list=OLAK5uy_mSJsld5eMHDjitUWTXDW1LCTyOMRvJHCc", // Estações: Outono
                "https://www.youtube.com/watch?v=mKbkYy-kqrw&amp;list=OLAK5uy_l6TyVwIMC0fUtea9FU3JMmVzCBxR21h9g", // Ialanda Lament
                "https://www.youtube.com/watch?v=mLmJORWP1no&amp;list=OLAK5uy_mMhR5PH-jGVOCpZElkSNidZVMRO9KqAdE", // Quem vem lá sou eu - Capoeira &amp; Reggae Fusion
                "https://www.youtube.com/watch?v=mNYzi3AnBxY&amp;list=OLAK5uy_lDrB3EOk4qWjbhYk3qvlgNKvrNMSpM3fs", // Vou pegar minha viola
                "https://www.youtube.com/watch?v=MrksJjp0siw&amp;list=OLAK5uy_mfotS2XRt9TQ2Dwa6uyIi8Kcp93IqG0hs", // Ialanda Peya
                "https://www.youtube.com/watch?v=O9z5joqEnm4&amp;list=OLAK5uy_n8x6exHEnD153sDqNr7x0h1qAR5bF1OTI", // Ialanda Raga
                "https://www.youtube.com/watch?v=oA9YqkQbYwk&amp;list=OLAK5uy_lLq90QxtxU8S5En5dbf6EC9apiuhdKJM4", // Axé dos Quatro Cantos (Encantaria Moderna)
                "https://www.youtube.com/watch?v=pgNtKxK4POk&amp;list=OLAK5uy_nSzuovk3Z2t3okbKoIl0We4qIu0czB39o", // Ialanda Tabla
                "https://www.youtube.com/watch?v=pjuKOdM19OE&amp;list=OLAK5uy_mFWmvGmIVcOCWgBcILhSNyu78zle3eYZQ", // f
                "https://www.youtube.com/watch?v=PNUTU0vRqI8&amp;list=OLAK5uy_kzQHStqF-VxHv5eBS4yaKhCqXTeztn4V8", // Ialanda Heights
                "https://www.youtube.com/watch?v=pyW8c5V6rA8&amp;list=OLAK5uy_kDfnLK62q8_n-pRuiprA7eC55yQ0jvvYk", // Estações: Inverno
                "https://www.youtube.com/watch?v=R72jTtfpnjE&amp;list=OLAK5uy_mXBmJalnwxg6IUJWc-NVfBWxbkkkU_ez0", // Ialanda Milonga
                "https://www.youtube.com/watch?v=RK-wcD_bQEU&amp;list=OLAK5uy_m8mZhPlGpOsorL7m-1Mt4Q00h-EYGq1Ls", // Pisa, caboclo
                "https://www.youtube.com/watch?v=SzFUjmKjr3Y&amp;list=OLAK5uy_k_SsvdLZba1Rut5Yh0Q5ce5TteuESeJOk", // Estações: Inverno (Vol. 2)
                "https://www.youtube.com/watch?v=t1MuMJ3_a78&amp;list=OLAK5uy_l4K7JD0blmxoH4HDi0EWIwDFgHzTx8vQ8", // Afrosereno (Encantaria moderna)
                "https://www.youtube.com/watch?v=TaU80WL31F8&amp;list=OLAK5uy_mQAjIpvg8N5ll-z_W_jQ28DtUMVviB20o", // Baiano sabe trabalhar (Encantaria Moderna)
                "https://www.youtube.com/watch?v=TftPxoZEDM0&amp;list=OLAK5uy_nvhwzogKTj69CKJSd-iNhDcBVhw4-QGyg", // Cobra verde é bom sinal
                "https://www.youtube.com/watch?v=tleNiT94yH8&amp;list=OLAK5uy_kovtkF94u1oZM60ng0uujB0dwFQPVFRkg", // Ialanda Storms
                "https://www.youtube.com/watch?v=UfxSgB4BUyY&amp;list=OLAK5uy_ny9bMEEkXrmelphA8DB6xV06DCfXVKxV0", // Ouvindo Pessoa
                "https://www.youtube.com/watch?v=USG7pCpr47E&amp;list=OLAK5uy_loFL7x3xfPT4n11N1QlV3THc8ujDimJ3M", // Ialanda Nau
                "https://www.youtube.com/watch?v=VcUWbulAvOM&amp;list=OLAK5uy_lXO6XTRqr5JmfljQSy0y86dBqbGYeOu-g", // As cúmbias da Papuda - Vol. 2
                "https://www.youtube.com/watch?v=VW4ylRF5Ekk&amp;list=OLAK5uy_kSuwuYkoruTMLPZg6Zgb-kj522wodj8Gc", // Kama Sutra Songs, Vol. 3
                "https://www.youtube.com/watch?v=vX_xeW1kbwU&amp;list=OLAK5uy_mIJiKQScQ5-9mGg3z4HVmm_eXCILxywfU", // Ialanda Blues
                "https://www.youtube.com/watch?v=vZgvpEpsgus&amp;list=OLAK5uy_k0fuwPqWqXaVAbF2_GGBfm_c058aVa6hs", // Kama Sutra Songs -, Vol. 2
                "https://www.youtube.com/watch?v=wCyffEmWll8&amp;list=OLAK5uy_midodhMrR-5Bh6CJDch-u3S8CFwcfLYvY", // Ialanda Sunrise
                "https://www.youtube.com/watch?v=WGWCB8768qg&amp;list=OLAK5uy_lLzx-CDs9lx-50IihWtY9eDbEy9j3DEls", // Lemba do barro vermelho
                "https://www.youtube.com/watch?v=wNn-qPo76tw&amp;list=OLAK5uy_njyhX5HTQ4x5fPYKhhFvW7CZBukghrrYs", // A hora é essa
                "https://www.youtube.com/watch?v=WOyhIZvw9sc&amp;list=OLAK5uy_ny8Ggr4kEt3B0VpkkRkDW_yd8CBEIsBz0", // Ialanda Delta
                "https://www.youtube.com/watch?v=WZeyk4ObFqQ&amp;list=OLAK5uy_njJHUmGdgY_0ofWBk63uB7a7ZV4At_nlo", // Ialanda Groove
                "https://www.youtube.com/watch?v=XABikyMMUxs&amp;list=OLAK5uy_lwyeCJz28qz9_bSqYYkkcqsuhn_ECJ9s8", // Camugerê, como vai vosmecê?
                "https://www.youtube.com/watch?v=XFOMJjJtvVw&amp;list=OLAK5uy_k7owvRO3v8Iq-ufLMJyPBZ1w6pSpk0QlQ", // Ialanda Drizzle
                "https://www.youtube.com/watch?v=y15j0jU515c&amp;list=OLAK5uy_lGgGzn-D3ni8gplu5yGx0zSdX5fxdyHGA", // Toda a Bahia chorou
                "https://www.youtube.com/watch?v=YKPR95SpkcY&amp;list=OLAK5uy_nV29-NthNjoy3cRWRsT6O9H8gWEKUZF4s", // Escorregar não é cair
                "https://www.youtube.com/watch?v=yoGhW0h422k&amp;list=OLAK5uy_ldpbQPzGNHDplxY3GnY9mDQgMqt9qaXWw", // Kama Sutra Songs, Vol. 4
                "https://www.youtube.com/watch?v=zaffB5pPRu4&amp;list=OLAK5uy_mu5FOZc69YkAF2zkrb1_T8nlD7WpGHjds", // Foi o rei quem mandou
                "https://www.youtube.com/watch?v=ZBmIfCsaIGs&amp;list=OLAK5uy_l4drm3FrhkPTe4MXnkhm8c35pifxHwBcQ", // Pauliceia Musicada - Poemas de Mário de Andrade
                "https://www.youtube.com/watch?v=ZLxyzm1lfMs&amp;list=OLAK5uy_lUzsmEMFGp5drY7uTPk2C1hCcZDWKtww4" // Ialanda Tides
            ],
            "max_minutes": 28,
            "start": 0,
            "end": 8
        },
        "doses_de_saude": {
            "urls": [
                "https://www.youtube.com/watch?v=JKYjDiHdXdU&list=PLp5DXYs2mxpxnpEDLiNkURTAU0tT-fLAJ",
                "https://www.youtube.com/watch?v=uuc_-V-kp7M&list=PLp5DXYs2mxpwserfFdKQq9PbGT0cMetUh",
                "https://www.youtube.com/watch?v=pPQB8yd17iI&list=PLp5DXYs2mxpwaUOWhWy7i3EOHctQnDxv8",
                "https://www.youtube.com/watch?v=mLtMtc-3CPM&list=PLp5DXYs2mxpygM7Xj5aqY_WviYR6XK6Dg",
                "https://www.youtube.com/watch?v=_W0bl18eGps&list=PLp5DXYs2mxpzhBH5pBcEbmv-edQOsOgja",
                "https://www.youtube.com/watch?v=UsFKGND3TEA&list=PLp5DXYs2mxpxKUYslR3-Ktw3Cgndiyjk8",
                "https://www.youtube.com/watch?v=aTIzOvshiPo&list=PLp5DXYs2mxpx5goQwLaZZh9VkLylHvEvN"
            ],
            "max_minutes": 60,
            "start": 8,
            "end": 16
        },
        "idle": {
            "urls": [],
            "max_minutes": 60,
            "start": 16,
            "end": 23
        }
    };

    const MAIN_STATION = true;
    const ENABLED = false;


    const SKIP_STRINGS = [
        'google',
        'youtube',
        'download',
        'baixar',
        'youtu.be'
    ];

    const SKIP_THRESHOLD = 1;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let lastAdvertiser = "";
    let advertiserName = ""
    let processedAd = false;
    let currentAdvertiser = "";

    function mylog(...args) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] YTC:`, ...args);
    }

    async function notifyServer(jsonData) {
        mylog("Notifying server");

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://0.0.0.0:5007",
                data: JSON.stringify(jsonData),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    mylog("Server responded:", response.responseText);
                    resolve(response);
                },
                onerror: function (error) {
                    console.error("Request failed:", error);
                    reject(error);
                }
            });
        });
    }

    async function checkForVideoAd() {
        const skipButton = document.querySelector('.ytp-skip-ad-button:not([style*="display: none"])')
        const ctaButton = document.querySelector('.ytp-ad-button-vm');
        const advertiser = document.querySelector('.ytp-visit-advertiser-link__text');
        const blueYesButton = document.querySelector('button[aria-label="Sim"]');

        if (blueYesButton) {
            mylog("Found Yes button. Clicking");
            blueYesButton.click();
        }

        if (ctaButton && skipButton) {
            advertiserName = advertiser ? advertiser.innerText.toLowerCase() : "Unknown"

            // Se for um novo anunciante, reseta o flag
            if (currentAdvertiser !== advertiserName) {
                processedAd = false;
                currentAdvertiser = advertiserName;
            }

            // Se já processou este anúncio, não faz nada
            if (processedAd) {
                mylog("Ad already processed, skipping");
                return;
            }

            let btnText = ctaButton.querySelector('.ytp-ad-button-vm__text, .ytp-skip-ad-button__text').innerText.toLowerCase();

            let payload = {
                "cta_text": btnText,
                "advertiser": advertiserName
            }

            let containsSkipString = SKIP_STRINGS.some(str => btnText.includes(str)) || SKIP_STRINGS.some(str => advertiserName.includes(str));

            let skipClick = lastAdvertiser == advertiserName || containsSkipString || Math.random() > SKIP_THRESHOLD

            if (lastAdvertiser == "") {
                lastAdvertiser = advertiserName;
            }

            mylog('Advertiser: ', advertiserName, " Last advertiser: ", lastAdvertiser);
            if (skipClick) {
                mylog("Skipping click for CTA: ", btnText);
                payload.event = "skip";
            } else {
                payload.event = "cta_clicked";
                mylog("Clicking CTA: ", btnText);
                ctaButton.click();
            }

            processedAd = true;
            try {
                const response = await notifyServer(payload);
                mylog("Done");
            } catch (err) {
                mylog("Error: ", err);
            }
        } else {
            if (processedAd) {
                mylog("Ad finished, resetting flag");
                processedAd = false;
                currentAdvertiser = "";
            }
        }
    }

    function closeUnwantedTab() {
        let domain = window.location.hostname;

        if (!domain.includes('.youtube.com')) {
            setTimeout(() => {
                window.close()
            }, 10000);
        }
    }

    function getCurrentPlaylistData() {
        const currentHour = new Date().getHours();

        for (const [key, playlist] of Object.entries(PLAYLISTS)) {
            const { start, end } = playlist;

            if (currentHour >= start && currentHour < end) {
                return { key, data: playlist };
            }
        }
        return null;
    }


    async function mainLoop() {
        mylog('🚀 Main loop started');

        let playlist = null;
        let nextUrl = 'https://www.youtube.com';

        if (MAIN_STATION) {
            playlist = { "key": "poesia_musicada", "data": PLAYLISTS.poesia_musicada };
        } else {
            playlist = getCurrentPlaylistData();
        }

        if (playlist.key == "idle") {
            while (playlist.key == "idle") {
                await sleep(30 * 60 * 1000);
                playlist = getCurrentPlaylistData();
            }
        } else {
            let maxMinutes = playlist.data.max_minutes;

            const PLAY_DURATION = maxMinutes * 60 * 1000;
            let sessionStartTime = Date.now();
            while (Date.now() - sessionStartTime < PLAY_DURATION) {
                await checkForVideoAd();
                await sleep(1000);
            }
        }
        let urlCount = playlist.data.urls.length;
        nextUrl = playlist.data.urls[Math.floor(Math.random() * urlCount)];
        unsafeWindow.location.href = nextUrl;
    }

    if (ENABLED) {
        closeUnwantedTab();
        mainLoop();
    }


})();