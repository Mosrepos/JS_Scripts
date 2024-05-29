// ==UserScript==
// @name         MoodleLoginTU
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to auto login into moodle of the TU Dortmund
// @author       Mohamad Abdo
// @match       *://*/*
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
        if (window.location.href === "https://moodle.tu-dortmund.de/?redirect=0") {
            console.log('On Moodle homepage, clicking login button');
            let loginButton = document.querySelector('a.btn-login');
            if (loginButton) {
                loginButton.click();
            } else {
                console.log('Login button not found on Moodle homepage');
            }
        }

        // Handle Moodle login page and redirect to SSO
        if (window.location.href === "https://moodle.tu-dortmund.de/login/index.php") {
            console.log('On Moodle login page, clicking UniAccount login button');
            let uniAccountButton = document.querySelector('.btn-primary');
            if (uniAccountButton) {
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
                        console.log('Both fields filled, clicking login button');
                        let ssoLoginButton = document.querySelector('.btn-primary');
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