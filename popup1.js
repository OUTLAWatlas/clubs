document.addEventListener("DOMContentLoaded", function () {
  // Get the form element
  const form = document.getElementById("contactForm");

  if (!form) {
    console.error("Form with id 'contactForm' not found.");
    return;
  }

  // Add submit event listener to the form
  form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = form.querySelector('input[type="text"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const message = form.querySelector('textarea')?.value.trim(); // optional
  const passwordField = form.querySelector('input[type="password"]');
  const password = passwordField ? passwordField.value.trim() : null;

  if (!name || !email || (message === undefined ? false : !message)) {
    showPopup("Please fill out all fields.", true);
    return;
  }

  if (!email.endsWith("@vit.edu")) {
    showPopup("Only @vit.edu email addresses are allowed.", true);
    return;
  }

  if (password && password.length < 6) {
    showPopup("Password must be at least 6 characters.", true);
    return;
  }

  showPopup("Message sent successfully! We'll get back to you soon.");
  form.reset();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.innerHTML = "Message Sent!";
  submitBtn.style.background = "linear-gradient(135deg, #33d685, #10b981)";

  setTimeout(() => {
    submitBtn.innerHTML = "Send Message";
    submitBtn.style.background = "linear-gradient(135deg, #8e2de2, #4a00e0)";
  }, 3000);
}); 
  // Function to show popup notifications
  function showPopup(message, isError = false) {
    // Create popup element
    const popup = document.createElement("div");
    popup.classList.add("custom-popup");
    
    // Style based on message type (error or success)
    if (isError) {
      popup.style.backgroundColor = "#e74c3c";
      popup.style.boxShadow = "0 5px 30px rgba(231, 76, 60, 0.3)";
    } else {
      popup.style.backgroundColor = "#10b981";
      popup.style.boxShadow = "0 5px 30px rgba(16, 185, 129, 0.3)";
    }
    
    // Add icon based on type
    const icon = isError ? "❌" : "✅";
    popup.innerHTML = `<span style="margin-right: 8px;">${icon}</span> ${message}`;
    
    // Add popup to the body
    document.body.appendChild(popup);
    
    // Remove popup after delay
    setTimeout(() => {
      popup.style.opacity = "0";
      popup.style.transform = "translateX(-50%) translateY(30px)";
      setTimeout(() => popup.remove(), 300);
    }, 3000);
  }
});