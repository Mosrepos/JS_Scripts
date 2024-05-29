// ==UserScript==
// @name         Auto Login TU Dortmund
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to auto login into moodle of the TU Dortmund
// @author       Mohamad Abdo
// @match        https://*.tu-dortmund.de/*
// @icon         https://www.tu-dortmund.de/storages/administration/_processed_/4/7/csm_favicon-600x600_ccc9d33448.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        console.log('Document loaded and script executing');

        // Function to prompt for credentials
        function promptForCredentials() {
            const username = prompt("Enter your TU Dortmund username:");
            const password = prompt("Enter your TU Dortmund password:");

            if (username && password) {
                localStorage.setItem('tuDortmundUsername', username);
                localStorage.setItem('tuDortmundPassword', password);
            } else {
                alert('Username and password are required to login.');
            }
        }

        // Retrieve credentials from local storage
        const username = localStorage.getItem('tuDortmundUsername');
        const password = localStorage.getItem('tuDortmundPassword');

        // If credentials are not stored, prompt for them
        if (!username || !password) {
            promptForCredentials();
        }

        console.log('Current URL:', window.location.href);

        if (window.location.href === "https://moodle.tu-dortmund.de/login/index.php") {
            console.log('On Moodle login page, clicking primary button');
            let loginButton = document.getElementsByClassName("btn-primary")[0];
            if (loginButton) {
                loginButton.click();
            } else {
                console.log('Login button not found on Moodle login page');
            }
        }

        if (window.location.href.startsWith("https://sso.itmc.tu-dortmund.de/openam/XUI/?goto=https%3A%2F%2Fmoodle.tu-dortmund.de%2Flogin")) {
            console.log('On SSO login page');
            var loginInterval = setInterval(function() {
                const userField = document.getElementById('idToken1');
                const passField = document.getElementById('idToken2');

                if (userField && passField) {
                    console.log('Found username and password fields');
                    if (userField.value === "") {
                        userField.value = username;
                        console.log('Filled in username');
                    }
                    if (passField.value === "") {
                        passField.value = password;
                        console.log('Filled in password');
                    }

                    if (userField.value !== "" && passField.value !== "") {
                        console.log('Both fields filled, clicking login button');
                        let ssoLoginButton = document.getElementsByClassName("btn-primary")[0];
                        if (ssoLoginButton) {
                            ssoLoginButton.click();
                        } else {
                            console.log('Login button not found on SSO login page');
                        }
                        clearInterval(loginInterval);
                    }
                } else {
                    console.log('Username or password field not found');
                }
            }, 100);
        }
    });
})();