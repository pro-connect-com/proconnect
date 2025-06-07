// ==UserScript==
// @name         ProConnect Welcome Message
// @namespace    http://yourdomain.com/
// @version      1.0
// @description  Shows welcome message once per device/browser
// @author       You
// @match        https://proconnect-zeta.vercel.app/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. Welcome Message Configuration
    const welcomeConfig = {
        storageKey: 'proconnect_welcome_seen',
        cookieName: 'proconnect_welcome',
        cookieExpiryDays: 365, // 1 year
        message: "Welcome back to ProConnect! Ready to continue your journey?",
        theme: {
            background: 'bg-gradient-to-r from-green-400 to-blue-500',
            text: 'text-white',
            padding: 'p-4',
            rounded: 'rounded-lg',
            shadow: 'shadow-xl',
            position: 'fixed bottom-4 right-4',
            width: 'max-w-xs',
            closeButton: 'text-white hover:text-gray-200'
        }
    };

    // 2. Check if welcome was already shown
    function hasSeenWelcome() {
        // Check localStorage first
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(welcomeConfig.storageKey) === 'true';
        }
        // Fallback to cookie
        const cookies = document.cookie.split(';').map(c => c.trim());
        return cookies.some(c => c.startsWith(`${welcomeConfig.cookieName}=true`));
    }

    // 3. Mark welcome as seen
    function markWelcomeAsSeen() {
        try {
            // Try localStorage first
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(welcomeConfig.storageKey, 'true');
            }
            // Set cookie as fallback
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + welcomeConfig.cookieExpiryDays);
            document.cookie = `${welcomeConfig.cookieName}=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax; Secure`;
        } catch (e) {
            console.error('Failed to set welcome flag:', e);
        }
    }

    // 4. Show welcome message
    function showWelcomeMessage() {
        if (hasSeenWelcome()) return;

        // Create message element
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = Object.values(welcomeConfig.theme).join(' ');
        welcomeDiv.innerHTML = `
            <div class="flex justify-between items-start">
                <p class="text-sm font-medium">${welcomeConfig.message}</p>
                <button id="closeWelcome" class="${welcomeConfig.theme.closeButton} ml-2">
                    ✕
                </button>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(welcomeDiv);

        // Close button handler
        document.getElementById('closeWelcome').addEventListener('click', () => {
            welcomeDiv.style.display = 'none';
            markWelcomeAsSeen();
        });

        // Auto-close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(welcomeDiv)) {
                welcomeDiv.style.opacity = '0';
                setTimeout(() => welcomeDiv.remove(), 300);
                markWelcomeAsSeen();
            }
        }, 10000);

        markWelcomeAsSeen();
    }

    // 5. Initialize when DOM is ready
    if (document.readyState === 'complete') {
        showWelcomeMessage();
    } else {
        window.addEventListener('load', showWelcomeMessage);
    }
})();
