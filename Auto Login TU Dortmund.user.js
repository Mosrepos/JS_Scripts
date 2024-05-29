// ==UserScript==
// @name         MoodleLoginTU
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Script to auto login into Moodle of the TU Dortmund
// @match        https://moodle.tu-dortmund.de/*
// @match        https://sso.itmc.tu-dortmund.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('MoodleLoginTU script loaded');

    function handlePageLoad() {
        console.log('Page loaded');

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

        // Log current URL
        console.log('Current URL:', window.location.href);

        // Function to interact with element when it becomes available
        function waitForElement(selector, callback) {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else {
                const observer = new MutationObserver((mutationsList, observer) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        observer.disconnect();
                        callback(element);
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
        }

        // Handle Moodle homepage and redirect to login
        if (window.location.href.includes("https://moodle.tu-dortmund.de/?redirect=0")) {
            console.log('On Moodle homepage, looking for login button');
            waitForElement('#usernavigation > div.d-flex.align-items-stretch.usermenu-container > div > span > a', (loginButton) => {
                console.log('Login button found, clicking it');
                loginButton.click();
            });
        }

        // Handle Moodle login page and redirect to SSO
        if (window.location.href.includes("https://moodle.tu-dortmund.de/login/index.php")) {
            console.log('On Moodle login page, looking for UniAccount login button');
            waitForElement('#region-main > div > div > div > div > div:nth-child(2) > p:nth-child(3) > a', (uniAccountButton) => {
                console.log('UniAccount login button found, clicking it');
                uniAccountButton.click();
            });
        }

        // Handle SSO login page
        if (window.location.href.startsWith("https://sso.itmc.tu-dortmund.de/openam/XUI/?realm=/tudo&goto=")) {
            console.log('On SSO login page');
            waitForElement('#idToken1', (userField) => {
                const passField = document.querySelector('#idToken2');
                console.log('Username field:', userField);
                console.log('Password field:', passField);

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
                        waitForElement('#loginButton_0', (ssoLoginButton) => {
                            console.log('SSO login button found, clicking it');
                            ssoLoginButton.click();
                        });
                    }
                } else {
                    console.log('Username or password field not found');
                }
            });
        }
    }

    // Use both DOMContentLoaded and window.onload to ensure the script runs
    document.addEventListener('DOMContentLoaded', handlePageLoad);
    window.onload = handlePageLoad;
})();