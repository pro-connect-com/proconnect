// Create and inject the security modal HTML
const securityModalHTML = `
<div id="securityModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 p-4" style="display: none; font-family: 'League Spartan', sans-serif;">
  <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border-4 border-[#FF6F00]">
    <div class="text-center">
      <!-- Security Shield SVG -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-[#16a34a]" viewBox="0 0 24 24" fill="currentColor">
        <path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
      </svg>
      
      <h2 class="text-2xl font-[700] text-[#0f172a] mt-4">Access Restricted</h2>
      <p class="mt-2 text-gray-600 text-sm">Developer tools are disabled for security reasons</p>
      
      <!-- Time/Date Display -->
      <div class="mt-4 flex justify-center space-x-4">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#FF6F00]" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
          <span id="currentTime" class="ml-1 text-sm font-[500] text-[#0f172a]">00:00:00 AM</span>
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#FF6F00]" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          <span id="currentDate" class="ml-1 text-sm font-[500] text-[#0f172a]">Jan 1, 2023</span>
        </div>
      </div>
    </div>
    <div class="mt-6 flex justify-center">
      <button id="closeSecurityModal" class="px-4 py-2 bg-[#16a34a] text-white text-sm font-[600] rounded hover:bg-green-700 transition-colors">
        Acknowledge
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
  fontLink.href = 'https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);
}

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
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    this.timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
    
    // Format date (MMM DD, YYYY)
    const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    this.dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
  },

  showModal() {
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    this.updateClock(); // Update immediately when shown
    
    // Auto-close after 6 seconds
    this.modalTimeout = setTimeout(() => {
      if (this.modal.style.display === 'flex') {
        this.closeModal();
      }
    }, 6000);
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
