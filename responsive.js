function toggleMenu() {
  let nav = document.querySelector("nav");
  let authButtons = document.querySelector(".auth-buttons");

  nav.classList.toggle("show-menu");

  // Ensure auth buttons remain in the correct position when menu is toggled
  if (window.innerWidth < 768) {
    authButtons.style.display = nav.classList.contains("show-menu") ? "none" : "flex";
  }
}

// Function to auto-resize fonts & layout dynamically
function adjustLayout() {
  let screenWidth = window.innerWidth;

  // Adjust global font size
  document.documentElement.style.fontSize = screenWidth < 768 ? "14px" :
                                            screenWidth < 480 ? "12px" : "16px";

  // Adjust nav link font size dynamically
  let navLinks = document.querySelectorAll("nav ul li a");
  navLinks.forEach(link => link.style.fontSize = screenWidth < 768 ? "14px" : "16px");

  // Adjust button font size & padding dynamically
  let buttons = document.querySelectorAll(".auth-buttons .btn");
  buttons.forEach(btn => {
    if (screenWidth < 768) {
      btn.style.fontSize = "14px";
      btn.style.padding = "6px 12px";
    } else if (screenWidth < 480) { 
      btn.style.fontSize = "12px"; 
      btn.style.padding = "5px 10px"; 
    } else {
      btn.style.fontSize = "16px";
      btn.style.padding = "8px 16px";
    }
  });

  // Adjust body content layout
  let bodyContainer = document.querySelector(".content");
  if (bodyContainer) {
    bodyContainer.style.padding = screenWidth < 768 ? "10px" : "20px";
    bodyContainer.style.width = screenWidth < 480 ? "95%" : "80%";
  }

  // Ensure auth buttons reappear when resizing back
  if (screenWidth >= 768) {
    document.querySelector(".auth-buttons").style.display = "flex";
  }
}

// Run function on load & on resize
window.onload = adjustLayout;
window.onresize = adjustLayout;
