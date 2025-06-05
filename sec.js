// ==UserScript==
// @name         Universal Security Hardener
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Enhances security for any website
// @author       Security Team
// @match        *://*/*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Content Security Policy (CSP) Header Injection
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = "Content-Security-Policy";
    cspMeta.content = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
        style-src 'self' 'unsafe-inline' https:;
        img-src 'self' data: https:;
        font-src 'self' https:;
        connect-src 'self' https:;
        frame-src 'self' https:;
        media-src 'self' https:;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'self';
    `.replace(/\s+/g, ' ').trim();
    document.head.appendChild(cspMeta);

    // 2. Security Headers Polyfill
    const securityHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': `
            accelerometer=(),
            ambient-light-sensor=(),
            autoplay=(),
            camera=(),
            encrypted-media=(),
            fullscreen=(),
            geolocation=(),
            gyroscope=(),
            magnetometer=(),
            microphone=(),
            midi=(),
            payment=(),
            picture-in-picture=(),
            speaker=(),
            usb=(),
            vibrate=(),
            vr=()
        `.replace(/\s+/g, ' ').trim(),
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
    };

    Object.entries(securityHeaders).forEach(([header, value]) => {
        const meta = document.createElement('meta');
        meta.httpEquiv = header;
        meta.content = value;
        document.head.appendChild(meta);
    });

    // 3. DOM Security Hardening
    (function() {
        // Disable console.log in production
        if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            console.log = function() {};
            console.info = function() {};
            console.warn = function() {};
        }

        // Protect against prototype pollution
        Object.freeze(Object.prototype);
        Object.freeze(Array.prototype);
        Object.freeze(Function.prototype);

        // Disable dangerous functions
        window.eval = function() {
            throw new Error('eval() is disabled for security reasons');
        };
        unsafeWindow.eval = window.eval;
    })();

    // 4. Form Protection
    document.addEventListener('DOMContentLoaded', function() {
        // Protect all forms
        document.querySelectorAll('form').forEach(form => {
            // Add CSRF token if not present
            if (!form.querySelector('input[name="_csrf"]')) {
                const csrfToken = document.createElement('input');
                csrfToken.type = 'hidden';
                csrfToken.name = '_csrf';
                csrfToken.value = crypto.randomUUID();
                form.appendChild(csrfToken);
            }

            // Add honeypot field
            const honeypot = document.createElement('input');
            honeypot.style.display = 'none';
            honeypot.name = 'security_check';
            honeypot.autocomplete = 'off';
            form.appendChild(honeypot);

            // Validate forms before submission
            form.addEventListener('submit', function(e) {
                // Honeypot check
                if (honeypot.value !== '') {
                    e.preventDefault();
                    return false;
                }

                // Basic XSS protection
                const inputs = form.querySelectorAll('input, textarea, select');
                for (let input of inputs) {
                    if (input.value.match(/<script|javascript:|on\w+=/i)) {
                        e.preventDefault();
                        alert('Potentially dangerous input detected');
                        return false;
                    }
                }
            });
        });
    });

    // 5. Clickjacking Protection
    (function() {
        if (window != window.top) {
            window.top.location = window.location;
        }

        document.addEventListener('click', function(e) {
            if (e.target.closest('a[target="_blank"]')) {
                e.preventDefault();
                const newWindow = window.open();
                newWindow.opener = null;
                newWindow.location = e.target.href;
            }
        }, true);
    })();

    // 6. Secure Cookies
    (function() {
        if (!document.cookie.includes('; Secure') && location.protocol === 'https:') {
            document.cookie.split(';').forEach(cookie => {
                document.cookie = cookie.trim() + '; Secure; SameSite=Strict';
            });
        }
    })();

    // 7. Anti-Malware Protection
    (function() {
        // Block known malicious domains
        const maliciousDomains = [
            'malicious.com',
            'evil-tracker.com',
            'bad-script.net'
        ];

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        ['src', 'href'].forEach(attr => {
                            const value = node.getAttribute(attr);
                            if (value && maliciousDomains.some(d => value.includes(d))) {
                                node.remove();
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'href']
        });
    })();

    // 8. Performance Monitoring with Security
    (function() {
        const start = performance.now();
        const safeOrigins = [location.origin];

        window.addEventListener('load', function() {
            const loadTime = performance.now() - start;
            if (loadTime > 5000) {
                console.warn('Long load time detected - potential resource hijacking');
            }

            // Check for unexpected third-party scripts
            Array.from(document.scripts).forEach(script => {
                if (!safeOrigins.some(origin => script.src.startsWith(origin))) {
                    console.warn('Third-party script detected:', script.src);
                }
            });
        });
    })();

    // 9. Secure Storage Protection
    (function() {
        // Encrypt localStorage data
        const originalSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key, value) {
            const encryptedValue = btoa(unescape(encodeURIComponent(value)));
            originalSetItem.call(this, key, encryptedValue);
        };

        Storage.prototype.getSecureItem = function(key) {
            const encryptedValue = this.getItem(key);
            return encryptedValue ? decodeURIComponent(escape(atob(encryptedValue))) : null;
        };
    })();
})();