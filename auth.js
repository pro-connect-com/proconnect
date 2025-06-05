// ==UserScript==
// @name         SafeAuth System
// @namespace    http://yourdomain.com/auth
// @version      1.3.5
// @description  Conflict-free authentication system
// @author       Your Team
// @grant        none
// ==/UserScript==

(function(global, factory) {
    // Universal Module Definition pattern
    if (typeof define === 'function' && define.amd) {
        // AMD/RequireJS
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS/Node
        module.exports = factory();
    } else {
        // Browser globals
        global.SafeAuth = factory();
    }
})(this, function() {
    'use strict';

    // Unique namespace with random suffix to prevent collisions
    const namespace = 'SafeAuth_' + Math.random().toString(36).substring(2, 9);
    const authConfig = {
        tokenName: 'authToken_' + location.hostname.replace(/[^a-z0-9]/gi, '_'),
        sessionTimeout: 3600000, // 1 hour
        cookieOptions: {
            path: '/',
            secure: true,
            sameSite: 'Strict'
        }
    };

    // Private variables (closure-protected)
    const privateState = {
        initialized: false,
        eventHandlers: {},
        userData: null,
        sessionTimer: null
    };

    // Core authentication functions
    const auth = {
        /**
         * Initialize the auth system (call once)
         */
        init: function(customConfig = {}) {
            if (privateState.initialized) return;
            
            // Merge configurations
            Object.assign(authConfig, customConfig);
            
            // Check for existing session
            this._checkExistingSession();
            
            privateState.initialized = true;
            this._dispatchEvent('ready');
            return this;
        },

        /**
         * User login
         */
        login: function(credentials, rememberMe = false) {
            return new Promise((resolve, reject) => {
                // Simulated login - replace with actual API call
                setTimeout(() => {
                    if (credentials.username && credentials.password) {
                        const token = this._generateToken(credentials.username);
                        this._setAuthToken(token, rememberMe);
                        this._startSessionTimer();
                        this._dispatchEvent('login');
                        resolve({ success: true, token });
                    } else {
                        reject(new Error('Invalid credentials'));
                    }
                }, 300);
            });
        },

        /**
         * User logout
         */
        logout: function() {
            this._clearAuthToken();
            clearTimeout(privateState.sessionTimer);
            privateState.userData = null;
            this._dispatchEvent('logout');
            return Promise.resolve(true);
        },

        /**
         * Check authentication status
         */
        isAuthenticated: function() {
            return !!this._getAuthToken();
        },

        /**
         * Get current user data
         */
        getUser: function() {
            return privateState.userData || null;
        },

        /**
         * Event subscription
         */
        on: function(eventName, callback) {
            if (!privateState.eventHandlers[eventName]) {
                privateState.eventHandlers[eventName] = [];
            }
            privateState.eventHandlers[eventName].push(callback);
            return this;
        }
    };

    // Private methods (name-mangled for safety)
    auth._checkExistingSession = function() {
        const token = this._getAuthToken();
        if (token) {
            privateState.userData = this._parseToken(token);
            this._startSessionTimer();
        }
    };

    auth._generateToken = function(username) {
        return btoa(JSON.stringify({
            username,
            issued: Date.now(),
            random: Math.random().toString(36).substring(2)
        }));
    };

    auth._parseToken = function(token) {
        try {
            return JSON.parse(atob(token));
        } catch (e) {
            return null;
        }
    };

    auth._setAuthToken = function(token, persistent) {
        if (persistent) {
            document.cookie = `${authConfig.tokenName}=${token}; ` +
                `max-age=${authConfig.sessionTimeout/1000}; ` +
                `path=${authConfig.cookieOptions.path}; ` +
                `secure=${authConfig.cookieOptions.secure}; ` +
                `sameSite=${authConfig.cookieOptions.sameSite}`;
        } else {
            sessionStorage.setItem(authConfig.tokenName, token);
        }
    };

    auth._getAuthToken = function() {
        return sessionStorage.getItem(authConfig.tokenName) || 
               this._getCookie(authConfig.tokenName);
    };

    auth._clearAuthToken = function() {
        sessionStorage.removeItem(authConfig.tokenName);
        document.cookie = `${authConfig.tokenName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ` +
                          `path=${authConfig.cookieOptions.path}`;
    };

    auth._getCookie = function(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [key, value] = cookie.trim().split('=');
            if (key === name) return value;
        }
        return null;
    };

    auth._startSessionTimer = function() {
        clearTimeout(privateState.sessionTimer);
        privateState.sessionTimer = setTimeout(() => {
            this.logout();
        }, authConfig.sessionTimeout);
    };

    auth._dispatchEvent = function(eventName, data) {
        const handlers = privateState.eventHandlers[eventName] || [];
        handlers.forEach(handler => handler(data));
    };

    // Conflict prevention
    if (window[namespace]) {
        console.warn(`${namespace} already exists. Using existing instance.`);
        return window[namespace];
    }

    window[namespace] = auth;
    return auth;
});