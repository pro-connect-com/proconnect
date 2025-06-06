// Create and inject the security modal HTML with Ionicons
const securityModalHTML = `
<div id="securityModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 p-4" style="display: none; font-family: 'League Spartan', sans-serif;">
  <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border-4 border-[#FF6F00]">
    <div class="text-center">
      <!-- Welcome Face Icon (Ionicons) -->
      <ion-icon name="happy-outline" class="text-5xl mx-auto text-[#FF6F00]"></ion-icon>
      
      <h2 class="text-2xl font-[700] text-[#0f172a] mt-3">Welcome Back!</h2>
      <p class="mt-1 text-gray-600 text-sm">We're securing your experience</p>
      
      <!-- Time/Date Display with Ionicons -->
      <div class="mt-4 flex justify-center space-x-6">
        <div class="flex items-center">
          <ion-icon name="time-outline" class="text-[#FF6F00] text-lg"></ion-icon>
          <span id="currentTime" class="ml-1 text-sm font-[500] text-[#0f172a]">00:00:00 AM</span>
        </div>
        <div class="flex items-center">
          <ion-icon name="calendar-outline" class="text-[#FF6F00] text-lg"></ion-icon>
          <span id="currentDate" class="ml-1 text-sm font-[500] text-[#0f172a]">Jan 1, 2023</span>
        </div>
      </div>
    </div>
    <div class="mt-5 flex justify-center">
      <button id="closeSecurityModal" class="px-4 py-1.5 bg-[#16a34a] text-white text-sm font-[600] rounded hover:bg-green-700 transition-colors flex items-center">
        <ion-icon name="lock-closed-outline" class="mr-1"></ion-icon>
        Continue Securely
      </button>
    </div>
  </div>
</div>
`;

// Inject the modal into the body
document.body.insertAdjacentHTML('beforeend', securityModalHTML);

// Load required fonts and icons
const loadDependencies = () => {
  // Load League Spartan font if not already loaded
  if (!document.querySelector('link[href*="League+Spartan"]')) {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  }
  
  // Load Ionicons if not already loaded
  if (!document.querySelector('script[src*="ionicons"]')) {
    const ioniconsScript = document.createElement('script');
    ioniconsScript.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js';
    document.head.appendChild(ioniconsScript);
  }
};

// Security functions with real-time clock
const SecurityManager = {
  init() {
    this.setupElements();
    this.setupClock();
    this.setupProtections();
    this.initialCheck();
  },

  setupElements() {
    this.modal = document.getElementById('securityModal');
    this.closeBtn = document.getElementById('closeSecurityModal');
    this.timeElement = document.getElementById('currentTime');
    this.dateElement = document.getElementById('currentDate');
    
    this.closeBtn.addEventListener('click', () => this.closeModal());
  },

  setupClock() {
    this.updateClock();
    // Update clock every second
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
  },

  updateClock() {
    const now = new Date();
    
    // Format time (HH:MM:SS AM/PM)
    const timeOptions = { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: true 
    };
    this.timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
    
    // Format date (MMM DD, YYYY)
    const dateOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    this.dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
  },

  showModal() {
    if (!this.modal) return;
    
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    this.updateClock();
    
    // Auto-close after 6 seconds
    this.modalTimeout = setTimeout(() => {
      if (this.modal.style.display === 'flex') {
        this.closeModal();
      }
    }, 6000);
  },

  closeModal() {
    if (!this.modal) return;
    
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
    
    this.resizeInterval = setInterval(() => {
      if (Math.abs(window.innerWidth - windowWidth) > 100 || 
          Math.abs(window.innerHeight - windowHeight) > 100) {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        this.showModal();
      }
    }, 500);
  },

  initialCheck() {
    // Check if DevTools is already open
    setTimeout(() => {
      if ((window.outerWidth - window.innerWidth) > 100 || 
          (window.outerHeight - window.innerHeight) > 100) {
        this.showModal();
      }
    }, 1000);
  },

  cleanup() {
    clearInterval(this.clockInterval);
    clearInterval(this.resizeInterval);
    clearTimeout(this.modalTimeout);
  }
};

// Initialize when dependencies are loaded
const initApp = () => {
  loadDependencies();
  
  // Wait briefly for Ionicons to load if needed
  if (typeof ionicons === 'undefined') {
    const checkIonicons = setInterval(() => {
      if (typeof ionicons !== 'undefined') {
        clearInterval(checkIonicons);
        SecurityManager.init();
      }
    }, 100);
  } else {
    SecurityManager.init();
  }
};

// Start initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Cleanup for single-page apps
window.addEventListener('beforeunload', () => {
  SecurityManager.cleanup();
});
