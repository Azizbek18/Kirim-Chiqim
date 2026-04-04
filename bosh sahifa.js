
let transactions = [
  { name: "Oziq-ovqat", amount: -450000 },
  { name: "Transport", amount: -28000 },
  { name: "Maosh", amount: 8500000 },
  { name: "Uy-joy", amount: -1200000 },
  { name: "Ta'lim", amount: -150000 }
];

function render() {
  let list = document.getElementById("list");
  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    let div = document.createElement("div");
    div.className = "transaction";

    div.innerHTML = `
      <span>${t.name}</span>
      <span class="${t.amount > 0 ? 'green' : 'red'}">
        ${t.amount.toLocaleString()} so'm
      </span>
    `;

    list.appendChild(div);

    if (t.amount > 0) income += t.amount;
    else expense += t.amount;
  });

  document.getElementById("income").innerText = income.toLocaleString();
  document.getElementById("expense").innerText = expense.toLocaleString();
  document.getElementById("balance").innerText =
    (income + expense).toLocaleString() + " so'm";
}

render();


function downloadReport() {
  let csv = "Nomi,Summa\n";

  transactions.forEach(t => {
    csv += `${t.name},${t.amount}\n`;
  });

  let blob = new Blob([csv], { type: "text/csv" });
  let a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "hisobot.csv";
  a.click();
}
