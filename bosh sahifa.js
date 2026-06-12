const SUPABASE_URL = "https://nwjqvgqydrjkveievogo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WaZvU4qjGkSQu2Vd1qZujw_RcPZfqAh";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const USER_NAME_KEY = "oilaBalanceUserName";
const USER_INITIALS_KEY = "oilaBalanceUserInitials";
const USER_EMAIL_KEY = "oilaBalanceUserEmail";

let mainChart = null;

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

async function syncStoredUserProfile(user) {
    const storedName = localStorage.getItem(USER_NAME_KEY);
    let displayName = storedName || user?.user_metadata?.full_name || user?.user_metadata?.name || "";

    if (!displayName && user?.id) {
        const { data } = await supabaseClient
            .from("xabiblogin")
            .select("ism")
            .eq("id", user.id)
            .maybeSingle();

        if (data?.ism) {
            displayName = data.ism.trim();
        }
    }

    if (!displayName) {
        displayName = getFallbackNameFromEmail(user?.email || "");
    }

    const initials = localStorage.getItem(USER_INITIALS_KEY) || getInitials(displayName, user?.email || "");

    localStorage.setItem(USER_NAME_KEY, displayName);
    localStorage.setItem(USER_INITIALS_KEY, initials);
    localStorage.setItem(USER_EMAIL_KEY, user?.email || "");

    const nameSpan = document.getElementById("user-display-name");
    if (nameSpan) {
        nameSpan.textContent = displayName;
    }

    const avatar = document.getElementById("avatar");
    if (avatar) {
        avatar.textContent = initials;
    }
}

// Greeting Text Function
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Xush kelibsiz! 🌅 Yangi kun boshlandi";
    if (hour < 18) return "Xush kelibsiz! 🌤️ Yaxshi kunimiz bor";
    return "Xush kelibsiz! 🌙 Kechasi shunga yugur qiling";
}

// Update Active Navigation Link
function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'bosh sahifa.html';
    const navLinks = document.querySelectorAll('.app-nav a.nav-link, .app-sidebar-footer a.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    let currentDate = new Date();
    const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];

    // Update active navigation
    updateActiveNavigation();

    // --- 1. FOYDALANUVCHINI TEKSHIRISH ---
    async function checkUser() {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        if (error || !user) {
            window.location.href = "index.html";
            return null;
        }
        await syncStoredUserProfile(user);
        return user;
    }

    // --- 2. GREETING SAATLARI ---
    const greetingEl = document.getElementById("greetingText");
    if (greetingEl) {
        greetingEl.textContent = getGreeting();
    }

    // --- 3. MA'LUMOTLARNI OLISH ---
    async function fetchTransactions() {
        const user = await checkUser();
        if (!user) return;

        // Joriy oy oralig'i
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

        const { data: transactions, error } = await supabaseClient
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .gte('created_at', firstDay)
            .lte('created_at', lastDay)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Xatolik:", error.message);
            return;
        }

        renderRecentTransactions(transactions);
        updateStats(transactions);
        updateChart(transactions);
    }

    // --- 4. OXIRGI OPERATSIYALAR ---
    function renderRecentTransactions(data) {
        const container = document.getElementById("recentTransactions");
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-inbox"></i>
                    <span>Hali operatsiyalar yo'q</span>
                </div>
            `;
            return;
        }

        // Faqat oxirgi 5 ta operatsiya
        const recent = data.slice(0, 5);

        container.innerHTML = recent.map((t, index) => {
            const isIncome = t.amount > 0;
            const date = new Date(t.created_at);
            const dateStr = date.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' });

            return `
                <div class="transaction-item" style="animation-delay: ${index * 0.1}s;">
                    <div class="transaction-left">
                        <div class="transaction-icon" style="background: ${isIncome ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'};">
                            <i class="fa-solid ${isIncome ? 'fa-arrow-down' : 'fa-arrow-up'}" style="color: ${isIncome ? '#10b981' : '#ef4444'};"></i>
                        </div>
                        <div class="transaction-details">
                            <h4>${t.name}</h4>
                            <p>${dateStr}</p>
                        </div>
                    </div>
                    <div class="transaction-amount" style="color: ${isIncome ? '#10b981' : '#ef4444'}">
                        ${isIncome ? '+' : ''}${t.amount.toLocaleString()}
                    </div>
                </div>
            `;
        }).join('');
    }

    // --- 5. STATISTIKANI YANGILASH ---
    function updateStats(data) {
        const income = data.filter(t => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
        const expense = data.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(Number(t.amount)), 0);
        const balance = income - expense;

        const incomeEl = document.getElementById("totalIncome");
        const expenseEl = document.getElementById("totalExpense");
        const balanceEl = document.getElementById("totalBalance");

        // Animated counter effect
        if (incomeEl) {
            animateValue(incomeEl, 0, income, 800);
        }
        if (expenseEl) {
            animateValue(expenseEl, 0, expense, 800);
        }
        if (balanceEl) {
            animateValue(balanceEl, 0, balance, 800);
        }
    }

    // Animated Counter Function
    function animateValue(el, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            el.textContent = Math.round(current).toLocaleString() + " so'm";
        }, 16);
    }

    // --- 6. GRAFIKNI CHIZISH ---
    function updateChart(data) {
        const ctx = document.getElementById("mainChart");
        if (!ctx) return;

        const income = data.filter(t => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
        const expense = data.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(Number(t.amount)), 0);

        if (mainChart) {
            mainChart.destroy();
        }

        const chartData = {
            kirim: income || 0,
            chiqim: expense || 0
        };

        mainChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Kirim', 'Chiqim'],
                datasets: [{
                    data: [chartData.kirim || 1, chartData.chiqim || 1],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                        '#10b981',
                        '#ef4444'
                    ],
                    borderWidth: 3,
                    borderRadius: 8,
                    hoverBorderWidth: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 13, weight: 600 },
                            padding: 20,
                            color: '#64748b',
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 600 },
                        bodyFont: { size: 13 },
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.parsed.toLocaleString() + ' so\'m';
                            }
                        }
                    }
                }
            }
        });
    }

    // Add some interactivity to stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Sahifani yuklash
    fetchTransactions();

    // Auto-refresh every 30 seconds
    setInterval(fetchTransactions, 30000);

    // Dark mode toggle initialization
    initDarkMode();
});

// =====================================
// SETTINGS MODAL FUNCTIONS
// =====================================

function openSettingsModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeSettingsModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeSettingsModal(e);
    }
});

// Dark Mode Functions
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        // Check saved preference
        const isDark = localStorage.getItem('darkMode') === 'true';
        toggle.checked = isDark;
        if (isDark) {
            document.body.classList.add('dark-mode');
        }
    }
}

function toggleDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        const isDark = toggle.checked;
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', isDark);

        // Apply to all pages
        applyDarkModeToAllPages(isDark);
    }
}

function applyDarkModeToAllPages(isDark) {
    // Save to localStorage for other pages
    localStorage.setItem('darkMode', isDark);
}

// Logout Function
async function logout() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error('Chiqish xatosi:', error.message);
            return;
        }
        // Redirect to login
        window.location.href = 'index.html';
    } catch (err) {
        console.error('Xatolik:', err);
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
