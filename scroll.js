// ==UserScript==
// @name         ProConnect Modal Scroll Fix - Guaranteed
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Absolutely fixes modal scrolling on proconnect-zeta.vercel.app
// @author       You
// @match        https://proconnect-zeta.vercel.app/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 1. First, remove any existing scroll behavior overrides
    document.documentElement.style.scrollBehavior = '';
    document.body.style.scrollBehavior = '';

    // 2. Create a guaranteed scroll fix function
    function forceModalScrollFix() {
        // Target your specific modals
        const modals = document.querySelectorAll('#signupModal, #loginModal');
        
        modals.forEach(modal => {
            // Find the modal content area
            const content = modal.querySelector('.modal-content');
            
            if (content) {
                // Apply direct scroll fixes
                content.style.overflowY = 'auto';
                content.style.maxHeight = '80vh';
                content.style.height = 'auto';
                content.style.display = 'flex';
                content.style.flexDirection = 'column';
                
                // Make sure the form is scrollable
                const form = content.querySelector('form');
                if (form) {
                    form.style.overflowY = 'auto';
                    form.style.maxHeight = '100%';
                    form.style.flexGrow = '1';
                }
                
                // Add iOS touch scrolling
                content.style.WebkitOverflowScrolling = 'touch';
                
                // Mark as fixed to avoid duplicate processing
                modal.dataset.scrollFixed = 'true';
                console.log('Scroll fixes applied to:', modal.id);
            }
        });
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
