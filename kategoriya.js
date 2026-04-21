const SUPABASE_URL = 'https://pcdugrawrtezxmzagaqh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_oJnISbwOks8wEIh6gCAkqw_Npr5Q6qB';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let listContainer;
let totalExpensesText;
let modal;

document.addEventListener('DOMContentLoaded', () => {
    listContainer = document.querySelector('.chiqim-kirim') || document.querySelector('.right-con');
    totalExpensesText = document.querySelector('.span');
    modal = document.getElementById('categoryModal');
    
    const openModalBtn = document.querySelector(".btn9");
    const closeModalBtn = document.querySelector(".close");
    const saveBtn = document.getElementById("saveCategory");

    if (openModalBtn) openModalBtn.onclick = () => modal.style.display = "block";
    if (closeModalBtn) closeModalBtn.onclick = () => modal.style.display = "none";
    
    window.onclick = (event) => { 
        if (event.target == modal) modal.style.display = "none"; 
    };

    if (saveBtn) {
        saveBtn.addEventListener('click', Jonatish);
    }

    Olish();
    initCalendar();
});

async function Olish() {
    const { data, error } = await _supabase
        .from('kategoriyalar') 
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error("Xatolik yuz berdi:", error.message);
    } else {
        let total = 0;
        data.forEach(item => {
            renderCard(item);
            total += parseFloat(item.sarflangan || 0);
        });
        updateTotalDisplay(total);
    }
}

async function Jonatish() {
    const name = document.getElementById("catName").value;
    const limit = document.getElementById("catLimit").value;
    const spent = document.getElementById("catSpent").value;

    if (name && limit && spent) {
        const { data, error } = await _supabase
            .from('kategoriyalar')
            .insert([{
                nomi: name,
                oylik_limit: parseFloat(limit),
                sarflangan: parseFloat(spent)
            }])
            .select();

        if (error) {
            alert("Xatolik: " + error.message);
        } else {
            alert("Muvaffaqiyatli qo'shildi!");

            document.getElementById("catName").value = "";
            document.getElementById("catLimit").value = "";
            document.getElementById("catSpent").value = "";
            modal.style.display = "none";
            
            if (data && data.length > 0) {
                renderCard(data[0]);
                addToTotal(spent);
            }
        }
    } else {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
    }
    


    
}

function renderCard(item) {
    const percentage = Math.min(Math.round((item.sarflangan / item.oylik_limit) * 100), 100);
    const imageSrc = getCategoryImage(item.nomi);

    const cardHTML = `
    <div class="hisoblar" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
        <div class="card">
            <div class="start" style="display:flex; align-items:center;">
                <img src="${imageSrc}" alt="${item.nomi}" style="width:40px; margin-right:10px;">
                <div class="text">
                    <h1 style="font-size:16px; margin:0;">${item.nomi}</h1>
                    <p style="font-size:12px; color:#666;">${Number(item.sarflangan).toLocaleString()} / ${Number(item.oylik_limit).toLocaleString()}</p>
                </div>
            </div>
        </div>
        <div class="center" style="flex-grow: 1; margin: 0 20px;">
            <div style="width: 100%; background: #eee; height: 8px; border-radius: 5px;">
                <div style="width: ${percentage}%; background: ${percentage > 90 ? '#ff4d4d' : '#4CAF50'}; height: 100%; border-radius: 5px;"></div>
            </div>
        </div>
        <div class="end" style="text-align:right;">
            <h1 class="foiz" style="font-size:14px; margin:0;">${percentage}%</h1>
            <h1 class="som" style="white-space: nowrap; font-size:14px; color:red;">-${Number(item.sarflangan).toLocaleString()}</h1>
        </div>
    </div>`;

    const div = document.createElement('div');
    div.innerHTML = cardHTML;
    
    const footer = document.querySelector('.foter');
    if (footer) {
        listContainer.insertBefore(div, footer);
    } else {
        listContainer.appendChild(div);
    }
}

function getCategoryImage(name) {
    const category = name.toLowerCase();
    const path = "./M_rasmlar/";
    if (category.includes("ovqat")) return path + "food.png";
    if (category.includes("transport")) return path + "transport.png";
    if (category.includes("uy")) return path + "home.png";
    if (category.includes("kiyim")) return path + "clothes.png";
    if (category.includes("sog'liq")) return path + "health.png";
    return path + "other.png";
}

function updateTotalDisplay(total) {
    if (totalExpensesText) {
        totalExpensesText.innerText = total.toLocaleString() + " so'm";
    }
}

function addToTotal(amount) {
    let currentTotal = parseInt(totalExpensesText.innerText.replace(/[^\d]/g, '')) || 0;
    updateTotalDisplay(currentTotal + parseInt(amount));
}

function initCalendar() {
    const monthYearElement = document.getElementById("currentMonthYear");
    const prevBtn = document.getElementById("prevMonth");
    const nextBtn = document.getElementById("nextMonth");
    if (!monthYearElement) return;

    const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
    let currentDate = new Date();

    const updateMonthYear = () => {
        monthYearElement.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    };

    if (prevBtn) prevBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); updateMonthYear(); };
    if (nextBtn) nextBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); updateMonthYear(); };

    updateMonthYear();
}

    const menuToggle = document.getElementById('menu-toggle');
    const leftCon = document.querySelector('.left-con');

    menuToggle.addEventListener('click', () => {
        leftCon.classList.toggle('active');
        
        const icon = menuToggle.querySelector('i');
        if (leftCon.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times'); 
        } else {
            icon.classList.replace('fa-times', 'fa-bars'); 
        }
    });

    document.addEventListener('click', (e) => {
        if (!leftCon.contains(e.target) && !menuToggle.contains(e.target)) {
            leftCon.classList.remove('active');
        }
    });
