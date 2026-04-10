document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.querySelector('.chiqim-kirim');
    const modal = document.getElementById('debtModal');
    const addBtn = document.querySelector('.foter .btn');
    const closeBtn = document.querySelector('.close-btn');
    const saveBtn = document.getElementById('saveDebtBtn');

    addBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    saveBtn.addEventListener('click', () => {
        const name = document.getElementById('debtName').value;
        const amount = document.getElementById('debtAmount').value;
        const reason = document.getElementById('debtReason').value;

        if (name && amount && reason) {
            const hr = document.createElement('hr');
            const newCard = document.createElement('div');
            newCard.className = 'card2';
            newCard.innerHTML = `
                <div class="img-card">
                    <img src="./M_rasmlar/Background.svg" alt="">
                    <div class="text2">
                        <h1>${name}</h1>
                        <p>${reason}</p>
                    </div>
                </div>
                <div class="oxiri">
                    <h1 class="boshqa1">-${amount} so'm</h1>
                    <p class="boshqa2">Kutilmoqda</p>
                </div>
            `;

            listContainer.appendChild(hr);
            listContainer.appendChild(newCard);

            document.getElementById('debtName').value = '';
            document.getElementById('debtAmount').value = '';
            document.getElementById('debtReason').value = '';
            modal.style.display = 'none';
        } else {
            alert("Iltimos, barcha maydonlarni to'ldiring!");
        }
    });

    listContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('boshqa2')) {
            if (confirm("Ushbu qarz qaytarildimi?")) {
                const target = e.target;
                target.innerText = "Qaytarildi";
                target.style.background = "green";
                target.style.color = "white";
                target.style.padding = "4px 12px";
                target.style.borderRadius = "12px";
                target.classList.replace('boshqa2', 'boshqa6');
                if (target.previousElementSibling) {
                    target.previousElementSibling.style.color = "gray";
                }
            }
        }
    });

    const searchInput = document.querySelector('.input-3');
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.card2');
        cards.forEach(card => {
            const name = card.querySelector('.text2 h1').innerText.toLowerCase();
            if (name.includes(value)) {
                card.style.display = 'flex';
                if (card.nextElementSibling?.tagName === 'HR') card.nextElementSibling.style.display = 'block';
            } else {
                card.style.display = 'none';
                if (card.nextElementSibling?.tagName === 'HR') card.nextElementSibling.style.display = 'none';
            }
        });
    });
});