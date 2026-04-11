function format(num) {
  return num.toLocaleString("ru-RU");
}


function updateGoal(card) {
  let total = +card.dataset.total;
  let current = +card.dataset.current;

  let percent = Math.min((current / total) * 100, 100);

  card.querySelector(".bar").style.width = percent + "%";
  card.querySelector(".percent").innerText = percent.toFixed(1) + "% bajarildi";

  let left = total - current;
  card.querySelector(".left").innerText =
    format(left) + " so'm qoldi";
}


document.querySelectorAll(".btn").forEach(btn => {
  btn.onclick = () => {
    let card = btn.closest(".goal-card");

    let sum = parseInt(prompt("Qancha pul qo‘shasiz?"));
    if (!sum || sum <= 0) return;

    card.dataset.current = +card.dataset.current + sum;

    updateGoal(card);
  };
});


document.querySelectorAll(".goal-card").forEach(card => {
  updateGoal(card);
});



const addBox = document.querySelector(".btn");
const cards = document.querySelector(".cards");

addBox.onclick = () => {
  let name = prompt("Maqsad nomi:");
  let total = parseInt(prompt("Umumiy summa:"));

  if (!name || !total) return;

  let div = document.createElement("div");
  div.className = "goal-card";
  div.dataset.total = total;
  div.dataset.current = 0;

  div.innerHTML = `
    <h4>${name}</h4>

    <div class="progress">
      <div class="bar"></div>
    </div>

    <p class="percent"></p>
    <p class="left"></p>

    <button class="btn">Pul qo‘shish</button>
  `;

  cards.prepend(div);

  div.querySelector(".btn").onclick = () => {
    let sum = parseInt(prompt("Qancha pul qo‘shasiz?"));
    if (!sum) return;

    div.dataset.current = +div.dataset.current + sum;
    updateGoal(div);
  };

  updateGoal(div);
};