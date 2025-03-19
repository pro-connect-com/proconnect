document.addEventListener("DOMContentLoaded", () => {
    auth.init(); // Initialize authentication functions on page load
});

// Main Auth Object
const auth = {
    init: function () {
        this.preventRightClick(); // Activate right-click prevention
    },

    preventRightClick: function () {
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            this.showModal("Action Denied!", "warning");
        });
    },

    showModal: function (message, type = "info") {
        // Remove existing modal if any
        const existingModal = document.getElementById("customModal");
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal container
        const modal = document.createElement("div");
        modal.id = "customModal";
        modal.style.position = "fixed";
        modal.style.top = "50%";
        modal.style.left = "50%";
        modal.style.transform = "translate(-50%, -50%)";
        modal.style.padding = "20px";
        modal.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; // White filter effect
        modal.style.color = "#000"; // Black text
        modal.style.borderRadius = "5px";
        modal.style.boxShadow = "0 4px 10px rgba(0,0,0,0.12)";
        modal.style.textAlign = "center";
        modal.style.zIndex = "10000";
        modal.style.width = "300px"; // Consistent modal width
        modal.style.fontFamily = "'League Spartan', sans-serif";

        // Set modal content
        modal.innerHTML = `
            <p style="margin: 0 0 10px; font-size: 16px; font-weight: bold;">${message}</p>
            <span id="closeModal" style="cursor:pointer; font-size: 20px; font-weight: bold; color: red;">✖</span>
        `;

        // Append modal to body
        document.body.appendChild(modal);

        // Close modal on click
        document.getElementById("closeModal").addEventListener("click", () => {
            modal.remove();
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
            modal.remove();
        }, 5000);
    },

    // Signup Function
    signup: async function (formData) {
        try {
            const { email, password, username } = formData;

            // Validate email format
            if (!this.validateEmail(email)) {
                this.showModal("Invalid email format!", "error");
                return;
            }

            // Check if email already exists
            const emailExists = await this.checkEmailExists(email);
            if (emailExists) {
                this.showModal("Email already exists! Reset password?", "warning");
                return;
            }

            // Validate password strength
            if (!this.validatePassword(password)) {
                this.showModal("Password must have at least 10 characters, 1 uppercase, 1 lowercase, and 1 special character.", "error");
                return;
            }

            // Hash password before storing
            const hashedPassword = await this.hashPassword(password);

            // Store user in Firestore
            await this.storeUser({ email, username, password: hashedPassword });

            this.showModal("Signup successful! Redirecting to login...", "success");
            setTimeout(() => {
                window.location.href = "login.html"; // Redirect to login
            }, 3000);

        } catch (error) {
            this.showModal("Error during signup. Please try again.", "error");
            console.error(error);
        }
    },

    // Login Function
    login: async function (formData) {
        try {
            const { email, password } = formData;

            // Check if email exists
            const user = await this.getUserByEmail(email);
            if (!user) {
                this.showModal("Email not found. Please sign up.", "error");
                return;
            }

            // Compare hashed passwords
            const passwordMatch = await this.comparePassword(password, user.password);
            if (!passwordMatch) {
                this.showModal("Incorrect password. Try again.", "error");
                return;
            }

            // Login successful
            this.showModal("Login successful! Redirecting...", "success");

            setTimeout(() => {
                window.location.href = "dashboard.html"; // Redirect to dashboard
            }, 3000);

        } catch (error) {
            this.showModal("Error during login. Please try again.", "error");
            console.error(error);
        }
    },

    // Reset Password Function
    resetPassword: async function (email) {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) {
                this.showModal("Email not registered. Please sign up.", "error");
                return;
            }

            // Generate reset token
            const resetToken = this.generateToken();
            await this.storeResetToken(email, resetToken);

            // Send reset email (mocked)
            console.log(`Reset token for ${email}: ${resetToken}`);

            this.showModal("Reset link sent to your email!", "success");

        } catch (error) {
            this.showModal("Error resetting password. Please try again.", "error");
            console.error(error);
        }
    },

    // Utility Functions
    validateEmail: function (email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    validatePassword: function (password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/.test(password);
    },

    hashPassword: async function (password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },

    comparePassword: async function (inputPassword, storedHash) {
        return await bcrypt.compare(inputPassword, storedHash);
    },

    checkEmailExists: async function (email) {
        // Simulating Firestore check
        return false;
    },

    storeUser: async function (userData) {
        // Simulating Firestore storage
        console.log("User stored:", userData);
    },

    getUserByEmail: async function (email) {
        // Simulating Firestore retrieval
        return null;
    },

    storeResetToken: async function (email, token) {
        // Simulating token storage
        console.log(`Token stored for ${email}: ${token}`);
    },

    generateToken: function () {
        return Math.random().toString(36).substr(2, 8);
    }
};
