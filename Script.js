const sendBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");
const clearBtn = document.getElementById("clear-btn");

function getRandomAvatar() {
  const avatars = ["🧑‍🎤", "🧑‍🚀", "🦸‍♂️", "🧚‍♀️", "🤖", "👽", "🐱", "🐶", "🐼", "🦁"];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    const timestamp = Date.now();
    const messageData = {
      text: message,
      timestamp: timestamp,
      likes: 0,
      avatar: getRandomAvatar()
    };
    db.ref("messages/" + timestamp).set(messageData);
    messageInput.value = "";
    messageInput.focus();
  }
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
clearBtn.addEventListener("click", () => db.ref("messages").remove());

db.ref("messages").on("value", (snapshot) => {
  chatBox.innerHTML = "";
  const messages = snapshot.val();
  for (let id in messages) {
    const { text, timestamp, likes = 0, avatar = "👤" } = messages[id];
    const timeStr = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msgDiv = document.createElement("div");
    msgDiv.className = "message";

    msgDiv.innerHTML = `
      <div class="avatar">${avatar}</div>
      <div class="message-content">
        <span>${text}</span>
        <span class="timestamp">${timeStr}</span>
        <button class="like-btn" data-id="${id}">❤️ ${likes}</button>
      </div>
    `;
    chatBox.appendChild(msgDiv);
  }

  chatBox.scrollTop = chatBox.scrollHeight;

  document.querySelectorAll(".like-btn").forEach(button => {
    button.onclick = () => {
      const id = button.dataset.id;
      const currentLikes = parseInt(button.textContent.replace(/[^\d]/g, ""));
      db.ref("messages/" + id).update({ likes: currentLikes + 1 });
    };
  });
});



