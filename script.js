// SUPABASE SOZLAMALARI
const SUPABASE_URL = "https://nwjqvgqydrjkveievogo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WaZvU4qjGkSQu2Vd1qZujw_RcPZfqAh";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const USER_NAME_KEY = "oilaBalanceUserName";
const USER_INITIALS_KEY = "oilaBalanceUserInitials";
const USER_EMAIL_KEY = "oilaBalanceUserEmail";

let lineChart = null;
let pieChart = null;

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

// Update Active Navigation Link
function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'Hisobot dashboad.html';
    const navLinks = document.querySelectorAll('.app-nav a.nav-link, .app-sidebar-footer a.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// Greeting Text Function
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Xush kelibsiz! 🌅 Yangi kun boshlandi";
    if (hour < 18) return "Xush kelibsiz! 🌤️ Yaxshi kunimiz bor";
    return "Xush kelibsiz! 🌙 Kechasi shunga yugur qiling";
}

// Foydalanuvchini tekshirish
async function checkUser() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error || !user) {
        window.location.href = "index.html";
        return null;
    }
    return user;
}

// Ma'lumotlarni yuklash
async function loadData() {
    const user = await checkUser();
    if (!user) return;

    await syncStoredUserProfile(user);

    // Joriy yil ma'lumotlarini olish
    const currentYear = new Date().getFullYear();
    const firstDay = new Date(currentYear, 0, 1).toISOString();
    const lastDay = new Date(currentYear, 11, 31, 23, 59, 59).toISOString();

    const { data: transactions, error } = await supabaseClient
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', firstDay)
        .lte('created_at', lastDay)
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Xatolik:", error.message);
        return;
    }

    updateStats(transactions);
    updateLineChart(transactions);
    updatePieChart(transactions);
}

// Statistikani yangilash
function updateStats(data) {
    const income = data.filter(t => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
    const expense = data.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(Number(t.amount)), 0);
    const savings = income - expense;

    const incomeEl = document.getElementById("totalIncome");
    const expenseEl = document.getElementById("totalExpense");
    const savingsEl = document.getElementById("totalSavings");

    if (incomeEl) incomeEl.textContent = income.toLocaleString() + " so'm";
    if (expenseEl) expenseEl.textContent = expense.toLocaleString() + " so'm";
    if (savingsEl) savingsEl.textContent = savings.toLocaleString() + " so'm";
}

// Line Chart (6 oylik dinamika)
function updateLineChart(data) {
    const lineCtx = document.getElementById('lineChart');
    if (!lineCtx) return;

    const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
    const monthlyData = Array(12).fill(0).map(() => ({ income: 0, expense: 0 }));

    data.forEach(t => {
        const date = new Date(t.created_at);
        const monthIndex = date.getMonth();
        if (t.amount > 0) {
            monthlyData[monthIndex].income += Number(t.amount);
        } else {
            monthlyData[monthIndex].expense += Math.abs(Number(t.amount));
        }
    });

    if (lineChart) lineChart.destroy();

    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Kirim',
                data: monthlyData.map(m => m.income),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }, {
                label: 'Chiqim',
                data: monthlyData.map(m => m.expense),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
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
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: {
                        callback: value => value.toLocaleString()
                    }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// Pie Chart (Kategoriya taqsimoti)
function updatePieChart(data) {
    const pieCtx = document.getElementById('pieChart');
    if (!pieCtx) return;

    const expenseData = data.filter(t => t.amount < 0);
    const categoryMap = {};

    expenseData.forEach(t => {
        const category = t.name || 'Boshqa';
        categoryMap[category] = (categoryMap[category] || 0) + Math.abs(Number(t.amount));
    });

    const labels = Object.keys(categoryMap);
    const values = Object.values(categoryMap);
    const colors = [
        '#667eea', '#f59e0b', '#10b981', '#ef4444',
        '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'
    ];

    if (pieChart) pieChart.destroy();

    pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: labels.length ? labels : ['Ma\'lumot yo\'q'],
            datasets: [{
                data: values.length ? values : [1],
                backgroundColor: labels.length ? colors.slice(0, labels.length) : ['#e5e7eb'],
                borderWidth: 0,
                borderRadius: 8
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
                        padding: 15,
                        color: '#64748b',
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: context => context.label + ': ' + context.parsed.toLocaleString() + " so'm"
                    }
                }
            }
        }
    });
}

// PDF yuklash
function downloadPDF() {
    window.print();
}

// Sahifa yuklanganda
document.addEventListener("DOMContentLoaded", () => {
    updateActiveNavigation();
    loadData();
});
