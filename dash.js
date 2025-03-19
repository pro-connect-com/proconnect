document.addEventListener("DOMContentLoaded", () => {
    console.log("Header Loaded Successfully ✅");

    // Ensure Separator Line Animation is Applied Correctly
    const separator = document.querySelector('.separator');
    separator.style.animation = "lineAnimation 1.5s ease-out forwards";
});

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");

    // Open & Close Menu on Click
    hamburger.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });

    // Close Menu When Clicking Outside
    document.addEventListener("click", (event) => {
        if (!mobileMenu.contains(event.target) && !hamburger.contains(event.target)) {
            mobileMenu.classList.remove("active");
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const profileSection = document.querySelector(".profile-overview");

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    profileSection.classList.add("fade-in");
                    observer.unobserve(entry.target); // Stop observing after animation
                }
            });
        },
        { threshold: 0.3 } // Trigger when 30% of section is visible
    );

    observer.observe(profileSection);
});
document.addEventListener("DOMContentLoaded", function () {
    const stats = document.querySelectorAll(".stat-card");

    stats.forEach((stat, index) => {
        setTimeout(() => {
            stat.style.opacity = "1";
            stat.style.transform = "translateY(0)";
        }, 200 * index);
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchJob");
    const locationFilter = document.getElementById("filterLocation");
    const jobBoxes = document.querySelectorAll(".job-box");

    function filterJobs() {
        const searchValue = searchInput.value.toLowerCase();
        const selectedLocation = locationFilter.value;

        jobBoxes.forEach((box) => {
            const title = box.querySelector("h3").textContent.toLowerCase();
            const location = box.dataset.location;

            if (
                (title.includes(searchValue) || searchValue === "") &&
                (location === selectedLocation || selectedLocation === "")
            ) {
                box.style.display = "block";
            } else {
                box.style.display = "none";
            }
        });
    }

    searchInput.addEventListener("input", filterJobs);
    locationFilter.addEventListener("change", filterJobs);
});

document.addEventListener("DOMContentLoaded", function () {
    function hideOldUpdates() {
        const updates = document.querySelectorAll(".system-update");
        updates.forEach(update => {
            const timestamp = update.querySelector(".timestamp").getAttribute("data-time");
            const updateDate = new Date(timestamp);
            const now = new Date();
            const timeDiff = (now - updateDate) / (1000 * 60 * 60 * 24); // Convert to days
            
            if (timeDiff > 2) {
                update.style.display = "none"; // Hide after 2 days
            }
        });
    }

    function loadJobUpdates() {
        const jobUpdatesContainer = document.getElementById("job-updates");
        const viewMoreBtn = document.getElementById("view-more");

        // Simulated DB fetch (replace with Firestore)
        const jobUpdates = [
            { title: "Frontend Developer Needed", timestamp: "Just now", link: "#" },
            { title: "Graphic Designer Wanted", timestamp: "2 hours ago", link: "#" },
            { title: "UX/UI Designer Position Open", timestamp: "1 day ago", link: "#" },
            { title: "Full-Stack Developer Role Available", timestamp: "3 days ago", link: "#" },
            { title: "Freelance Web Developer Needed", timestamp: "5 days ago", link: "#" },
            { title: "React Developer Urgently Required", timestamp: "6 days ago", link: "#" }
        ];

        let isExpanded = false; // Track toggle state

        function toggleUpdates() {
            const extraUpdates = document.querySelectorAll(".extra-update");

            if (!isExpanded) {
                // Show hidden updates
                jobUpdates.slice(3).forEach(job => {
                    const jobElement = document.createElement("div");
                    jobElement.classList.add("update-card", "extra-update");
                    jobElement.innerHTML = `
                        <ion-icon name="briefcase-outline"></ion-icon>
                        <p>${job.title} <a href="${job.link}">Apply Now</a></p>
                        <span class="timestamp">${job.timestamp}</span>
                    `;
                    jobUpdatesContainer.appendChild(jobElement);
                });
                viewMoreBtn.innerHTML = '<ion-icon name="chevron-up-outline"></ion-icon>'; // Change icon
                isExpanded = true;
            } else {
                // Hide extra updates instead of removing
                extraUpdates.forEach(update => update.classList.add("hidden"));
                viewMoreBtn.innerHTML = '<ion-icon name="chevron-down-outline"></ion-icon>'; // Change icon back
                isExpanded = false;
            }
        }

        function hideOnClickOutside(event) {
            if (!jobUpdatesContainer.contains(event.target) && event.target !== viewMoreBtn) {
                document.querySelectorAll(".extra-update").forEach(el => el.classList.add("hidden"));
                viewMoreBtn.innerHTML = '<ion-icon name="chevron-down-outline"></ion-icon>';
                isExpanded = false;
            }
        }

        // Load only 3 latest updates first
        jobUpdates.slice(0, 3).forEach(job => {
            jobUpdatesContainer.innerHTML += `
                <div class="update-card">
                    <ion-icon name="briefcase-outline"></ion-icon>
                    <p>${job.title} <a href="${job.link}">Apply Now</a></p>
                    <span class="timestamp">${job.timestamp}</span>
                </div>
            `;
        });

        // Show "View More" button only if there are more than 3 updates
        if (jobUpdates.length > 3) {
            viewMoreBtn.style.display = "flex"; // Show button
            viewMoreBtn.addEventListener("click", toggleUpdates);
            document.addEventListener("click", hideOnClickOutside);
        }
    }

    hideOldUpdates();
    loadJobUpdates();
});


// Logout function to clear session and redirect
document.querySelector('.logout-icon').addEventListener('click', function() {
    // Clear session or cookies (based on your setup)
    localStorage.removeItem('userSession'); // Example of clearing localStorage
    sessionStorage.clear(); // Optional: Clear sessionStorage as well

    // Redirect to login or home page
    window.location.href = '/login'; // Replace with your login page URL
});
