// ==UserScript==
// @name         ProConnect Smart Scroll
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Perfect scroll handling for ProConnect
// @author       You
// @match        https://proconnect-zeta.vercel.app/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 1. Enable smooth scrolling for main page
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.scrollBehavior = 'smooth';

    // 2. Modal scroll configuration
    const MODAL_SELECTORS = ['#signupModal', '#loginModal'];
    const MODAL_CONTENT_CLASS = 'modal-content';
    let activeModal = null;

    // 3. Core scroll lock logic
    function handleScrollLock(shouldLock) {
        if (shouldLock) {
            // Store current scroll position
            document.body.dataset.previousScroll = window.scrollY;
            // Lock body scroll
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            // Restore body scroll
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            // Return to previous scroll position
            window.scrollTo(0, parseInt(document.body.dataset.previousScroll || '0'));
        }
    }

    // 4. Modal scroll setup
    function setupModalScroll(modal) {
        const content = modal.querySelector(`.${MODAL_CONTENT_CLASS}`);
        if (!content) return;

        // Make modal content scrollable
        content.style.overflowY = 'auto';
        content.style.maxHeight = '80vh';
        content.style.WebkitOverflowScrolling = 'touch';

        // Track active modal
        modal.addEventListener('click', () => activeModal = modal);
        content.addEventListener('scroll', (e) => e.stopPropagation());
    }

    // 5. Check for modal open state
    function checkModalState() {
        const openModal = MODAL_SELECTORS.find(selector => {
            const modal = document.querySelector(selector);
            return modal && window.getComputedStyle(modal).display !== 'none';
        });

        if (openModal) {
            if (!activeModal || activeModal.id !== openModal) {
                activeModal = document.querySelector(openModal);
                setupModalScroll(activeModal);
                handleScrollLock(true);
            }
        } else if (activeModal) {
            handleScrollLock(false);
            activeModal = null;
        }
    }

    // 6. Initialize with MutationObserver
    const observer = new MutationObserver(() => {
        checkModalState();
        // Setup all modals on page
        MODAL_SELECTORS.forEach(selector => {
            const modal = document.querySelector(selector);
            if (modal && !modal.dataset.scrollSetup) {
                modal.dataset.scrollSetup = 'true';
                setupModalScroll(modal);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // 7. Handle touch devices
    document.addEventListener('touchmove', (e) => {
        if (activeModal) {
            const content = activeModal.querySelector(`.${MODAL_CONTENT_CLASS}`);
            if (content && !content.contains(e.target)) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    // 8. Initial setup
    setTimeout(checkModalState, 500);
    setTimeout(checkModalState, 1000); // Double check for slow loading

    // 9. Cleanup
    window.addEventListener('beforeunload', () => {
        handleScrollLock(false);
    });
})();
    }

    // 3. Lock body scroll when modals are open
    function handleBodyScroll() {
        const modals = document.querySelectorAll('#signupModal, #loginModal');
        const isModalOpen = Array.from(modals).some(modal => 
            modal.style.display !== 'none' && 
            modal.style.visibility !== 'hidden'
        );
        
        document.body.style.overflow = isModalOpen ? 'hidden' : '';
    }

    // 4. Set up mutation observer to catch modal state changes
    const observer = new MutationObserver(function(mutations) {
        let needsFix = false;
        
        mutations.forEach(function(mutation) {
            // Check for modal visibility changes
            if (mutation.target.id === 'signupModal' || 
                mutation.target.id === 'loginModal') {
                needsFix = true;
            }
            
            // Check for newly added modal elements
            mutation.addedNodes.forEach(function(node) {
                if (node.id && (node.id === 'signupModal' || node.id === 'loginModal')) {
                    needsFix = true;
                }
            });
        });
        
        if (needsFix) {
            setTimeout(() => {
                forceModalScrollFix();
                handleBodyScroll();
            }, 100);
        }
    });

    // 5. Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // 6. Initial run with retry logic
    function initialize() {
        forceModalScrollFix();
        handleBodyScroll();
        
        // Fallback check in case modals load late
        let attempts = 0;
        const maxAttempts = 5;
        const checkInterval = setInterval(() => {
            forceModalScrollFix();
            handleBodyScroll();
            attempts++;
            
            if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
            }
        }, 500);
    }

    // 7. Start the script
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }

    // 8. Ensure cleanup
    window.addEventListener('beforeunload', () => {
        document.body.style.overflow = '';
    });
})();
