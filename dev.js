// Create and inject the welcoming security modal HTML
const securityModalHTML = `
<div id="securityModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 p-4" style="display: none; font-family: 'League Spartan', sans-serif;">
  <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border-4 border-[#FF6F00]">
    <div class="text-center">
      <!-- Welcoming Face SVG -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto text-[#FF6F00]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke-width="2"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <circle cx="9" cy="10" r="1" fill="currentColor"/>
        <circle cx="15" cy="10" r="1" fill="currentColor"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9h6v1H9z"/>
      </svg>
      
      <h2 class="text-3xl font-[900] text-[#0f172a] mt-4">Welcome Back!</h2>
      <p class="mt-2 text-gray-600 font-[400]">We're glad to see you again. Developer tools are restricted for security.</p>
      
      <!-- Real-time Clock -->
      <div class="mt-4 p-3 bg-[#0f172a] rounded-lg">
        <div id="realTimeClock" class="text-white font-[700] text-xl">
          Loading time...
        </div>
      </div>
    </div>
    <div class="mt-6 flex justify-center">
      <button id="closeSecurityModal" class="px-6 py-2 bg-[#16a34a] text-white font-[700] rounded-lg hover:bg-green-700 transition-colors">
        Continue Securely
      </button>
    </div>
  </div>
</div>
`;

// Inject the modal into the body
document.body.insertAdjacentHTML('beforeend', securityModalHTML);

// Load League Spartan font if not already loaded
if (!document.querySelector('link[href*="League+Spartan"]')) {
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;700;900&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);
}

// Security functions with real-time clock
const SecurityManager = {
  init() {
    this.setupModal();
    this.setupClock();
    this.setupProtections();
    this.initialCheck();
  },

  setupModal() {
    this.modal = document.getElementById('securityModal');
    this.closeBtn = document.getElementById('closeSecurityModal');
    this.clockElement = document.getElementById('realTimeClock');
    
    this.closeBtn.addEventListener('click', () => this.closeModal());
  },

  setupClock() {
    this.updateClock();
    // Update clock every second
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
  },

  updateClock() {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    this.clockElement.textContent = now.toLocaleDateString('en-US', options);
  },

  showModal() {
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    this.updateClock(); // Update immediately when shown
    
    // Auto-close after 8 seconds
    this.modalTimeout = setTimeout(() => {
      if (this.modal.style.display === 'flex') {
        this.closeModal();
      }
    }, 8000);
  },

  closeModal() {
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
    clearTimeout(this.modalTimeout);
  },

  setupProtections() {
    // Keyboard shortcuts prevention
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
          (e.ctrlKey && e.key === 'u') ||
          (e.key === 'F5') ||
          (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        this.showModal();
        return false;
      }
    });

    // Right-click prevention
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showModal();
      return false;
    });

    // Detect DevTools opening via window resize
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    
    setInterval(() => {
      if (Math.abs(window.innerWidth - windowWidth) > 100 || 
          Math.abs(window.innerHeight - windowHeight) > 100) {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        this.showModal();
      }
    }, 500);

    // Prevent F5 and Ctrl+R
    window.addEventListener('beforeunload', (e) => {
      if (this.modal.style.display === 'flex') {
        e.preventDefault();
        return e.returnValue = 'Are you sure you want to leave?';
      }
    });
  },

  initialCheck() {
    // Check if DevTools is already open
    setTimeout(() => {
      const widthThreshold = 100;
      const heightThreshold = 100;
      
      if ((window.outerWidth - window.innerWidth > widthThreshold) || 
          (window.outerHeight - window.innerHeight > heightThreshold) ||
          (window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized)) {
        this.showModal();
      }
    }, 1000);
  },

  cleanup() {
    clearInterval(this.clockInterval);
    clearTimeout(this.modalTimeout);
  }
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SecurityManager.init());
} else {
  SecurityManager.init();
}

// Cleanup if needed (for single-page apps)
window.addEventListener('beforeunload', () => SecurityManager.cleanup());
