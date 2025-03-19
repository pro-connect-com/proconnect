document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleCategories");
  const hiddenCategories = document.querySelectorAll(".category.hidden");

  let isExpanded = false;

  toggleButton.addEventListener("click", function () {
    hiddenCategories.forEach(category => {
      category.classList.toggle("hidden"); // Toggle visibility
    });

    toggleButton.textContent = isExpanded ? "Explore More" : "Show Less";
    isExpanded = !isExpanded;
  });
});
