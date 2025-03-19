<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="ProConnect - A social platform connecting job seekers with clients.">
    <meta name="keywords" content="ProConnect, jobs, hiring, job seekers, clients">
    <meta name="author" content="ProConnect Team">
    <!-- Open Graph Tags -->
    <meta property="og:title" content="ProConnect - Connecting Job Seekers with Clients">
    <meta property="og:description" content="ProConnect is a social platform that connects job seekers with clients.">
    <meta property="og:image" content="logo.png"> <!-- Assumes logo.png is in the same folder -->
    <meta property="og:url" content="https://www.proconnect.com">
    <meta property="og:type" content="website">
    <!-- Robots Meta Tag -->
    <meta name="robots" content="index, follow">
    <!-- Favicon -->
    <link rel="icon" href="logo.png" type="image/png">
    <!-- League Spartan Font -->
    <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;700&display=swap" rel="stylesheet">
    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <title>ProConnect Testimonials</title>
    <style>
        /* Apply League Spartan Font */
        body {
            font-family: 'League Spartan', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #202124;
        }

        /* Container Styles */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        /* Testimonials Section */
        .testimonials {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }

        .testimonial-card {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            width: 300px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .testimonial-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .testimonial-card img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin-bottom: 15px;
        }

        .testimonial-card h3 {
            font-size: 1.2rem;
            margin: 10px 0;
            color: #1a73e8;
        }

        .testimonial-card p {
            font-size: 0.9rem;
            color: #555;
            line-height: 1.5;
        }

        .testimonial-card .rating {
            color: #ffc107;
            font-size: 1rem;
            margin-top: 10px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .testimonial-card {
                width: 100%;
            }
        }
    </style>
</head>
<body class="light-mode">
    <!-- Navbar -->
    <nav style="background-color: #ffffff;">
        <div class="nav-wrapper">
            <a href="#" class="brand-logo">
                <img src="logo.png" alt="ProConnect Logo">
            </a>
            <ul id="nav-mobile" class="center">
                <li><a href="#">Home</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact Us</a></li>
            </ul>
            <div class="social-icons right">
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-youtube"></i></a>
                <a href="#"><i class="fab fa-facebook"></i></a>
                <a href="#"><i class="fab fa-whatsapp"></i></a>
            </div>
            <div class="hamburger" onclick="toggleMenu()">
                <i class="material-icons" id="menuIcon">menu</i>
            </div>
        </div>
    </nav>

    <!-- Separator Line -->
    <div class="separator"></div>

    <!-- Testimonials Section -->
    <div class="container">
        <h2 style="text-align: center; color: #1a73e8;">What Our Users Say</h2>
        <div class="testimonials">
            <!-- Testimonial 1 -->
            <div class="testimonial-card">
                <img src="https://via.placeholder.com/80" alt="User 1">
                <h3>John Doe</h3>
                <p>"ProConnect has helped me find the perfect job. The platform is easy to use and very efficient."</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
            </div>

            <!-- Testimonial 2 -->
            <div class="testimonial-card">
                <img src="https://via.placeholder.com/80" alt="User 2">
                <h3>Jane Smith</h3>
                <p>"I love how ProConnect connects me with clients. It's a game-changer for freelancers like me."</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                </div>
            </div>

            <!-- Testimonial 3 -->
            <div class="testimonial-card">
                <img src="https://via.placeholder.com/80" alt="User 3">
                <h3>Mike Johnson</h3>
                <p>"The best platform for job seekers. I highly recommend ProConnect to anyone looking for work."</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="far fa-star"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Toggle Dark Mode Button -->
    <div class="dark-mode-toggle">
        <label class="switch">
            <input type="checkbox" id="darkModeToggle">
            <span class="slider round"></span>
        </label>
    </div>

    <script>
        // Toggle Menu Function
        function toggleMenu() {
            const navLinks = document.getElementById("nav-mobile");
            const menuIcon = document.getElementById("menuIcon");
            navLinks.classList.toggle("active");
            if (navLinks.classList.contains("active")) {
                menuIcon.textContent = "close";
            } else {
                menuIcon.textContent = "menu";
            }
        }

        // Dark Mode Toggle
        document.addEventListener("DOMContentLoaded", function() {
            const darkModeToggle = document.getElementById("darkModeToggle");

            // Check for dark mode preference
            if (localStorage.getItem("darkMode") === "enabled") {
                document.body.classList.add("dark-mode");
                darkModeToggle.checked = true;
            }

            // Toggle dark mode
            darkModeToggle.addEventListener("change", function() {
                if (this.checked) {
                    document.body.classList.add("dark-mode");
                    localStorage.setItem("darkMode", "enabled");
                } else {
                    document.body.classList.remove("dark-mode");
                    localStorage.setItem("darkMode", "disabled");
                }
            });
        });
    </script>
</body>
</html>