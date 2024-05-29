// ==UserScript==
// @name         Auto Login TU Dortmund
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to auto login into moodle of the TU Dortmund
// @author       Lars Wittemeier (lars.wittemeier@tu-dortmund.de)
// @match        https://*.tu-dortmund.de/*
// @icon         https://www.tu-dortmund.de/storages/administration/_processed_/4/7/csm_favicon-600x600_ccc9d33448.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const username = 'smmhabdo';  // Replace with your actual username
    const password = 'e4KhgpP54KJTGN';  // Replace with your actual password

    console.log(window.location.href);

    if (window.location.href === "https://moodle.tu-dortmund.de/login/index.php") {
        document.getElementsByClassName("btn-primary")[0].click();
    }

    if (window.location.href.startsWith("https://sso.itmc.tu-dortmund.de/openam/XUI/?goto=https%3A%2F%2Fmoodle.tu-dortmund.de%2Flogin")) {
        var loginInterval = setInterval(function() {
            const userField = document.getElementById('idToken1');
            const passField = document.getElementById('idToken2');

            if (userField && passField) {
                if (userField.value === "") {
                    userField.value = username;
                }
                if (passField.value === "") {
                    passField.value = password;
                }

                if (userField.value !== "" && passField.value !== "") {
                    document.getElementsByClassName("btn-primary")[0].click();
                    clearInterval(loginInterval);
                }
            }
        }, 100);
    }
})();