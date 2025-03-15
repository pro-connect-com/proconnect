// List of Kenyan counties to populate the select dropdown
const counties = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Machakos",
    "Kajiado", "Nyeri", "Murang'a", "Uasin Gishu", "Kericho", 
    "Bungoma", "Meru", "Embu", "Kitui", "Kilifi", "Lamu", "Homa Bay",
    "Migori", "Narok", "Baringo", "Garissa", "Mandera", "Turkana"
];

// Populate county dropdown
const countySelect = document.getElementById("county");
counties.forEach(county => {
    let option = document.createElement("option");
    option.value = county;
    option.innerText = county;
    countySelect.appendChild(option);
});

// Form submission handler
document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form values
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;
    const county = document.getElementById("county").value;
    
    const errorMessage = document.getElementById("errorMessage");
    const successMessage = document.getElementById("successMessage");

    // Reset messages
    errorMessage.style.display = "none";
    successMessage.style.display = "none";

    // Custom Validation
    const validationResult = validateForm(username, email, password, role, county);

    if (!validationResult.isValid) {
        showError(validationResult.message);
        return;
    }

    // Create user object
    const userData = {
        username,
        email,
        password,
        role,
        county,
        timestamp: new Date().toISOString(),
        id: "user" + Date.now(),
        region: "Kenya"
    };

    // Google Apps Script URL for the backend (replace with your actual URL)
    const scriptUrl = "https://script.google.com/macros/s/AKfycbwAss_q-nrGFCeWDL95R8ApzgjBmT2O1Sq3XyvtK5W5p-Bz16sMRTOAhx7Z01JEMxbZ/exec";

    // Send data to Google Sheets via Apps Script
    fetch(scriptUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData) // Send the user data as JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === "success") {
            showSuccess("Signup successful! Redirecting...");
            setTimeout(() => {
                window.location.href = "login.html"; // Redirect after success
            }, 3000);
        } else {
            showError("Error: " + (data.message || "An unknown error occurred.")); // Handle error if result isn't success
        }
    })
    .catch(error => {
        console.error("Error:", error);
        showError("An error occurred. Please try again.");
    });
});

// Custom validation function
function validateForm(username, email, password, role, county) {
    // Check if all fields are filled
    if (!username || !email || !password || !role || !county) {
        return { isValid: false, message: "Please fill out all fields." };
    }

    // Validate username (min 5 characters)
    if (username.length < 5) {
        return { isValid: false, message: "Your name is too short." };
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
        return { isValid: false, message: "Please enter a valid email address." };
    }

    // Validate password (min 8 characters)
    if (password.length < 8) {
        return { isValid: false, message: "Password must be at least 8 characters long." };
    }

    // Validate role selection
    if (role === "") {
        return { isValid: false, message: "Please select a role." };
    }

    // Validate county selection
    if (county === "") {
        return { isValid: false, message: "Please select your county." };
    }

    // If all validations pass
    return { isValid: true, message: "Success." };
}

// Display error message
function showError(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.innerText = message;
    errorMessage.style.display = "block";
    setTimeout(() => errorMessage.style.display = "none", 3000);
}

// Display success message
function showSuccess(message) {
    const successMessage = document.getElementById("successMessage");
    successMessage.innerText = message;
    successMessage.style.display = "block";
    setTimeout(() => successMessage.style.display = "none", 3000);
}
