const chat = document.getElementById("chat");
const input = document.getElementById("input");
const imageInput = document.getElementById("imageInput");

function addMessage(text, type = "user", image = null) {
  if (!chat) return;

  const div = document.createElement("div");
  div.className = "msg " + type;

  if (text) {
    const textBlock = document.createElement("div");
    textBlock.innerText = text;
    div.appendChild(textBlock);
  }

  if (image) {
    const img = document.createElement("img");
    img.src = image;
    img.alt = "Yuklangan rasm";
    div.appendChild(img);
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function getAIResponse(text) {
  const normalizedText = text.toLowerCase();

  if (normalizedText.includes("salom")) {
    return "Va alaykum assalom. Sizga byudjet bo'yicha qanday yordam bera olaman?";
  }

  if (normalizedText.includes("pul") || normalizedText.includes("byudjet")) {
    return "Xarajatlaringizni toifalarga ajrating va kamida 20 foizini jamg'armaga yo'naltiring.";
  }

  if (normalizedText.includes("qarz")) {
    return "Qarzlarni eng yuqori foizli yoki eng kichik summalardan boshlab yopish foydali bo'ladi.";
  }

  if (normalizedText.includes("tejash")) {
    return "Doimiy obunalar, transport va mayda kundalik xarajatlar birinchi optimallashtiriladigan joy bo'ladi.";
  }

  return "Tushundim. Xohlasangiz xarajatlaringizni tahlil qilib, qayerdan tejash mumkinligini aytib beraman.";
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "uz-UZ";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}

function send() {
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");

  window.setTimeout(() => {
    const reply = getAIResponse(text);
    addMessage(reply, "ai");
    speak(reply);
  }, 450);

  input.value = "";
  input.focus();
}

function startVoice() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!Recognition) {
    addMessage("Bu brauzer ovozli kiritishni qo'llab-quvvatlamaydi.", "ai");
    return;
  }

  const recognition = new Recognition();
  recognition.lang = "uz-UZ";

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    if (input) {
      input.value = text;
      send();
    }
  };

  recognition.onerror = function () {
    addMessage("Ovozli yozishda xatolik yuz berdi. Qayta urinib ko'ring.", "ai");
  };

  recognition.start();
}

if (input) {
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      send();
    }
  });
}

if (imageInput) {
  imageInput.addEventListener("change", function () {
    const file = this.files && this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      addMessage("Rasm yuborildi.", "user", event.target.result);

      window.setTimeout(() => {
        addMessage("Rasm qabul qilindi. Xohlasangiz shu rasm asosida tavsiya beraman.", "ai");
      }, 400);
    };

    reader.readAsDataURL(file);
    this.value = "";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  addMessage("Salom. Men sizning AI yordamchingizman. Xarajat, tejash yoki qarzlar haqida savol berishingiz mumkin.", "ai");
});
