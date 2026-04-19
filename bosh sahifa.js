document.addEventListener("DOMContentLoaded", () => {


  let currentDate = new Date();

  let transactions = [
    { name: "Oziq-ovqat", amount: -450000 },
    { name: "Transport", amount: -28000 },
    { name: "Maosh", amount: 8500000 },
  ];


  const monthTitle = document.querySelector(".month-title");
  const leftBtn = document.querySelector(".arrow.left");
  const rightBtn = document.querySelector(".arrow.right");
  const list = document.querySelector(".transaction-list");

  const modal = document.getElementById("modal");
  const openBtns = document.querySelectorAll(".add-fab, .add-icon");
  const closeBtn = document.querySelector(".cancel");
  const saveBtn = document.querySelector(".save");

  const nameInput = modal.querySelector("input[type='text']");
  const amountInput = modal.querySelector("input[type='number']");

  const downloadBtn = document.querySelector(".upload-button");

  const months = [
    "Yanvar","Fevral","Mart","Aprel","May","Iyun",
    "Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"
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


  openBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      modal.classList.add("active");
    });
  });

  closeBtn.onclick = () => modal.classList.remove("active");

  modal.onclick = (e) => {
    if(e.target === modal){
      modal.classList.remove("active");
    }
  };

  saveBtn.onclick = () => {
    const name = nameInput.value.trim();
    const amount = parseInt(amountInput.value);

    if (!name || isNaN(amount)) {
      alert("To‘ldir!");
      return;
    }

    transactions.unshift({ name, amount });
    renderTransactions();

    nameInput.value = "";
    amountInput.value = "";

    modal.classList.remove("active");
  };

 
  downloadBtn.onclick = () => {
    let content = "Hisobot:\n\n";

    transactions.forEach((t) => {
      content += `${t.name}: ${t.amount} so'm\n`;
    });

    let blob = new Blob([content], { type: "text/plain" });
    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "hisobot.txt";
    link.click();
  };


  const bell = document.getElementById("bell");
  const help = document.getElementById("help");
  const bellModal = document.getElementById("bellModal");
  const helpModal = document.getElementById("helpModal");

  bell.onclick = () => bellModal.classList.add("active");
  help.onclick = () => helpModal.classList.add("active");

  window.onclick = (e) => {
    if(e.target.classList.contains("modal")){
      e.target.classList.remove("active");
    }
  };

});


const burger = document.getElementById("burger");
const sidebar = document.querySelector(".left-con");
const overlay = document.getElementById("overlay");

burger.onclick = () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
};


overlay.onclick = () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
};
burger.onclick = () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");

  document.body.style.overflow =
    sidebar.classList.contains("active") ? "hidden" : "auto";
};