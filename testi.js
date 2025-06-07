// ==UserScript==
// @name         ProConnect Security Hardening
// @namespace    http://yourdomain.com/
// @version      1.3
// @description  Restricts dev tools access while showing time/date info
// @author       You
// @match        https://proconnect-zeta.vercel.app/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // =============================================
    // 1. DEVELOPER TOOLS DETECTION & PREVENTION
    // =============================================

    // Detect and block F12, Ctrl+Shift+I, etc.
    document.addEventListener('keydown', function(e) {
        // Block F12
        if (e.key === 'F12' || 
            // Block Ctrl+Shift+I (Chrome, Firefox)
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            // Block Ctrl+Shift+J (Chrome)
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            // Block Ctrl+Shift+C (Chrome)
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            // Block Ctrl+U (View source)
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            e.stopPropagation();
            showSecurityAlert();
            return false;
        }
    });

    // Detect right-click menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showSecurityAlert();
        return false;
    });

    // Detect dev tools via window size difference
    let lastWidth = window.outerWidth;
    setInterval(function() {
        if (window.outerWidth < lastWidth) {
            // Width decreased (likely dev tools opened)
            showSecurityAlert();
            window.location.reload();
        }
        lastWidth = window.outerWidth;
    }, 500);

    // =============================================
    // 2. TIME/DATE MODAL (User-friendly alternative)
    // =============================================

    const timeModalConfig = {
        modalId: 'timeInfoModal',
        showDuration: 8000,
        updateInterval: 30000,
        theme: {
            modal: 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50',
            content: 'bg-white rounded-lg shadow-xl w-full max-w-sm mx-4',
            header: 'flex justify-between items-center p-4 border-b',
            title: 'text-lg font-bold',
            closeBtn: 'text-gray-500 hover:text-gray-700 text-2xl',
            body: 'p-4 space-y-3',
            footer: 'p-4 border-t text-center text-sm text-gray-500'
        }
    };

    function showTimeModal() {
        const { date, time } = getCurrentDateTime();
        
        const modalHTML = `
            <div id="${timeModalConfig.modalId}" class="${timeModalConfig.theme.modal}">
                <div class="${timeModalConfig.theme.content}">
                    <div class="${timeModalConfig.theme.header}">
                        <h3 class="${timeModalConfig.theme.title}">System Information</h3>
                        <button id="closeTimeModal" class="${timeModalConfig.theme.closeBtn}">×</button>
                    </div>
                    <div class="${timeModalConfig.theme.body}">
                        <div>
                            <p class="text-xs text-gray-500">Current Date</p>
                            <p id="currentDate" class="font-medium">${date}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Current Time</p>
                            <p id="currentTime" class="font-medium">${time}</p>
                        </div>
                    </div>
                    <div class="${timeModalConfig.theme.footer}">
                        <p>Security Status: <span class="text-green-500">Active</span></p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Auto-close after duration
        setTimeout(() => {
            const modal = document.getElementById(timeModalConfig.modalId);
            if (modal) modal.remove();
        }, timeModalConfig.showDuration);
    }

    // =============================================
    // 3. SECURITY ALERT NOTIFICATION
    // =============================================

    function showSecurityAlert() {
        const alertHTML = `
            <div id="securityAlert" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-100">
                <div class="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
                    <h3 class="text-xl font-bold text-red-600 mb-3">Security Alert</h3>
                    <p class="mb-4">Developer tools access is restricted on this platform.</p>
                    <button id="closeAlert" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        I Understand
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', alertHTML);
        document.getElementById('closeAlert').addEventListener('click', () => {
            document.getElementById('securityAlert').remove();
        });
    }

    // =============================================
    // 4. UTILITY FUNCTIONS
    // =============================================

    function getCurrentDateTime() {
        const now = new Date();
        return {
            date: now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            }),
            time: now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    }

    // =============================================
    // 5. INITIALIZATION
    // =============================================

    function init() {
        // Show time modal on load
        setTimeout(showTimeModal, 2000);
        
        // Additional security measures
        Object.defineProperty(window, 'console', {
            value: {},
            writable: false,
            configurable: false
        });
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
