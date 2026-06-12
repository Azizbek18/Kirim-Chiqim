(function () {
    const USER_NAME_KEY = 'oilaBalanceUserName';
    const USER_INITIALS_KEY = 'oilaBalanceUserInitials';
    const USER_EMAIL_KEY = 'oilaBalanceUserEmail';

    function getModal() {
        return document.getElementById('settingsModal');
    }

    function getToggle() {
        return document.getElementById('darkModeToggle');
    }

    function getSupabaseClient() {
        if (window.supabaseClient && window.supabaseClient.auth) return window.supabaseClient;
        if (window._supabase && window._supabase.auth) return window._supabase;
        return null;
    }

    function applyDarkMode(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', String(isDark));

        const toggle = getToggle();
        if (toggle) toggle.checked = isDark;
    }

    function initDarkMode() {
        applyDarkMode(localStorage.getItem('darkMode') === 'true');
    }

    window.openSettingsModal = function (event) {
        if (event) event.preventDefault();
        const modal = getModal();
        if (modal) modal.classList.add('active');
    };

    window.closeSettingsModal = function (event) {
        if (event && event.target !== event.currentTarget) return;
        const modal = getModal();
        if (modal) modal.classList.remove('active');
    };

    window.toggleDarkMode = function () {
        const toggle = getToggle();
        applyDarkMode(Boolean(toggle && toggle.checked));
    };

    window.logout = async function () {
        const client = getSupabaseClient();

        if (client) {
            try {
                await client.auth.signOut();
            } catch (error) {
                console.error('Sign out error:', error);
            }
        }

        localStorage.removeItem(USER_NAME_KEY);
        localStorage.removeItem(USER_INITIALS_KEY);
        localStorage.removeItem(USER_EMAIL_KEY);

        window.location.href = 'index.html';
    };

    document.addEventListener('DOMContentLoaded', initDarkMode);
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            window.closeSettingsModal();
        }
    });
})();
