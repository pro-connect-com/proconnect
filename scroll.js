// ==UserScript==
// @name         Universal Scroll Enforcer
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Forces consistent scroll behavior on all elements across all websites
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    // 1. Inject global smooth scroll CSS with !important
    GM_addStyle(`
        html, body, [style*="overflow"], [style*="scroll"] {
            scroll-behavior: smooth !important;
        }
        * {
            scroll-behavior: smooth !important;
            scroll-snap-type: none !important;
        }
    `);
    
    // 2. Override all scrolling methods
    const originalFunctions = {
        scroll: window.scroll,
        scrollTo: window.scrollTo,
        scrollBy: window.scrollBy,
        elementScroll: Element.prototype.scroll,
        elementScrollTo: Element.prototype.scrollTo,
        elementScrollBy: Element.prototype.scrollBy
    };
    
    function smoothScrollOverride(args) {
        if (typeof args === 'object' && !args.behavior) {
            args.behavior = 'smooth';
        }
        return args;
    }
    
    window.scroll = function() {
        return originalFunctions.scroll.apply(this, smoothScrollOverride(arguments));
    };
    
    window.scrollTo = function() {
        return originalFunctions.scrollTo.apply(this, smoothScrollOverride(arguments));
    };
    
    window.scrollBy = function() {
        return originalFunctions.scrollBy.apply(this, smoothScrollOverride(arguments));
    };
    
    Element.prototype.scroll = function() {
        return originalFunctions.elementScroll.apply(this, smoothScrollOverride(arguments));
    };
    
    Element.prototype.scrollTo = function() {
        return originalFunctions.elementScrollTo.apply(this, smoothScrollOverride(arguments));
    };
    
    Element.prototype.scrollBy = function() {
        return originalFunctions.elementScrollBy.apply(this, smoothScrollOverride(arguments));
    };
    
    // 3. Handle dynamically generated content
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    forceScrollBehavior(node);
                    if (node.querySelectorAll) {
                        node.querySelectorAll('*').forEach(forceScrollBehavior);
                    }
                }
            });
        });
    });
    
    function forceScrollBehavior(el) {
        try {
            if (getComputedStyle(el).overflow.match(/auto|scroll/)) {
                el.style.setProperty('scroll-behavior', 'smooth', 'important');
            }
        } catch(e) {
            console.debug('Scroll enforcer: Could not modify element', el);
        }
    }
    
    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });
    
    // 4. Periodically check for scrollable elements (for SPAs)
    setInterval(function() {
        document.querySelectorAll('*').forEach(forceScrollBehavior);
    }, 3000);
    
    // 5. Handle iframes
    function processIframe(iframe) {
        try {
            iframe.contentDocument.querySelectorAll('*').forEach(forceScrollBehavior);
            GM_addStyle(`
                * {
                    scroll-behavior: smooth !important;
                }
            `, iframe.contentDocument);
        } catch(e) {
            console.debug('Scroll enforcer: Could not access iframe', iframe);
        }
    }
    
    document.querySelectorAll('iframe').forEach(processIframe);
    
    new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'IFRAME') {
                    processIframe(node);
                }
            });
        });
    }).observe(document, { childList: true, subtree: true });
})();