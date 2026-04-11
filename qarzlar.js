// 1. Supabase sozlamalari
const supabaseUrl = "https://pcdugrawrtezxmzagaqh.supabase.co";
const supabaseKey = 'sb_publishable_oJnISbwOks8wEIh6gCAkqw_Npr5Q6qB';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Global elementlar (hamma funksiyalar ishlata olishi uchun)
let listContainer, modal;

// 2. Ma'lumotlarni ekranga chiqarish (Render)
function renderCard(item) {
    if (!listContainer) return;

    const cardHtml = `
        <div class="card2" data-id="${item.id}">
            <div class="text2">
                <h1>${item.ism}</h1>
                <p><span>${item.qancha}</span> so'm - <small>${item.sana}</small></p>
            </div>
            <button class="boshqa2">Qaytarish</button>
        </div>
        <hr>`;
    listContainer.insertAdjacentHTML('beforeend', cardHtml);
}

// 3. Bazadan ma'lumotlarni olish
async function Olish() {
    const { data, error } = await _supabase
        .from('qarzlar')
        .select('*')
        .order('id', { ascending: false }); // Yangilari tepada chiqishi uchun

    if (error) {
        console.error("Xatolik yuz berdi:", error.message);
    } else {
        listContainer.innerHTML = ''; // Tozalash
        data.forEach(item => renderCard(item));
    }
}

// 4. Yangi qarz qo'shish
async function Yuborish() {
    const nameInput = document.getElementById('debtName');
    const amountInput = document.getElementById('debtAmount');
    const reasonInput = document.getElementById('debtReason');

    const name = nameInput.value.trim();
    const summa = amountInput.value.trim();
    const reason = reasonInput.value.trim();

    if (name && summa && reason) {
        const { data, error } = await _supabase
            .from('qarzlar')
            .insert([{ ism: name, qancha: summa, sana: reason }])
            .select();

        if (error) {
            alert("Bazaga yozishda xatolik: " + error.message);
        } else {
            alert("Muvaffaqiyatli qo'shildi!");
            // Formani tozalash
            nameInput.value = '';
            amountInput.value = '';
            reasonInput.value = '';
            modal.style.display = 'none';
            
            // Sahifani yangilamasdan yangi qatorni qo'shish
            if (data) renderCard(data[0]);
        }
    } else {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
    }
}

// 5. Asosiy Event Listenerlar (Yuklanganda ishlaydi)
document.addEventListener('DOMContentLoaded', () => {
    // Elementlarni tanlab olamiz
    listContainer = document.querySelector('.chiqim-kirim');
    modal = document.getElementById('debtModal');
    const addBtn = document.querySelector('.foter .btn');
    const closeBtn = document.querySelector('.close-btn');
    const saveBtn = document.getElementById('saveDebtBtn');
    const searchInput = document.querySelector('.input-3');

    // Dastlabki ma'lumotlarni yuklash
    Olish();

    // Modalni ochish
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    // Modalni yopish
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Saqlash tugmasi
    if (saveBtn) {
        saveBtn.addEventListener('click', Yuborish);
    }

    // Tashqariga bosganda yopish
    window.addEventListener('click', (e) => {
        if (e.target == modal) modal.style.display = 'none';
    });

    // Qarzni qaytarish (Delegation orqali)
    if (listContainer) {
        listContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('boshqa2')) {
                if (confirm("Ushbu qarz qaytarildimi?")) {
                    const btn = e.target;
                    btn.innerText = "Qaytarildi";
                    btn.style.background = "green";
                    btn.style.color = "white";
                    btn.classList.replace('boshqa2', 'boshqa6');
                    
                    const textContent = btn.previousElementSibling;
                    if (textContent) textContent.style.opacity = "0.5";
                }
            }
        });
    }

    // Qidiruv funksiyasi
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.card2');
            cards.forEach(card => {
                const name = card.querySelector('h1').innerText.toLowerCase();
                const isVisible = name.includes(value);
                card.style.display = isVisible ? 'flex' : 'none';
                if (card.nextElementSibling?.tagName === 'HR') {
                    card.nextElementSibling.style.display = isVisible ? 'block' : 'none';
                }
            });
        });
    }
});