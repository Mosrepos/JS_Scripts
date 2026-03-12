// ==UserScript==
// @name         Moodle Auto Login TU Dortmund
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatic login for TU Dortmund Moodle
// @match        https://moodle.tu-dortmund.de/*
// @match        https://sso.itmc.tu-dortmund.de/*
// @grant        none
// ==/UserScript==

(function() {
'use strict';

/* ----------------------------- */
/* Prevent script running twice  */
/* ----------------------------- */

if (window.__moodleAutoLoginLoaded) return;
window.__moodleAutoLoginLoaded = true;


/* ----------------------------- */
/* Credential storage            */
/* ----------------------------- */

let username = localStorage.getItem("tudo_user");
let password = localStorage.getItem("tudo_pass");

if (!username || !password) {

    username = prompt("TU Dortmund Username:");
    password = prompt("TU Dortmund Password:");

    if (username && password) {

        localStorage.setItem("tudo_user", username);
        localStorage.setItem("tudo_pass", password);

    } else {

        alert("Username and password required.");
        return;

    }
}


/* ----------------------------- */
/* Wait for element helper       */
/* ----------------------------- */

function waitForElement(selector, callback) {

    const element = document.querySelector(selector);

    if (element) {
        callback(element);
        return;
    }

    const observer = new MutationObserver(() => {

        const element = document.querySelector(selector);

        if (element) {
            observer.disconnect();
            callback(element);
        }

    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}


/* ----------------------------- */
/* 1. Moodle homepage login      */
/* ----------------------------- */

if (location.hostname === "moodle.tu-dortmund.de" &&
    location.href.includes("redirect=0")) {

    waitForElement(
        '#usernavigation a',
        (btn) => {

            console.log("Moodle login button clicked");
            btn.click();

        }
    );
}


/* ----------------------------- */
/* 2. Moodle UniAccount button   */
/* ----------------------------- */

if (location.pathname === "/login/index.php") {

    waitForElement(
        '#region-main a',
        (btn) => {

            console.log("UniAccount login clicked");
            btn.click();

        }
    );
}


/* ----------------------------- */
/* 3. Skip TOTP registration     */
/* ----------------------------- */

if (location.hostname === "sso.itmc.tu-dortmund.de") {

    waitForElement(
        'input[value="Login ohne Registrierung"]',
        (btn) => {

            console.log("Skipping TOTP registration");
            btn.click();

        }
    );
}


/* ----------------------------- */
/* 4. Fill SSO login form        */
/* ----------------------------- */

if (location.href.includes("openam")) {

    waitForElement("#idToken1", (userField) => {

        const passField = document.querySelector("#idToken2");

        if (!passField) return;

        console.log("Filling login credentials");

        userField.value = username;
        passField.value = password;

        userField.dispatchEvent(new Event("input", { bubbles:true }));
        passField.dispatchEvent(new Event("input", { bubbles:true }));

        waitForElement("#loginButton_0", (btn) => {

            console.log("Submitting login");
            btn.click();

        });

    });
}

})();
