// ==UserScript==
// @name         ProConnect Auth Modal Scroll Fix
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Fixes scrolling specifically for ProConnect auth modals
// @author       You
// @match        https://proconnect-zeta.vercel.app/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Configuration for your specific modals
    const MODAL_CONFIG = {
        modalClass: 'modal',                      // Outer modal container
        contentClass: 'modal-content',            // Scrollable content area
        activeClass: 'modal-active',              // When modal is visible (if applicable)
        bodyScrollLock: true                      // Prevent body scrolling when modal is open
    };

    // 1. Core fix function for a single modal
    function fixModalScroll(modal) {
        const content = modal.querySelector(`.${MODAL_CONFIG.contentClass}`);
        
        if (!content) {
            console.warn('Modal content not found', modal);
            return;
        }

        console.log('Applying scroll fixes to modal:', modal.id);

        // Make content area properly scrollable
        content.style.overflowY = 'auto';
        content.style.maxHeight = '80vh';         // Ensure it doesn't exceed viewport
        content.style.scrollBehavior = 'smooth';
        content.style.WebkitOverflowScrolling = 'touch'; // iOS smooth scroll

        // Find all scrollable sections within modal
        const scrollSections = content.querySelectorAll('[style*="overflow"], .scrollable');
        scrollSections.forEach(section => {
            section.style.overflowY = 'auto';
            section.style.maxHeight = '';          // Reset any fixed heights
        });

        // Prevent body scroll when modal is open
        if (MODAL_CONFIG.bodyScrollLock) {
            if (modal.classList.contains(MODAL_CONFIG.activeClass) {
                document.body.style.overflow = 'hidden';
            }
        }
    }

    // 2. Fix all auth modals
    function fixAuthModals() {
        const modals = document.querySelectorAll(`#signupModal, #loginModal`);
        
        modals.forEach(modal => {
            // Only process if not already fixed
            if (!modal.dataset.scrollFixed) {
                modal.dataset.scrollFixed = 'true';
                fixModalScroll(modal);
            }
        });
    }

    // 3. Handle modal open/close events
    function setupModalEvents() {
        // Override the authModals.close function to handle body scroll
        const originalClose = window.authModals?.close;
        if (originalClose) {
            window.authModals.close = function(type) {
                originalClose.apply(this, arguments);
                document.body.style.overflow = ''; // Restore body scroll
            };
        }

        // Monitor for modal visibility changes
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'class') {
                    const modal = mutation.target;
                    if (modal.classList.contains(MODAL_CONFIG.modalClass)) {
                        if (modal.classList.contains(MODAL_CONFIG.activeClass)) {
                            document.body.style.overflow = 'hidden';
                            fixModalScroll(modal);
                        } else {
                            document.body.style.overflow = '';
                        }
                    }
                }
            });
        });

        document.querySelectorAll(`.${MODAL_CONFIG.modalClass}`).forEach(modal => {
            observer.observe(modal, { attributes: true });
        });
    }

    // 4. Initial setup
    function initialize() {
        // First run
        fixAuthModals();
        setupModalEvents();

        // Periodic check (for modals that might load later)
        const checkInterval = setInterval(fixAuthModals, 2000);
        
        // Clean up
        window.addEventListener('beforeunload', () => {
            clearInterval(checkInterval);
            document.body.style.overflow = ''; // Ensure scroll is restored
        });
    }

    // Wait for necessary elements to be available
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();
