// ==UserScript==
// @name        WiderMoodle
// @description This is your new file, start writing code
// @match       *://*/*
// ==/UserScript==
(function() {
    function applyStyles() {
        var mainInnerElements = document.querySelectorAll('.main-inner');
        if (mainInnerElements.length === 0) {
        } else {
        }

        mainInnerElements.forEach(function(element) {
            element.style.maxWidth = '100%';
            element.style.paddingLeft = '1rem';
            element.style.paddingRight = '1rem';
        });
    }

    // Check if DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        applyStyles();
    } else {
        document.addEventListener('DOMContentLoaded', applyStyles);
    }
})();
