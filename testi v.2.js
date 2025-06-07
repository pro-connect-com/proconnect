// ==UserScript==
// @name         ProConnect Secure Welcome
// @namespace    http://yourdomain.com/
// @version      2.0
// @description  Combined welcome message with time/date and dev tools protection
// @author       You
// @match        https://proconnect-zeta.vercel.app/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 1. Configuration
    const config = {
        modalId: 'secureWelcomeModal',
        showDuration: 10000, // 10 seconds
        updateInterval: 1000, // Update time every second
        storageKey: 'proconnect_welcome_seen',
        theme: {
            modal: 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50',
            content: 'bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 animate-fade-in',
            header: 'flex justify-between items-center p-4 border-b',
            title: 'text-lg font-bold flex items-center space-x-2',
            closeBtn: 'text-gray-500 hover:text-gray-700 text-2xl',
            body: 'p-4 space-y-4',
            footer: 'p-4 border-t text-center text-sm text-gray-500',
            icon: 'w-6 h-6 text-blue-500'
        },
        icons: {
            welcome: `
                <svg class="${config.theme.icon}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            `,
            time: `
                <svg class="${config.theme.icon}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            `,
            date: `
                <svg class="${config.theme.icon}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            `
        }
    };

    // 2. Dev Tools Protection
    function setupDevToolsProtection() {
        // Block keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) {
                e.preventDefault();
                showSecurityAlert();
                return false;
            }
        });

        // Block right-click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showSecurityAlert();
            return false;
        });
    }

    // 3. Time/Date Functions
    function getCurrentDateTime() {
        const now = new Date();
        return {
            time: now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }),
            date: now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
    }

    // 4. Welcome Modal
    function showWelcomeModal() {
        if (localStorage.getItem(config.storageKey)) return;

        const { time, date } = getCurrentDateTime();
        
        const modalHTML = `
            <div id="${config.modalId}" class="${config.theme.modal}">
                <div class="${config.theme.content}">
                    <div class="${config.theme.header}">
                        <h3 class="${config.theme.title}">
                            ${config.icons.welcome}
                            <span>Welcome to ProConnect</span>
                        </h3>
                        <button id="closeWelcomeModal" class="${config.theme.closeBtn}">×</button>
                    </div>
                    <div class="${config.theme.body}">
                        <div class="flex items-center space-x-3">
                            ${config.icons.time}
                            <div>
                                <p class="text-xs text-gray-500">Current Time</p>
                                <p id="welcomeCurrentTime" class="font-medium">${time}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-3">
                            ${config.icons.date}
                            <div>
                                <p class="text-xs text-gray-500">Today's Date</p>
                                <p id="welcomeCurrentDate" class="font-medium">${date}</p>
                            </div>
                        </div>
                    </div>
                    <div class="${config.theme.footer}">
                        <p>Session protected by security measures</p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        setupModalBehavior();
    }

    // 5. Modal Behavior
    function setupModalBehavior() {
        const modal = document.getElementById(config.modalId);
        const closeBtn = document.getElementById('closeWelcomeModal');

        // Update time every second
        const timeInterval = setInterval(() => {
            const { time, date } = getCurrentDateTime();
            document.getElementById('welcomeCurrentTime').textContent = time;
            document.getElementById('welcomeCurrentDate').textContent = date;
        }, config.updateInterval);

        // Close handlers
        function closeModal() {
            clearInterval(timeInterval);
            modal.style.animation = 'fade-out 0.3s forwards';
            setTimeout(() => modal.remove(), 300);
            localStorage.setItem(config.storageKey, 'true');
        }

        closeBtn.addEventListener('click', closeModal);

        // Auto-close after duration
        setTimeout(closeModal, config.showDuration);
    }

    // 6. Security Alert
    function showSecurityAlert() {
        const alertHTML = `
            <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                <div class="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
                    <h3 class="text-xl font-bold text-red-600 mb-3">Security Notice</h3>
                    <p class="mb-4">Developer tools are restricted on this platform.</p>
                    <button onclick="this.parentNode.parentNode.remove()" 
                            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        I Understand
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', alertHTML);
    }

    // 7. Initialize
    function init() {
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
            .animate-fade-in { animation: fade-in 0.3s forwards; }
        `;
        document.head.appendChild(style);

        setupDevToolsProtection();
        setTimeout(showWelcomeModal, 1000);
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
