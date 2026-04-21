// 1. Supabase Sozlamalari
const SUPABASE_URL = "https://nwjqvgqydrjkveievogo.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_WaZvU4qjGkSQu2Vd1qZujw_RcPZfqAh";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Toast Xabarnoma Funksiyasi
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    // Type orqali klass qo'shamiz (success yoki error)
    toast.className = `xabar ${type}`;
    
    toast.innerHTML = `
        <span style="color: #374151; font-weight: 500;">${message}</span>
        <div class="progress-bar-container" style="height: 3px; background: rgba(0,0,0,0.05); margin-top: 10px;">
            <div class="progress-bar" style="height: 100%; width: 100%; background: ${type === 'error' ? '#ef4444' : '#10b981'}; transition: width 3s linear;"></div>
        </div>
    `;

    container.appendChild(toast);

    // Progress barni boshlash
    setTimeout(() => {
        const pb = toast.querySelector('.progress-bar');
        if (pb) pb.style.width = '0%';
    }, 10);

    // Toastni o'chirish
    setTimeout(() => {
        toast.style.transform = "translateX(150%)";
        toast.style.opacity = "0";
        toast.style.transition = "all 0.5s ease";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// 3. Tizimga Kirish Logikasi
// 3. Tizimga Kirish Logikasi (TO'G'RILANGAN)
async function Kirish() {
    const gmail = document.getElementById("gmail").value.trim();
    const parol = document.getElementById("parol").value.trim();

    if (!gmail || !parol) {
        showToast("Iltimos, barcha maydonlarni to'ldiring! ⚠️", "error");
        return;
    }

    try {
        // MUHIM: Supabase-ning rasmiy Auth tizimi orqali kirish
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: gmail,
            password: parol,
        });

        if (error) {
            // Agar Supabase Auth-da xato bo'lsa (parol noto'g'ri yoki user yo'q)
            showToast("Email yoki parol noto'g'ri! ❌", "error");
            console.error("Auth error:", error.message);
            return;
        }

        // Agar hamma narsa to'g'ri bo'lsa, data.user mavjud bo'ladi
        if (data.user) {
            showToast("Xush kelibsiz! Asosiy sahifaga o'tilmoqda... ✅", "success");
            
            // Sessiya brauzerga saqlanishi uchun biroz vaqt beramiz
            setTimeout(() => {
                window.location.href = "bosh sahifa.html";
            }, 1500);
        }

    } catch (err) {
        console.error("Xatolik:", err);
        showToast("Tizimda kutilmagan xatolik! ❌", "error");
    }
}

