function planUpdate(){
 alert("Reja yangilandi!");
}

function addAchievement(){
 const ul = document.getElementById('achievements');
 const li = document.createElement('li');
 li.textContent = "🏅 Yangi maqsad qo'shildi";
 ul.appendChild(li);
}

const lineCtx = document.getElementById('lineChart');
const lineCtx = document.getElementById('lineChart');
new Chart(lineCtx, {
 type: 'line',
 data: {
 labels: ['Okt','Noy','Dek','Yan','Fev','Mart'],
 datasets: [{
 label: 'Kirim',
 data: [5,6,7,8,7,9],
 borderColor: 'green'
 },{
 label: 'Chiqim',
 data: [4,5,6,7,6,8],
 borderColor: 'red'
 }]
 }
});

const pieCtx = document.getElementById('pieChart');
new Chart(pieCtx, {
 type: 'doughnut',
 data: {
 labels: ['Oziq-ovqat','Ijara','Kommunal','Boshqa'],
 datasets: [{
 data: [45,30,15,10],
 backgroundColor:['red','blue','green','gray']
 }]
 }
});

function downloadPDF() {
 window.print();
}