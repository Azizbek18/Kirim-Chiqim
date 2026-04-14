const modal = document.getElementById("categoryModal");
const openModalBtn = document.querySelector(".btn9"); 
const closeModalBtn = document.querySelector(".close");
const saveBtn = document.getElementById("saveCategory");
const categoryList = document.querySelector('.right-con');
const totalExpensesText = document.querySelector('.span');

openModalBtn.onclick = () => modal.style.display = "block";
closeModalBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }
const imageSrc = getCategoryImage(name);
saveBtn.onclick = function() {
    const name = document.getElementById("catName").value;
    const limit = document.getElementById("catLimit").value;
    const spent = document.getElementById("catSpent").value;

    if (name && limit && spent) {
        const percentage = Math.min(Math.round((spent / limit) * 100), 100);
        
        const newCategory = document.createElement('div');
   
newCategory.innerHTML = `
    <div class="hisoblar">
        <div class="card">
            <div class="start">
                <img src="${imageSrc}" alt="${name}">
                <div class="text">
                    <h1>${name}</h1>
                    <p>${Number(spent).toLocaleString()} / ${Number(limit).toLocaleString()}</p>
                </div>
            </div>
        </div>
        <div class="center" style="flex-grow: 1; margin: 0 20px;">
            <div style="width: 100%; background: #eee; height: 8px; border-radius: 5px;">
                <div style="width: ${percentage}%; background: ${percentage > 90 ? '#ff4d4d' : '#4CAF50'}; height: 100%; border-radius: 5px;"></div>
            </div>
        </div>
        <div class="end">
            <h1 class="foiz">${percentage}%</h1>
            <h1 class="som" style="white-space: nowrap;">-${Number(spent).toLocaleString()}</h1>
    
        </div>
    </div>
`;
        

        categoryList.insertBefore(newCategory, document.querySelector('.foter'));
        updateTotalExpenses(spent);

        document.getElementById("catName").value = "";
        document.getElementById("catLimit").value = "";
        document.getElementById("catSpent").value = "";
        modal.style.display = "none";
    } else {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
    }
}

function getCategoryImage(name) {
    const category = name.toLowerCase();

    if (category.includes("ovqat") || category.includes("food")) {
        return "./M_rasmlar/food.png";
    } else if (category.includes("transport")) {
        return "./M_rasmlar/transport.png";
    } else if (category.includes("uy") || category.includes("ijara")) {
        return "./M_rasmlar/home.png";
    } else if (category.includes("kiyim")) {
        return "./M_rasmlar/clothes.png";
    } else if (category.includes("sog'liq") || category.includes("tibbiyot")) {
        return "./M_rasmlar/health.png";
    } else if (category.includes("ta'lim")) {
        return "./M_rasmlar/education.png";
    } else if (category.includes("o'yin") || category.includes("ko'ngilochar")) {
        return "./M_rasmlar/entertainment.png";
    } else {
        return "./M_rasmlar/other.png";
    }
}
function updateTotalExpenses(amount) {
    let currentTotal = parseInt(totalExpensesText.innerText.replace(/[^\d]/g, '')) || 0;
    let updatedTotal = currentTotal + parseInt(amount);
    totalExpensesText.innerText = updatedTotal.toLocaleString() + " so'm";
}


document.addEventListener("DOMContentLoaded", function () {
    const monthYearElement = document.getElementById("currentMonthYear");
    const prevBtn = document.getElementById("prevMonth");
    const nextBtn = document.getElementById("nextMonth");

    const months = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
    ];

    let currentDate = new Date();

    function updateMonthYear() {
        const month = months[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        monthYearElement.textContent = `${month} ${year}`;
    }

    prevBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateMonthYear();
    });

    nextBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateMonthYear();
    });

    updateMonthYear();
});