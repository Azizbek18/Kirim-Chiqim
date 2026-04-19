
const chat = document.getElementById("chat");
const input = document.getElementById("input");


function addMessage(text, type = "user", image = null) {
  const div = document.createElement("div");
  div.className = "msg " + type;

  if (text) {
    const p = document.createElement("div");
    p.innerText = text;
    div.appendChild(p);
  }

  if (image) {
    const img = document.createElement("img");
    img.src = image;
    div.appendChild(img);
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}


function getAIResponse(text) {
  text = text.toLowerCase();

  if (text.includes("salom")) {
    return "Va alaykum assalom 😊";
  }

  if (text.includes("pul") || text.includes("byudjet")) {
    return "Xarajatlaringizni nazorat qiling va 20% tejashga harakat qiling 💰";
  }

  if (text.includes("qarz")) {
    return "Qarzlarni kichikdan boshlab yopish samaraliroq 📉";
  }

  return "Tushundim 👍 yana savol bering!";
}


function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "uz-UZ";
  speechSynthesis.speak(speech);
}


function send() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");

  setTimeout(() => {
    const reply = getAIResponse(text);
    addMessage(reply, "ai");
    speak(reply);
  }, 500);

  input.value = "";
}


input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") send();
});

function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "uz-UZ";

  recognition.onresult = function(event) {
    const text = event.results[0][0].transcript;
    input.value = text;
    send();
  };

  recognition.start();
}

document.getElementById("imageInput").addEventListener("change", function() {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    addMessage("", "user", e.target.result);

    setTimeout(() => {
      addMessage("Rasm qabul qilindi 📸", "ai");
    }, 500);
  };

  reader.readAsDataURL(file);
});

  const burger = document.getElementById("burger");
  const sidebar = document.querySelector(".left-con");
  const overlay = document.getElementById("overlay");

  burger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
