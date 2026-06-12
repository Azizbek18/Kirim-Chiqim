const SUPABASE_URL = "https://nwjqvgqydrjkveievogo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WaZvU4qjGkSQu2Vd1qZujw_RcPZfqAh";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const USER_NAME_KEY = "oilaBalanceUserName";
const USER_INITIALS_KEY = "oilaBalanceUserInitials";
const USER_EMAIL_KEY = "oilaBalanceUserEmail";

function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");

    toast.className = `xabar ${type}`;
    toast.innerHTML = `
        <span style="color: #374151; font-weight: 500;">${message}</span>
        <div class="progress-bar-container" style="height: 3px; background: rgba(0,0,0,0.05); margin-top: 10px;">
            <div class="progress-bar" style="height: 100%; width: 100%; background: ${type === "error" ? "#ef4444" : "#10b981"}; transition: width 3s linear;"></div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        const progressBar = toast.querySelector(".progress-bar");
        if (progressBar) progressBar.style.width = "0%";
    }, 10);

    setTimeout(() => {
        toast.style.transform = "translateX(150%)";
        toast.style.opacity = "0";
        toast.style.transition = "all 0.5s ease";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function capitalizeText(value) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function getFallbackNameFromEmail(email = "") {
    const prefix = email.split("@")[0] || "foydalanuvchi";
    return capitalizeText(prefix);
}

function getInitials(name = "", email = "") {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    if (parts.length === 1 && parts[0].length >= 2) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (email.split("@")[0] || "FB").slice(0, 2).toUpperCase();
}

async function resolveAccountName(user) {
    const metadataName = user?.user_metadata?.full_name || user?.user_metadata?.name;
    if (metadataName) {
        return metadataName.trim();
    }

    if (user?.id) {
        const { data } = await _supabase
            .from("xabiblogin")
            .select("ism")
            .eq("id", user.id)
            .maybeSingle();

        if (data?.ism) {
            return data.ism.trim();
        }
    }

    return getFallbackNameFromEmail(user?.email || "");
}

function saveUserToStorage(name, email = "") {
    const displayName = name || getFallbackNameFromEmail(email);
    localStorage.setItem(USER_NAME_KEY, displayName);
    localStorage.setItem(USER_INITIALS_KEY, getInitials(displayName, email));
    localStorage.setItem(USER_EMAIL_KEY, email || "");
}

async function Kirish() {
    const gmail = document.getElementById("gmail").value.trim();
    const parol = document.getElementById("parol").value.trim();

    if (!gmail || !parol) {
        showToast("Iltimos, barcha maydonlarni to'ldiring!", "error");
        return;
    }

    try {
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: gmail,
            password: parol,
        });

        if (error) {
            showToast("Email yoki parol noto'g'ri!", "error");
            console.error("Auth error:", error.message);
            return;
        }

        if (data.user) {
            const displayName = await resolveAccountName(data.user);
            saveUserToStorage(displayName, data.user.email || "");

            showToast("Xush kelibsiz! Asosiy sahifaga o'tilmoqda...", "success");

            setTimeout(() => {
                window.location.href = "bosh sahifa.html";
            }, 1500);
        }
    } catch (err) {
        console.error("Xatolik:", err);
        showToast("Tizimda kutilmagan xatolik!", "error");
    }
}
