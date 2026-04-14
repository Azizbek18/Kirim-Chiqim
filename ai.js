// =====================
// DATA (demo)
// =====================
let balance = 12450000;
let income = 8500000;
let expense = 6050000;

// =====================
// ELEMENTLAR
// =====================
const input = document.getElementById("input");
const chat = document.getElementById("chat");

// =====================
// SEND FUNCTION
// =====================
function send() {
  let text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  let reply = getAIResponse(text.toLowerCase());

  setTimeout(() => {
    addMessage(reply, "ai");
  }, 400);
}

// ENTER BOSILSA HAM YUBORADI
input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    send();
  }
});


// =====================
// MESSAGE CHIQARISH
// =====================
function addMessage(text, type) {
  let div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}


// =====================
// AI LOGIC
// =====================
function getAIResponse(text) {

  if (text.includes("salom") || text.includes("assalom")) {
    return "Va alaykum assalom! 😊 Byudjetingizni tahlil qilib beraman.";
  }

  if (text.includes("balans")) {
    return `Sizning balansingiz: ${format(balance)} so'm 💰`;
  }

  if (text.includes("kirim")) {
    return `Oylik daromadingiz ${format(income)} so'm 👍`;
  }

  if (text.includes("chiqim")) {
    return `Siz ${format(expense)} so'm sarflagansiz. Nazorat qilish kerak ⚠️`;
  }

  if (text.includes("qancha tejadim") || text.includes("tejash")) {
    let save = income - expense;
    return `Siz ${format(save)} so'm tejagansiz 💵`;
  }

  if (text.includes("maslahat")) {
    return generateAdvice();
  }

  return random([
    "Aniqroq yozing 🙂 Masalan: balans, chiqim, maslahat",
    "Men sizga moliyaviy yordam bera olaman 💡",
    "Byudjet haqida savol bering 😉"
  ]);
}


// =====================
// SMART MASLAHAT
// =====================
function generateAdvice() {
  let save = income - expense;

  if (save < 0) {
    return "❗ Siz zarar qilyapsiz. Xarajatlarni kamaytiring!";
  }

  if (save < income * 0.2) {
    return "⚠️ Tejash kam. Kamida 20% saqlashga harakat qiling.";
  }

  return random([
    "👏 Zo‘r! Siz yaxshi tejayapsiz!",
    "💡 Ortiqcha xarajatlarni kamaytirsangiz yanada yaxshi bo‘ladi",
    "📊 Budgetingiz yaxshi nazoratda!"
  ]);
}


// =====================
// HELPERS
// =====================
function format(num) {
  return num.toLocaleString("ru-RU");
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}