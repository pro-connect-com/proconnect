document.addEventListener("DOMContentLoaded", function () {
  // Animate Underline for Section Titles
  const sectionTitles = document.querySelectorAll(".body-content h2"); // Ensure it's targeting only body titles
  sectionTitles.forEach(title => {
    title.classList.add("show-underline");
  });

  // Select only body content sections (Exclude nav & header)
  const fadeSections = document.querySelectorAll(".body-content section");

  fadeSections.forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
  });

  function fadeInOnScroll() {
    fadeSections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (sectionTop < windowHeight - 50) {
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
      }
    });
  }

  // Run fade-in effect on scroll & on page load
  window.addEventListener("scroll", fadeInOnScroll);
  fadeInOnScroll();
});
