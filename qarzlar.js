
const supabaseUrl = "https://pcdugrawrtezxmzagaqh.supabase.co";
const supabaseKey = 'sb_publishable_oJnISbwOks8wEIh6gCAkqw_Npr5Q6qB';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

let listContainer, modal;

function renderCard(item) {
    if (!listContainer) return;

    const cardHtml = `
        <div class="card2" data-id="${item.id}">
            <div class="text2">
                <h1>${item.ism}</h1>
                <p> ${item.sabab} - <small>${item.sana}</small></p>
            </div>
            <div><p class="item"><span>${item.qancha}</span> so'm</p>
            <button class="boshqa2">${item.holat}</button></div>
        </div>
        <hr>`;
    listContainer.insertAdjacentHTML('beforeend', cardHtml);
}

async function Olish() {
    const { data, error } = await _supabase
        .from('qarzlar')
        .select('*')
        .order('id', { ascending: false });
    if (error) {
        console.error("Xatolik yuz berdi:", error.message);
    } else {
        listContainer.innerHTML = '';
        data.forEach(item => renderCard(item));
    }
}

async function Jonatish() {
    const nameInput = document.getElementById('ism');
    const amountInput = document.getElementById('summa');
    const reasonInput = document.getElementById('sana');
    const holatInput = document.getElementById("holat");
    const sabab = document.getElementById("sabab")
    const name = nameInput.value.trim();
    const summa = amountInput.value.trim();
    const reason = reasonInput.value.trim();


    if (name && summa && reason) {
        const { data, error } = await _supabase
            .from('qarzlar')
            .insert([{
                ism: name,
                qancha: summa,
                sabab: sabab.value,
                sana: new Date().toLocaleDateString(),
                holat: holatInput.value
            }])
            .select();

        if (error) {
            alert("Bazaga yozishda xatolik: " + error.message);
        } else {
            alert("Muvaffaqiyatli qo'shildi!");
            nameInput.value = '';
            amountInput.value = '';
            reasonInput.value = '';
            modal.style.display = 'none';

            if (data && data.length > 0) renderCard(data[0]);
        }
    } else {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Olish();
});

document.addEventListener('DOMContentLoaded', () => {
    listContainer = document.querySelector('.chiqim-kirim');
    modal = document.getElementById('debtModal');
    const addBtn = document.querySelector('.foter .btn');
    const closeBtn = document.querySelector('.close-btn');
    const saveBtn = document.getElementById('save-Btn');
    const searchInput = document.querySelector('.input-3');

    Olish();

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', Jonatish);
    }

    window.addEventListener('click', (e) => {
        if (e.target == modal) modal.style.display = 'none';
    });

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

    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.left-con');
    const overlay = document.getElementById('sidebar-overlay');

    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        const icon = menuToggle.querySelector('i');
        if(sidebar.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    }

    menuToggle.addEventListener('click', toggleMenu);
    
    overlay.addEventListener('click', toggleMenu);