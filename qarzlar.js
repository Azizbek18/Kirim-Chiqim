// 1. SUPABASE SOZLAMALARI
const supabaseUrl = "https://pcdugrawrtezxmzagaqh.supabase.co";
const supabaseKey = 'sb_publishable_oJnISbwOks8wEIh6gCAkqw_Npr5Q6qB';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

let listContainer;

// 2. TOAST XABARNOMALARI
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;

    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    const color = type === 'success' ? '#10b981' : '#ef4444';

    toast.innerHTML = `
        <i class="fa-solid ${icon}" style="color: ${color}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => { toast.classList.add('show'); }, 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// 3. QARZ KARTASINI CHIZISH
function renderCard(item) {
    if (!listContainer) return;

    const statusClass = item.holat === "Qaytarildi" ? "status-completed" : "status-pending";
    const amountClass = item.holat === "Qaytarildi" ? "amount-neutral" : "amount-negative";

    const cardHtml = `
        <div class="debt-card" data-id="${item.id}">
            <div class="debt-info">
                <div class="user-avatar-small">${item.ism.charAt(0).toUpperCase()}</div>
                <div class="debt-details">
                    <h3>${item.ism}</h3>
                    <p>${item.sabab} • <span>${item.sana}</span></p>
                </div>
            </div>
            <div class="debt-actions">
                <div class="amount-wrapper">
                    <h2 class="${amountClass}">${Number(item.qancha).toLocaleString()} so'm</h2>
                    <span class="status-badge ${statusClass}" onclick="updateStatus(${item.id}, '${item.holat}')">
                        ${item.holat}
                    </span>
                </div>
                
            </div>
        </div>`;
    listContainer.insertAdjacentHTML('beforeend', cardHtml);
}

// 4. MA'LUMOTLARNI OLISH VA HISOB-KITOB
async function Olish() {
    const { data, error } = await _supabase
        .from('qarzlar')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        showToast("Xatolik: " + error.message, "error");
    } else {
        listContainer.innerHTML = '';
        let totalSent = 0;
        let pending = 0;

        data.forEach(item => {
            renderCard(item);
            if (item.holat !== "Qaytarildi") {
                totalSent += Number(item.qancha);
                pending += Number(item.qancha);
            }
        });

        // Dashboard statlarini yangilash
        document.getElementById('totalSent').innerText = totalSent.toLocaleString() + " so'm";
        document.getElementById('pendingAmount').innerText = pending.toLocaleString();
    }
}

// 5. YANGI QARZ QO'SHISH
async function Jonatish() {
    const inputs = {
        name: document.getElementById('ism'),
        amount: document.getElementById('summa'),
        date: document.getElementById('sana'),
        reason: document.getElementById('sabab'),
        status: document.getElementById('holat')
    };

    if (inputs.name.value && inputs.amount.value && inputs.date.value) {
        const { error } = await _supabase
            .from('qarzlar')
            .insert([{
                ism: inputs.name.value.trim(),
                qancha: inputs.amount.value,
                sabab: inputs.reason.value.trim(),
                sana: inputs.date.value,
                holat: inputs.status.value
            }]);

        if (error) {
            showToast("Xatolik yuz berdi", "error");
        } else {
            showToast("Qarz muvaffaqiyatli saqlandi!");
            closeDebtModal();
            // Inputlarni tozalash
            Object.values(inputs).forEach(input => input.value = '');
            Olish();
        }
    } else {
        showToast("Iltimos, barcha maydonlarni to'ldiring!", "error");
    }
}

// 6. STATUSNI YANGILASH (Qaytarildi qilish)
async function updateStatus(id, currentStatus) {
    if (currentStatus === "Qaytarildi") return;

    if (confirm("Ushbu qarz qaytarildimi?")) {
        const { error } = await _supabase
            .from('qarzlar')
            .update({ holat: 'Qaytarildi' })
            .eq('id', id);

        if (error) {
            showToast("Yangilashda xato", "error");
        } else {
            showToast("Holat yangilandi!");
            Olish();
        }
    }
}

// 7. MODAL VA QIDIRUV BOSHQARUVI
function openDebtModal() {
    document.getElementById('debtModal').classList.add('active');
}

function closeDebtModal() {
    document.getElementById('debtModal').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    listContainer = document.getElementById('debtsListContainer');
    const searchInput = document.querySelector('.input-3');

    Olish();

    // Qidiruv tizimi
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

    // Modalni tashqarisini bosganda yopish
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('debtModal');
        if (e.target == modal) closeDebtModal();
    });
});