
let currentDate = new Date();

let transactions = [
  { name: "Oziq-ovqat", amount: -450000 },
  { name: "Transport", amount: -28000 },
  { name: "Maosh", amount: 8500000 },
];

const monthTitle = document.querySelector(".month-title");
const leftBtn = document.querySelector(".arrow.left");
const rightBtn = document.querySelector(".arrow.right");

const months = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
];

function updateMonth() {
  monthTitle.textContent =
    months[currentDate.getMonth()] + " " + currentDate.getFullYear();
}

leftBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateMonth();
};

rightBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateMonth();
};

updateMonth();


const addBtn = document.querySelector(".add-fab");
const list = document.querySelector(".transaction-list");

addBtn.onclick = () => {
  let name = prompt("Nomi:");
  let amount = parseInt(prompt("Summa:"));

  if (!name || isNaN(amount)) return;

  transactions.push({ name, amount });

  renderTransactions();
};

function renderTransactions() {
  list.innerHTML = "";

  transactions.forEach((t) => {
    let div = document.createElement("div");
    div.className = "transaction-item";

    let sign = t.amount > 0 ? "+" : "-";
    let color = t.amount > 0 ? "positive" : "negative";

    div.innerHTML = `
      <div class="icon-container">
        <i class="icon">💰</i>
      </div>
      <div class="transaction-details">
        <span class="name">${t.name}</span>
        <span class="date">Hozir</span>
      </div>
      <div class="amount ${color}">
        ${sign} ${Math.abs(t.amount).toLocaleString()} so'm
      </div>
    `;

    list.appendChild(div);
  });
}

renderTransactions();


const downloadBtn = document.querySelector(".upload-button");

downloadBtn.onclick = () => {
  let content = "Hisobot:\n\n";

  transactions.forEach((t) => {
    content += `${t.name} : ${t.amount} so'm\n`;
  });

  let blob = new Blob([content], { type: "text/plain" });
  let link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "hisobot.txt";

  link.click();
};


const modal = document.getElementById("modal");
const openBtn = document.querySelector(".add-fab");
const closeBtn = document.querySelector(".cancel");


openBtn.addEventListener("click", () => {
  modal.classList.add("active");
});


closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});