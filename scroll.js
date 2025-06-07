// ==UserScript==
// @name         ProConnect Perfect Scroll
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Flawless scrolling for both page and modals
// @author       You
// @match        https://proconnect-zeta.vercel.app/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 1. Enable smooth scrolling for main page (will not affect modals)
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.scrollBehavior = 'smooth';

    // 2. Configuration for your exact modals
    const MODALS = {
        signup: {
            id: 'signupModal',
            contentClass: 'modal-content',
            formClass: 'space-y-4' // Your form's class
        },
        login: {
            id: 'loginModal',
            contentClass: 'modal-content',
            formClass: 'space-y-4' // Your form's class
        }
    };

    // 3. Track modal state
    let currentModal = null;

    // 4. Make modal content scrollable (CRITICAL FIX)
    function enableModalScrolling(modal) {
        const config = MODALS[modal.id.replace('Modal', '').toLowerCase()];
        if (!config) return;

        const content = modal.querySelector(`.${config.contentClass}`);
        const form = modal.querySelector(`.${config.formClass}`);

        if (content) {
            // Make container scrollable
            content.style.overflowY = 'auto';
            content.style.maxHeight = '80vh'; // Limits height to viewport
            content.style.display = 'flex';
            content.style.flexDirection = 'column';
            
            // Make form take available space
            if (form) {
                form.style.minHeight = '0'; // Critical for flex scrolling
                form.style.overflowY = 'auto';
                form.style.flexGrow = '1';
            }
            
            // iOS touch scrolling
            content.style.WebkitOverflowScrolling = 'touch';
        }
    }

    // 5. Lock body scroll when modal is open
    function toggleBodyScroll(lock) {
        if (lock) {
            // Store scroll position
            document.body.dataset.scrollTop = window.scrollY;
            // Lock scroll
            document.body.style.position = 'fixed';
            document.body.style.top = `-${window.scrollY}px`;
            document.body.style.width = '100%';
        } else {
            // Restore scroll
            const scrollY = document.body.dataset.scrollTop || '0';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, parseInt(scrollY));
        }
    }

    // 6. Check modal visibility (IMPROVED DETECTION)
    function checkModals() {
        let anyModalOpen = false;

        Object.values(MODALS).forEach(config => {
            const modal = document.getElementById(config.id);
            if (modal) {
                const isVisible = window.getComputedStyle(modal).display !== 'none';
                
                if (isVisible && !currentModal) {
                    currentModal = modal;
                    enableModalScrolling(modal);
                    toggleBodyScroll(true);
                    anyModalOpen = true;
                } else if (!isVisible && currentModal === modal) {
                    currentModal = null;
                    toggleBodyScroll(false);
                }
            }
        });

        return anyModalOpen;
    }

    // 7. Set up observers (ESSENTIAL FOR DYNAMIC CONTENT)
    const observer = new MutationObserver(function() {
        if (!checkModals()) {
            // Reset main page scroll if no modals
            document.documentElement.style.scrollBehavior = 'smooth';
            document.body.style.scrollBehavior = 'smooth';
        }
    });

    // 8. Initialize everything
    function init() {
        // Initial check
        checkModals();
        
        // Watch for modal changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        // Periodic check (for SPAs)
        setInterval(checkModals, 1000);
    }

    // Start after slight delay
    setTimeout(init, 300);
})();
