const SUPABASE_URL = "https://nwjqvgqydrjkveievogo.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_WaZvU4qjGkSQu2Vd1qZujw_RcPZfqAh";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


document.addEventListener("DOMContentLoaded", async () => {
    let currentDate = new Date();
    const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];

    // --- SELEKTORLAR ---
    const monthTitle = document.querySelector(".calendar-nav h2");
    const list = document.getElementById("transactionList");
    const leftBtn = document.querySelectorAll(".icon-circle")[0];
    const rightBtn = document.querySelectorAll(".icon-circle")[1];
    
    // Modal va Inputlar
    const modal = document.getElementById("modal");
    const openFab = document.querySelector(".app-fab");
    const saveBtn = document.querySelector(".save");
    const cancelBtns = document.querySelectorAll(".cancel"); // Ikkala bekor qilish tugmasi uchun
    const nameInput = document.getElementById("t-nomi");
    const amountInput = document.getElementById("t-summa");

    // --- 1. FOYDALANUVCHINI TEKSHIRISH ---
    async function checkUser() {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        if (error || !user) {
            window.location.href = "index.html"; // Kirilmagan bo'lsa login sahifasiga
            return null;
        }
        return user;
    }

    // --- 2. MA'LUMOTLARNI OLISH (FETCH) ---
    async function fetchTransactions() {
        const user = await checkUser();
        if (!user) return;

        // Tanlangan oy oralig'ini hisoblash
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

        const { data: transactions, error } = await supabaseClient
            .from('transactions')
            .select('*')
            .eq('user_id', user.id) // Faqat shu userga tegishli ma'lumotlar
            .gte('created_at', firstDay)
            .lte('created_at', lastDay)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Xatolik:", error.message);
            return;
        }

        renderTransactions(transactions);
        updateStats(transactions);
    }

    // --- 3. EKRANGA CHIQARISH (RENDER) ---
    function renderTransactions(data) {
        if (!list) return;
        list.innerHTML = "";

        if (data.length === 0) {
            list.innerHTML = `<p style="text-align:center; padding:40px; color:#9ca3af; font-size:14px; grid-column: 1/-1;">Hozircha hech qanday harakat topilmadi.</p>`;
            return;
        }

        data.forEach((t) => {
            const isIncome = t.amount > 0;
            const div = document.createElement("div");
            div.className = "data-item";
            // Dizaynni inline-style orqali yanada kuchaytiramiz
            div.style = "display: flex; align-items: center; justify-content: space-between; padding: 16px; background: rgba(255,255,255,0.3); border-radius: 20px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.4);";

            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 14px;">
                    <div style="background: ${isIncome ? '#e6fcf5' : '#fff5f5'}; width: 42px; height: 42px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid ${isIncome ? 'fa-arrow-up' : 'fa-arrow-down'}" style="color: ${isIncome ? '#10b981' : '#ef4444'}"></i>
                    </div>
                    <div>
                        <p style="font-weight: 700; color: #1f2937; margin: 0; font-size: 15px;">${t.name}</p>
                        <small style="color: #6b7280; font-size: 11px;">${new Date(t.created_at).toLocaleDateString('uz-UZ')}</small>
                    </div>
                </div>
                <div style="font-weight: 800; font-size: 15px; color: ${isIncome ? '#10b981' : '#ef4444'}">
                    ${isIncome ? '+' : ''}${t.amount.toLocaleString()} UZS
                </div>
            `;
            list.appendChild(div);
        });
    }

    // --- 4. STATISTIKANI HISOBLASH ---
    function updateStats(data) {
        const income = data.filter(t => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
        const expense = data.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(Number(t.amount)), 0);
        const balance = income - expense;

        const cards = document.querySelectorAll(".card-value");
        if (cards.length >= 3) {
            cards[0].innerHTML = `${balance.toLocaleString()} <span>UZS</span>`;
            cards[1].textContent = income.toLocaleString();
            cards[2].textContent = expense.toLocaleString();
            // Agar Tejalgan (Savings) kartasi bo'lsa:
            if(cards[3]) cards[3].textContent = (balance > 0 ? balance : 0).toLocaleString();
        }
    }

    // --- 5. MODALNI BOSHQARISH (NULL-CHECK BILAN) ---
    if (openFab && modal) {
        openFab.onclick = () => modal.classList.add("active");
    }

    if (cancelBtns.length > 0 && modal) {
        cancelBtns.forEach(btn => {
            btn.onclick = () => modal.classList.remove("active");
        });
    }

    // --- 6. MA'LUMOT SAQLASH ---
    if (saveBtn) {
        saveBtn.onclick = async () => {
            const user = await checkUser();
            if (!user) return;

            const name = nameInput?.value.trim();
            const amount = parseFloat(amountInput?.value);

            if (!name || isNaN(amount)) {
                alert("Iltimos, barcha maydonlarni to'g'ri to'ldiring!");
                return;
            }

            const { error } = await supabaseClient
                .from('transactions')
                .insert([{ name, amount, user_id: user.id }]);

            if (error) {
                alert("Xatolik: " + error.message);
            } else {
                if (nameInput) nameInput.value = "";
                if (amountInput) amountInput.value = "";
                modal?.classList.remove("active");
                fetchTransactions(); // Ro'yxatni yangilash
            }
        };
    }

    // --- 7. OY NAVIGATSIYASI ---
    function updateMonthUI() {
        if (monthTitle) {
            monthTitle.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        }
    }

    if (leftBtn) {
        leftBtn.onclick = () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateMonthUI();
            fetchTransactions();
        };
    }

    if (rightBtn) {
        rightBtn.onclick = () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateMonthUI();
            fetchTransactions();
        };
    }

    // --- ILK BOR ISHGA TUSHIRISH ---
    updateMonthUI();
    fetchTransactions();
});