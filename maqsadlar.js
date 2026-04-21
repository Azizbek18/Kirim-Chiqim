// 1. SUPABASE SOZLAMALARI
const SUPABASE_URL = "https://nwjqvgqydrjkveievogo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WaZvU4qjGkSQu2Vd1qZujw_RcPZfqAh";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global o'zgaruvchi - qaysi maqsad ustida ishlayotganimizni bilish uchun
let currentGoalId = null;

// 2. TOAST XABARNOMALARI (ERKIN VA TEPADA)
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `custom-toast ${type}`;

  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
  const color = type === 'success' ? '#10b981' : '#ef4444';

  toast.innerHTML = `
        <i class="fa-solid ${icon}" style="color: ${color}"></i>
        <span>${message}</span>
    `;

  container.appendChild(toast);

  // Animatsiyani ishga tushirish
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // 3 soniyadan keyin o'chirish
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// 3. MAQSADLARNI YUKLASH (SUPABASEDAN)
async function loadGoals() {
  try {
    const { data: { user } } = await _supabase.auth.getUser();
    if (!user) {
      showToast("Tizimga kirmagansiz!", "error");
      return;
    }

    const { data: goals, error } = await _supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    renderGoals(goals);
  } catch (err) {
    console.error("Yuklashda xato:", err.message);
    showToast("Ma'lumotlarni yuklab bo'lmadi", "error");
  }
}

// 4. MAQSADLARNI EKRANGA CHIZISH
function renderGoals(goals) {
  const container = document.getElementById("goalsList");
  if (!container) return;

  container.innerHTML = "";

  if (goals.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 40px;">Hali maqsadlar qo'shilmagan.</p>`;
    return;
  }

  goals.forEach(goal => {
    const percent = Math.min((goal.current_amount / goal.total_price) * 100, 100);

    const card = document.createElement("div");
    card.className = "glass-card";
    card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                <div>
                    <span class="card-tag" style="color: ${percent >= 100 ? 'var(--success)' : 'var(--primary)'}">
                        ${percent >= 100 ? 'Tugallangan' : 'Jarayonda'}
                    </span>
                    <h3 style="margin-top: 5px; font-size: 18px; font-weight: 800;">${goal.name}</h3>
                </div>
                <div class="icon-circle" style="background: ${percent >= 100 ? 'rgba(16, 185, 129, 0.1)' : 'var(--primary-light)'}">
                    <i class="fa-solid ${percent >= 100 ? 'fa-check-double' : 'fa-bullseye'}" 
                       style="color: ${percent >= 100 ? 'var(--success)' : 'var(--primary)'}"></i>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
                    <span style="color: var(--text-muted); font-weight: 600;">To'plangan</span>
                    <span style="font-weight: 800;">${Math.round(percent)}%</span>
                </div>
                <div class="p-bar-bg">
                    <div class="p-bar-fill" style="width: ${percent}%; background: ${percent >= 100 ? 'var(--success)' : 'var(--primary)'}"></div>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <div>
                    <small style="color: var(--text-muted); display: block; font-size: 11px; font-weight: 700; text-transform: uppercase;">Yig'ildi</small>
                    <span style="font-weight: 800; font-size: 15px;">${goal.current_amount.toLocaleString()} UZS</span>
                </div>
                <div style="text-align: right;">
                    <small style="color: var(--text-muted); display: block; font-size: 11px; font-weight: 700; text-transform: uppercase;">Maqsad</small>
                    <span style="font-weight: 800; font-size: 15px; color: var(--text-muted);">${goal.total_price.toLocaleString()}</span>
                </div>
            </div>

            <button class="btn-primary" style="width: 100%; justify-content: center; height: 50px;" onclick="openMoneyModal(${goal.id})">
                <i class="fa-solid fa-plus"></i> Pul qo'shish
            </button>
        `;
    container.appendChild(card);
  });
}

// 5. YANGI MAQSAD YARATISH
async function createGoal() {
  const nameInput = document.getElementById("goalName");
  const priceInput = document.getElementById("goalPrice");

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);

  if (!name || !price || price <= 0) {
    showToast("Ma'lumotlarni to'g'ri kiriting", "error");
    return;
  }

  try {
    const { data: { user } } = await _supabase.auth.getUser();
    const { error } = await _supabase.from('goals').insert([{
      name: name,
      total_price: price,
      current_amount: 0,
      user_id: user.id
    }]);

    if (error) throw error;

    showToast("Yangi maqsad muvaffaqiyatli qo'shildi!");
    nameInput.value = "";
    priceInput.value = "";
    closeGoalModal();
    loadGoals();
  } catch (err) {
    showToast("Xatolik yuz berdi", "error");
  }
}

// 6. PUL QO'SHISH FUNKSIYASI (ASOSIY MANTIQ)
async function addMoney() {
  const input = document.getElementById("moneyInput");
  const amount = parseFloat(input.value);

  if (!amount || amount <= 0) {
    showToast("To'g'ri summa kiriting", "error");
    return;
  }

  if (!currentGoalId) {
    showToast("Maqsad tanlanmagan!", "error");
    return;
  }

  try {
    // 1. Joriy summani olish
    const { data: goal, error: fetchError } = await _supabase
      .from('goals')
      .select('current_amount')
      .eq('id', currentGoalId)
      .single();

    if (fetchError) throw fetchError;

    const newTotal = (goal.current_amount || 0) + amount;

    // 2. Yangilash
    const { error: updateError } = await _supabase
      .from('goals')
      .update({ current_amount: newTotal })
      .eq('id', currentGoalId);

    if (updateError) throw updateError;

    showToast(`${amount.toLocaleString()} UZS qo'shildi!`);
    input.value = "";
    closeModal();
    loadGoals();
  } catch (err) {
    showToast("Xatolik: " + err.message, "error");
  }
}

// 7. MODAL BOSHQARUVI
function openGoalModal() {
  const modal = document.getElementById('goalModal');
  if (modal) modal.classList.add('active');
}

function closeGoalModal() {
  const modal = document.getElementById('goalModal');
  if (modal) modal.classList.remove('active');
}

function openMoneyModal(id) {
  currentGoalId = id;
  const modal = document.getElementById('moneyModal');
  if (modal) {
    modal.classList.add('active');
    // Fokusni inputga qaratish
    setTimeout(() => document.getElementById('moneyInput').focus(), 100);
  }
}

function closeModal() {
  const modal = document.getElementById('moneyModal');
  if (modal) modal.classList.remove('active');
  currentGoalId = null;
}

// SAHIFA YUKLANGANDA
document.addEventListener("DOMContentLoaded", loadGoals);