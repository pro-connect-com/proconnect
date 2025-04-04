// Replace the checkScroll function with:
function checkScroll() {
  const elements = document.querySelectorAll('.fade-on-scroll');
  const windowHeight = window.innerHeight;
  
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150; // Pixels from top before showing
    
    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('visible');
    } else {
      element.classList.remove('visible');
    }
  });
}

// Initialize with Intersection Observer for better performance
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {threshold: 0.1});
  
  document.querySelectorAll('.fade-on-scroll').forEach(el => {
    observer.observe(el);
  });
} else {
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Check on load
}