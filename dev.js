// Create and inject the security modal HTML
const securityModalHTML = `
<div id="securityModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 p-4" style="display: none; font-family: 'League Spartan', sans-serif;">
  <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border-4 border-[#FF6F00]">
    <div class="text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-[#FF6F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 class="text-2xl font-[900] text-[#0f172a] mt-4">Security Alert</h2>
      <p class="mt-2 text-gray-600 font-[400]">Developer tools access is restricted in this application.</p>
    </div>
    <div class="mt-6 flex justify-center">
      <button id="closeSecurityModal" class="px-6 py-2 bg-[#16a34a] text-white font-[700] rounded-lg hover:bg-green-700 transition-colors">
        I Understand
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

// Security functions
const SecurityManager = {
  init() {
    this.setupModal();
    this.setupProtections();
    this.initialCheck();
  },

  setupModal() {
    this.modal = document.getElementById('securityModal');
    this.closeBtn = document.getElementById('closeSecurityModal');
    
    this.closeBtn.addEventListener('click', () => this.closeModal());
  },

  showModal() {
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      if (this.modal.style.display === 'flex') {
        this.closeModal();
      }
    }, 5000);
  },

  closeModal() {
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
  },

  setupProtections() {
    // 1. Keyboard shortcuts prevention
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
          (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        this.showModal();
        return false;
      }
    });

    // 2. Right-click prevention
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showModal();
      return false;
    });

    // 3. Detect DevTools opening via window resize
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
      if (window.outerWidth - window.innerWidth > 100 || 
          window.outerHeight - window.innerHeight > 100) {
        this.showModal();
      }
    }, 1000);
  }
};

// Initialize the security manager when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SecurityManager.init());
} else {
  SecurityManager.init();
}