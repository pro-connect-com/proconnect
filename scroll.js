// ==UserScript==
// @name         ProConnect Scroll Fix
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fixes scroll behavior specifically for proconnect-zeta.vercel.app
// @author       You
// @match        https://proconnect-zeta.vercel.app/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 1. First disable any existing scroll behavior overrides
    document.documentElement.style.scrollBehavior = '';
    document.body.style.scrollBehavior = '';

    // 2. Apply smooth scrolling only to specific elements
    function enableSmoothScroll(el) {
        try {
            // Skip elements that are part of modals or have specific classes
            if (el.closest('.modal, .ReactModal__Overlay')) {
                return;
            }
            el.style.scrollBehavior = 'smooth';
        } catch(e) {
            console.debug('Scroll modification skipped for', el);
        }
    }

    // 3. Apply to main document and all scrollable elements
    function applySmoothScroll() {
        // Main document scrolling
        document.documentElement.style.scrollBehavior = 'smooth';
        document.body.style.scrollBehavior = 'smooth';

        // All scrollable elements except those in modals
        document.querySelectorAll('*').forEach(el => {
            const style = getComputedStyle(el);
            if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && 
                !el.closest('.modal, .ReactModal__Overlay')) {
                enableSmoothScroll(el);
            }
        });
    }

    // 4. Special handling for modal scroll containers
    function fixModalScrolling() {
        document.querySelectorAll('.modal, .ReactModal__Overlay').forEach(modal => {
            // Disable smooth scroll inside modals
            modal.style.scrollBehavior = 'auto';
            
            // Find scrollable elements inside modals
            modal.querySelectorAll('*').forEach(el => {
                const style = getComputedStyle(el);
                if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
                    el.style.scrollBehavior = 'auto';
                }
            });
        });
    }

    // 5. Initial application
    applySmoothScroll();
    fixModalScrolling();

    // 6. Watch for dynamically added content (like modals)
    const observer = new MutationObserver(function(mutations) {
        let needsUpdate = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    if (node.classList.contains('modal') || node.classList.contains('ReactModal__Overlay')) {
                        needsUpdate = true;
                    }
                }
            });
        });
        
        if (needsUpdate) {
            setTimeout(() => {
                fixModalScrolling();
                applySmoothScroll();
            }, 100);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 7. Special case for React modal scrolling (if needed)
    function handleReactModal() {
        const modalOverlays = document.querySelectorAll('.ReactModal__Overlay');
        modalOverlays.forEach(overlay => {
            overlay.style.overscrollBehavior = 'contain';
            const content = overlay.querySelector('.ReactModal__Content');
            if (content) {
                content.style.scrollBehavior = 'auto';
                content.style.overscrollBehavior = 'contain';
            }
        });
    }

    // Run periodically to catch React-rendered modals
    const modalCheckInterval = setInterval(() => {
        handleReactModal();
    }, 1000);

    // Clean up when leaving the page
    window.addEventListener('beforeunload', () => {
        clearInterval(modalCheckInterval);
    });
})();
