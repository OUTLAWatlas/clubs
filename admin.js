document.addEventListener("DOMContentLoaded", () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const storiesSection = document.querySelector(".stories");

  if (!isAdmin) return;

  const PLACEHOLDER_IMG = "https://via.placeholder.com/300x150?text=Success+Story";

  const savedStories = JSON.parse(localStorage.getItem("clubStories") || "[]");
  savedStories.forEach(story => addStoryToDOM(story.text, story.img, true));

  const storyForm = document.createElement("form");
  storyForm.innerHTML = `
    <textarea placeholder="Add a success story..." required style="width:100%;height:80px;"></textarea>
    <input type="file" accept="image/*" style="margin-top:10px;" />
    <button type="submit" style="margin-top:10px;">✅ Submit & Email</button>
  `;
  storiesSection.appendChild(storyForm);

  storyForm.onsubmit = async (e) => {
    e.preventDefault();
    const msg = e.target.querySelector("textarea").value.trim();
    const fileInput = e.target.querySelector("input[type='file']");
    const file = fileInput.files[0];

    if (!msg) return;

    if (file) {
      const reader = new FileReader();
      reader.onload = async function () {
        const imgData = reader.result;
        addStoryToDOM(msg, imgData);
        saveStory(msg, imgData);
        await sendEmail(msg);
        alert("Success story emailed!");
        e.target.reset();
      };
      reader.readAsDataURL(file);
    } else {
      addStoryToDOM(msg, PLACEHOLDER_IMG);
      saveStory(msg, PLACEHOLDER_IMG);
      await sendEmail(msg);
      alert("Success story emailed!");
      e.target.reset();
    }
  };

function addStoryToDOM(msg, img, skipSave = false) {
  const wrapper = document.createElement("div");
  wrapper.style = `
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    background: #2a2a2a;
    border-radius: 12px;
    padding: 15px;
    position: relative;
    box-shadow: 0 0 10px rgba(255, 110, 196, 0.1);
  `;

  // Create a container for optional image + text
  const contentWrapper = document.createElement("div");
  contentWrapper.style = "display: flex; align-items: flex-start; gap: 15px; width: 100%;";

  // If an image was uploaded, add it
  if (img) {
    const image = document.createElement("img");
    image.src = img;
    image.alt = "Story Image";
    image.style = `
      width: 80px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
    `;
    contentWrapper.appendChild(image);
  }

  const p = document.createElement("p");
  p.textContent = msg;
  p.style = `
    color: #ccc;
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
    flex: 1;
  `;
  contentWrapper.appendChild(p);
  wrapper.appendChild(contentWrapper);

  if (isAdmin) {
    const del = document.createElement("button");
    del.textContent = "🗑";
    del.style = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: transparent;
      color: #ff6ec4;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
    `;
    del.onclick = () => {
      wrapper.remove();
      deleteStory(msg);
    };
    wrapper.appendChild(del);
  }

  const storyForm = document.querySelector("form");
  const storiesSection = document.querySelector(".stories");
  storiesSection.insertBefore(wrapper, storyForm);
}

  function saveStory(msg, img) {
    const current = JSON.parse(localStorage.getItem("clubStories") || "[]");
    current.push({ text: msg, img });
    localStorage.setItem("clubStories", JSON.stringify(current));
  }

  function deleteStory(msg) {
    const current = JSON.parse(localStorage.getItem("clubStories") || "[]");
    const updated = current.filter(story => story.text !== msg);
    localStorage.setItem("clubStories", JSON.stringify(updated));
  }

  async function sendEmail(msg) {
    await fetch("htdocs/send_email.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });
  }

  // Admin UI elements
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
    location.href = "login.html";
  };
  document.body.appendChild(logoutBtn);
});
