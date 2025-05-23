document.addEventListener("DOMContentLoaded", () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAdmin) return;

  const committeeSection = document.querySelector(".committee");
  const storiesSection = document.querySelector(".stories");

  if (storiesSection) {
    const storyForm = document.createElement("form");
    storyForm.innerHTML = `
      <textarea placeholder="Add a success story..." required style="width:100%;height:80px;"></textarea>
      <button type="submit" style="margin-top:10px;">✅ Submit & Email</button>
    `;
    storyForm.onsubmit = async (e) => {
      e.preventDefault();
      const msg = e.target.querySelector("textarea").value;
      if (!msg) return;

      storiesSection.innerHTML += `<p>${msg}</p>`;

      await fetch("send_email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });

      alert("Success story emailed!");
      e.target.reset();
    };

    storiesSection.appendChild(storyForm);
  }
  if (isAdmin) {
  const adminBanner = document.createElement("div");
  adminBanner.textContent = "✅ Admin Mode";
  adminBanner.style = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #27ae60;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: bold;
    z-index: 9999;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(adminBanner);

  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "🚪 Logout";
  logoutBtn.style = `
    position: fixed;
    top: 10px;
    left: 10px;
    background: #c0392b;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    z-index: 9999;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
  `;
  logoutBtn.onclick = () => {
    localStorage.clear();
    window.location.href = "login.html"; // optional redirect
  };
  document.body.appendChild(logoutBtn);
}
});