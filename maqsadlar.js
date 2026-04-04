const cards = document.querySelectorAll(".goal-card");

cards.forEach((card, index) => {

  const total = +card.dataset.total;
  let current = +card.dataset.current;

  const bar = card.querySelector(".bar");
  const percentText = card.querySelector(".percent");
  const leftText = card.querySelector(".left");
  const btn = card.querySelector(".add-btn");

  const key = "goal_" + index;

  if(localStorage.getItem(key)){
    current = +localStorage.getItem(key);
  }

  function updateUI(){
    let percent = Math.min((current / total) * 100, 100);

    bar.style.width = percent + "%";
    percentText.innerText = percent.toFixed(1) + "% bajarildi";

    let left = total - current;
    leftText.innerText = left.toLocaleString() + " so‘m qoldi";
  }

  updateUI();

  btn.addEventListener("click", () => {
    let amount = prompt("Qancha pul qo‘shasiz?");
    amount = +amount;

    if(!amount || amount <= 0) return;

    current += amount;


    localStorage.setItem(key, current);

    updateUI();
  });

});