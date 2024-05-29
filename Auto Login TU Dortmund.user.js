// ==UserScript==
// @name         MoodleLoginTU
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Script to auto login into Moodle of the TU Dortmund
// @author       Mohamad Abdo
// @match        https://moodle.tu-dortmund.de/*
// @match        https://sso.itmc.tu-dortmund.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        console.log('Script executing on:', window.location.href);

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

        // Handle Moodle homepage and redirect to login
        if (window.location.href.includes("https://moodle.tu-dortmund.de/?redirect=0")) {
            console.log('On Moodle homepage, looking for login button');
            let loginButton = document.querySelector('#usernavigation > div.d-flex.align-items-stretch.usermenu-container > div > span > a');
            if (loginButton) {
                console.log('Login button found, clicking it');
                loginButton.click();
            } else {
                console.log('Login button not found on Moodle homepage');
            }
        }

        // Handle Moodle login page and redirect to SSO
        if (window.location.href.includes("https://moodle.tu-dortmund.de/login/index.php")) {
            console.log('On Moodle login page, looking for UniAccount login button');
            let uniAccountButton = document.querySelector('#region-main > div > div > div > div > div:nth-child(2) > p:nth-child(3) > a');
            if (uniAccountButton) {
                console.log('UniAccount login button found, clicking it');
                uniAccountButton.click();
            } else {
                console.log('UniAccount login button not found on Moodle login page');
            }
        }

        // Handle SSO login page
        if (window.location.href.startsWith("https://sso.itmc.tu-dortmund.de/openam/XUI/?realm=/tudo&goto=")) {
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
                        console.log('Both fields filled, looking for login button');
                        let ssoLoginButton = document.querySelector('.btn-primary, button[type="submit"]');
                        if (ssoLoginButton) {
                            console.log('Login button found, clicking it');
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