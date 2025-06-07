// ==UserScript==
// @name         ProConnect Secure Welcome (Fixed)
// @namespace    http://yourdomain.com/
// @version      2.1
// @description  Fixed version with working localStorage checks
// @author       You
// @match        https://proconnect-zeta.vercel.app/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 1. NEW storage key to avoid conflicts with previous versions
    const STORAGE_KEY = 'proconnect_v2_welcome_seen';
    const config = {
        modalId: 'secureWelcomeModalV2',
        showDuration: 10000,
        updateInterval: 1000,
        theme: {
            modal: 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50',
            content: 'bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 animate-fade-in',
            header: 'flex justify-between items-center p-4 border-b',
            title: 'text-lg font-bold flex items-center space-x-2',
            closeBtn: 'text-gray-500 hover:text-gray-700 text-2xl',
            body: 'p-4 space-y-4',
            footer: 'p-4 border-t text-center text-sm text-gray-500',
            icon: 'w-6 h-6 text-blue-500'
        }
    };

    // 2. DEBUGGED localStorage check
    function shouldShowWelcome() {
        try {
            // Clear previous test value if needed
            // localStorage.removeItem('proconnect_welcome_seen');
            
            const hasSeen = localStorage.getItem(STORAGE_KEY);
            console.log('Storage check:', hasSeen); // Debug log
            return hasSeen !== 'true';
        } catch (e) {
            console.error('Storage access error:', e);
            return true; // Fallback to showing if storage fails
        }
    }

    // 3. FIXED modal show/hide logic
    function showWelcomeModal() {
        if (!shouldShowWelcome()) {
            console.log('Not showing - already seen');
            return;
        }

        const { time, date } = getCurrentDateTime();
        
        const modalHTML = `
            <div id="${config.modalId}" class="${config.theme.modal}">
                <div class="${config.theme.content}">
                    <div class="${config.theme.header}">
                        <h3 class="${config.theme.title}">
                            <svg class="${config.theme.icon}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>Welcome to ProConnect</span>
                        </h3>
                        <button id="closeWelcomeModal" class="${config.theme.closeBtn}">×</button>
                    </div>
                    <div class="${config.theme.body}">
                        <div class="flex items-center space-x-3">
                            <svg class="${config.theme.icon}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p class="text-xs text-gray-500">Current Time</p>
                                <p id="welcomeCurrentTime" class="font-medium">${time}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-3">
                            <svg class="${config.theme.icon}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
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

    // 4. DEBUGGED modal behavior
    function setupModalBehavior() {
        const modal = document.getElementById(config.modalId);
        const closeBtn = document.getElementById('closeWelcomeModal');

        if (!modal || !closeBtn) {
            console.error('Modal elements not found!');
            return;
        }

        const timeInterval = setInterval(() => {
            const { time, date } = getCurrentDateTime();
            const timeEl = document.getElementById('welcomeCurrentTime');
            const dateEl = document.getElementById('welcomeCurrentDate');
            if (timeEl) timeEl.textContent = time;
            if (dateEl) dateEl.textContent = date;
        }, config.updateInterval);

        function closeModal() {
            clearInterval(timeInterval);
            modal.style.animation = 'fade-out 0.3s forwards';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
            localStorage.setItem(STORAGE_KEY, 'true');
        }

        closeBtn.addEventListener('click', closeModal);
        setTimeout(closeModal, config.showDuration);
    }

    // 5. Time/date functions
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

    // 6. Initialization with error handling
    function init() {
        try {
            // Add required CSS
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
                .animate-fade-in { animation: fade-in 0.3s forwards; }
            `;
            document.head.appendChild(style);

            // Show modal after slight delay
            setTimeout(showWelcomeModal, 1000);
        } catch (e) {
            console.error('Initialization error:', e);
        }
    }
    // Start when ready
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
showWelcomeModal();
