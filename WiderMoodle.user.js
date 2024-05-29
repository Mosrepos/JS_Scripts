// ==UserScript==
// @name        WiderMoodle
// @description This is your new file, start writing code
// @match       *://*/*
// ==/UserScript==
(function() {
    function applyStyles() {
        console.log('Applying styles function called');

        var mainInnerElements = document.querySelectorAll('.main-inner');
        if (mainInnerElements.length === 0) {
            console.log('No elements found with class "main-inner"');
        } else {
            console.log('Found elements:', mainInnerElements);
        }

        mainInnerElements.forEach(function(element) {
            console.log('Styling element:', element);
            element.style.maxWidth = '100%';
            element.style.paddingLeft = '1rem';
            element.style.paddingRight = '1rem';
        });
    }

    // Check if DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('Document is ready, applying styles immediately');
        applyStyles();
    } else {
        console.log('Document not ready, waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', applyStyles);
    }
})();
