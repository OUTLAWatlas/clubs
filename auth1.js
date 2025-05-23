document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showLoginAlert("Please fill in both fields.", "error");
    shakeForm();
    return;
  }

  if (!email.endsWith("@vit.edu")) {
    showLoginAlert("Access denied. Only @vit.edu emails allowed.", "error");
    highlightField("email");
    return;
  }

  // Load credential list from htdocs
  fetch("htdocs/credentials.json")
    .then((res) => res.json())
    .then((data) => {
      const isAdmin = data.users.some(
        (u) => u.email === email && u.password === password
      );

      // Store login info
      localStorage.setItem("loggedInEmail", email);
      if (isAdmin) {
        localStorage.setItem("isAdmin", "true");
      } else {
        localStorage.removeItem("isAdmin");
      }

      showLoginAlert("Login successful! Redirecting...", "success");

      const loginButton = document.querySelector("#loginForm button");
      loginButton.innerHTML =
        '<span class="loading-spinner"></span> Logging in...';
      loginButton.disabled = true;

      setTimeout(() => {
        window.location.href = "clubs_main.html";
      }, 1500);
    })
    .catch(() => {
      showLoginAlert("Error loading credentials file.", "error");
    });
});

function showLoginAlert(message, type) {
  const existingAlert = document.querySelector(".login-alert");
  if (existingAlert) existingAlert.remove();

  const alert = document.createElement("div");
  alert.className = `login-alert ${type}`;
  alert.textContent = message;

  const form = document.getElementById("loginForm");
  form.insertBefore(alert, form.firstChild);

  setTimeout(() => {
    alert.style.opacity = "1";
    alert.style.transform = "translateY(0)";
  }, 10);

  if (type === "success") {
    setTimeout(() => {
      alert.style.opacity = "0";
      alert.style.transform = "translateY(-10px)";
      setTimeout(() => alert.remove(), 300);
    }, 3000);
  }
}

function highlightField(fieldId) {
  const field = document.getElementById(fieldId);
  field.classList.add("field-error");
  field.focus();
  setTimeout(() => field.classList.remove("field-error"), 1000);
}

function shakeForm() {
  const form = document.getElementById("loginForm");
  form.classList.add("shake-animation");
  setTimeout(() => form.classList.remove("shake-animation"), 500);
}

// Visual styles and background particles
document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");
  style.textContent = `
    .login-alert {
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 15px;
      font-size: 14px;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    }

    .login-alert.error {
      background-color: rgba(231, 76, 60, 0.15);
      border-left: 4px solid #e74c3c;
      color: #c0392b;
    }

    .login-alert.success {
      background-color: rgba(46, 204, 113, 0.15);
      border-left: 4px solid #2ecc71;
      color: #27ae60;
    }

    .field-error {
      border-color: #e74c3c !important;
      animation: pulse-error 1s ease;
    }

    @keyframes pulse-error {
      0%, 100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4); }
      50% { box-shadow: 0 0 0 8px rgba(231, 76, 60, 0); }
    }

    .shake-animation {
      animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }

    .loading-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  createBackgroundParticles();
});

function createBackgroundParticles() {
  const particlesContainer = document.createElement("div");
  particlesContainer.className = "particles";
  document.body.appendChild(particlesContainer);

  for (let i = 0; i < 25; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    const size = Math.random() * 30 + 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.opacity = `${Math.random() * 0.3}`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;

    particlesContainer.appendChild(particle);
  }
}