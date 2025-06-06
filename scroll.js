// ==UserScript==
// @name         ProConnect Modal Scroll Fix
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Fixes modal scrolling on proconnect-zeta.vercel.app
// @author       You
// @match        https://proconnect-zeta.vercel.app/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - Adjust these based on your modal structure
    const MODAL_SELECTORS = [
        '[role="dialog"]', // Common ARIA modal pattern
        '.ReactModal__Content', // React modals
        '.modal-content', // Bootstrap modals
        '.MuiDialog-container' // Material UI modals
    ];

    // 1. Function to enable proper modal scrolling
    function fixModalScroll(modal) {
        if (!modal) return;

        console.log('Fixing scrolling for modal:', modal);

        // Make sure the modal is scrollable
        modal.style.overflowY = 'auto';
        modal.style.scrollBehavior = 'auto';

        // Find the scroll container if it's not the modal itself
        const scrollContainer = modal.querySelector('.scrollable, [style*="overflow"], .modal-body') || modal;

        // Apply scroll fixes
        scrollContainer.style.overflowY = 'auto';
        scrollContainer.style.scrollBehavior = 'auto';
        scrollContainer.style.WebkitOverflowScrolling = 'touch'; // For iOS

        // Prevent body from scrolling when modal is open
        if (modal.classList.contains('open') {
            document.body.style.overflow = 'hidden';
        }
    }

    // 2. Function to detect and fix all modals
    function fixAllModals() {
        MODAL_SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(modal => {
                // Only fix if not already processed
                if (!modal.dataset.scrollFixed) {
                    modal.dataset.scrollFixed = 'true';
                    fixModalScroll(modal);
                }
            });
        });
    }

    // 3. MutationObserver to catch dynamically loaded modals
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    MODAL_SELECTORS.forEach(selector => {
                        if (node.matches(selector)) {
                            fixModalScroll(node);
                        }
                        node.querySelectorAll(selector).forEach(fixModalScroll);
                    });
                }
            });
        });
    });

    // 4. Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 5. Initial run
    setTimeout(fixAllModals, 1000); // Wait for initial render

    // 6. Periodic check (for modals that might appear later)
    const checkInterval = setInterval(fixAllModals, 3000);

    // 7. Clean up when leaving the page
    window.addEventListener('beforeunload', () => {
        clearInterval(checkInterval);
    });

    // 8. Special handling for touch devices
    document.addEventListener('touchmove', function(e) {
        MODAL_SELECTORS.forEach(selector => {
            const modal = e.target.closest(selector);
            if (modal) {
                // If we're at the top or bottom of modal, prevent body scroll
                if (modal.scrollTop <= 0 || 
                    modal.scrollTop + modal.clientHeight >= modal.scrollHeight) {
                    e.preventDefault();
                }
            }
        });
    }, { passive: false });
})();
