
const moneyModal = document.getElementById("moneyModal");
let currentCard = null;

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentCard = btn.closest(".goal-card, .card");
    moneyModal.style.display = "flex";
  });
});

function closeModal(){
  moneyModal.style.display = "none";
}

function addMoney(){
  let val = document.getElementById("moneyInput").value;
  if(!val) return;

  alert(val + " so‘m qo‘shildi ✅");
  closeModal();
}


const goalModal = document.getElementById("goalModal");

document.querySelector(".add").addEventListener("click", () => {
  goalModal.style.display = "flex";
});

function closeGoalModal(){
  goalModal.style.display = "none";
}

function createGoal(){
  let name = document.getElementById("goalName").value;
  let price = document.getElementById("goalPrice").value;

  if(!name || !price) return;

  let div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <h4>${name}</h4>
    <b>${price} so'm</b>
    <div class="progress"><span style="width:0%"></span></div>
    <div class="btn">Pul qo‘shish</div>
  `;

  document.querySelector(".cards").appendChild(div);

  goalModal.style.display = "none";
}


function toggleMenu(){
  document.querySelector(".left-con").classList.toggle("active");
}
const openBtn = document.getElementById("openMenu");
const closeBtn = document.getElementById("closeMenu");
const menu = document.querySelector(".left-con");
const overlay = document.getElementById("overlay");

openBtn.onclick = () => {
  menu.classList.add("active");
  overlay.style.display = "block";
};

closeBtn.onclick = () => {
  menu.classList.remove("active");
  overlay.style.display = "none";
};

overlay.onclick = () => {
  menu.classList.remove("active");
  overlay.style.display = "none";
};

document.addEventListener("click", function(e){
  if(e.target.classList.contains("btn")){
    currentCard = e.target.closest(".goal-card, .card");
    moneyModal.style.display = "flex";
  }
});

function addMoney(){
  let input = document.getElementById("moneyInput");
  let val = input.value;

  if(!val) return;

  alert(val + " so‘m qo‘shildi ✅");
  input.value = "";
  closeModal();
}

function addMoney(){
  let input = document.getElementById("moneyInput");
  let val = Number(input.value);

  if(!val || !currentCard) return;

  let total = Number(currentCard.getAttribute("data-total"));
  let current = Number(currentCard.getAttribute("data-current")) || 0;

  current += val;

  if(current > total) current = total;

  currentCard.setAttribute("data-current", current);

  let percent = (current / total) * 100;

  let bar = currentCard.querySelector(".progress span, .bar");
  if(bar){
    bar.style.width = percent + "%";
  }

  let currentText = currentCard.querySelector(".current, .left");
  if(currentText){
    currentText.textContent = current.toLocaleString() + " so'm yig‘ildi";
  }

  input.value = "";
  closeModal();
}

function createGoal(){
  let name = document.getElementById("goalName").value;
  let price = document.getElementById("goalPrice").value;

  if(!name || !price) return;

  let div = document.createElement("div");
  div.className = "card";

  div.setAttribute("data-total", price);
  div.setAttribute("data-current", 0);

  div.innerHTML = `
    <h4>${name}</h4>
    <b>${price} so'm</b>

    <div class="progress">
      <span style="width:0%"></span>
    </div>

    <div class="row">
      <span class="current">0 yig‘ildi</span>
      <span>—</span>
    </div>

    <div class="btn">Pul qo‘shish</div>
  `;

  document.querySelector(".cards").appendChild(div);

  closeGoalModal();
}
