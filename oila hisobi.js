// 1. Supabase Sozlamalari
const SUPABASE_URL = "https://nwjqvgqydrjkveievogo.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_WaZvU4qjGkSQu2Vd1qZujw_RcPZfqAh";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Toast xabarnoma funksiyasi
// Toast ko'rsatish funksiyasi
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    
    const color = type === 'error' ? '#ef4444' : '#10b981';

    toast.innerHTML = `
        <span style="color: #1f2937; font-weight: 500;">${message}</span>
        <div class="progress-bar-container">
            <div class="progress-bar" style="background: ${color}; transition: width 2500ms linear;"></div>
        </div>
    `;

    container.appendChild(toast);

    // Progress barni harakatga keltirish
    setTimeout(() => {
        toast.querySelector('.progress-bar').style.width = '0%';
    }, 50);

    // Toastni yo'qotish
    setTimeout(() => {
        toast.style.transform = "translateX(120%)";
        toast.style.opacity = "0";
        toast.style.transition = "all 0.5s ease";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Asosiy funksiya
async function Yaratish() {
    const oila = document.getElementById("oila").value.trim();
    const ism = document.getElementById("ism").value.trim();
    const gmail = document.getElementById("gmail").value.trim();
    const oylik = document.getElementById("oylik").value.trim();
    const parol = document.getElementById("parol").value.trim();

    if (!oila || !ism || !gmail || !parol) {
        showToast("Barcha maydonlarni to'ldiring! ⚠️", "error");
        return;
    }

    try {
        // STEP 1: Supabase AUTH orqali rasman ro'yxatdan o'tkazish
        const { data: authData, error: authError } = await _supabase.auth.signUp({
            email: gmail,
            password: parol,
            options: {
                data: { // Qo'shimcha ma'lumotlarni auth ichida ham saqlash mumkin
                    full_name: ism,
                    family_name: oila
                }
            }
        });

        if (authError) throw authError;

        // STEP 2: Agar auth muvaffaqiyatli bo'lsa, xabiblogin jadvaliga ham yozamiz
        // user_id ustunini ham qo'shib ketish tavsiya etiladi (authData.user.id)
        const { error: insErr } = await _supabase
            .from("xabiblogin")
            .insert([{
                id: authData.user.id, // Auth-dan kelgan unikal ID
                oila_nomi: oila,
                ism: ism,
                email: gmail,
                oylik_tolov: oylik,
                parol: parol // Xavfsizlik uchun parolni jadvalda saqlash tavsiya etilmaydi, lekin sizda shunday ekan
            }]);

        if (insErr) throw insErr;

        showToast("Hisob yaratildi! ✅");

        setTimeout(() => {
            window.location.href = "index.html"; // Login sahifangizga
        }, 2000);

    } catch (err) {
        showToast(err.message || "Xatolik yuz berdi ❌", "error");
        console.error(err);
    }
}
