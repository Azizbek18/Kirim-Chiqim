const xabarCon = document.querySelector(".xabar-con");

// Xabarnoma chiqarish funksiyasi
function xabarnoma(xabar, turi) {
    let xabarMatn = document.createElement('div');
    xabarMatn.classList.add("xabar", turi);
    xabarMatn.innerText = xabar;

    xabarCon.appendChild(xabarMatn);

    // 4 soniyadan keyin o'chirib tashlash
    setTimeout(() => {
        xabarMatn.remove();
    }, 4000);
}

let supaBaseUrl = 'https://mwndanxkvpgeaicrjeia.supabase.co';
let supaBaseKey = 'sb_publishable_deLmezxuUNJ7NZHLJJAAuA_YGluXUAo';

const _supabase = supabase.createClient(supaBaseUrl, supaBaseKey);

async function Yubor() {
    let email = document.getElementById('email');
    let parol = document.getElementById('parol');
  
    // Maydonlar bo'shligini tekshirish
    if(email.value === "" || parol.value === ""){
        xabarnoma("Maydonlarni to'ldiring", "error"); // turi: error yoki warning
        return;
    }

    const { data: foydalanuvchi, error: xatolik } = await _supabase
        .from('login')
        .select('*')
        .eq('email', email.value)
        .eq('parol', parol.value);

    // Bazada xatolik bo'lsa
    if(xatolik){
        xabarnoma("Xatolik yuz berdi: " + xatolik.message, "error");
        return;
    }

    // Foydalanuvchi topilsa
    if(foydalanuvchi && foydalanuvchi.length > 0){
        xabarnoma("Siz tizimga muvaffaqiyatli kirdingiz!!!", "success");
        
        // Xabar ko'rinishi uchun biroz kutib keyin o'tish (ixtiyoriy)
        setTimeout(() => {
            window.location.href = "qarzlar.html";
        }, 1500);
    } 
    else {
        xabarnoma("Siz ro'yxatdan o'tmagansiz yoki ma'lumotlar xato", "error");
        
        setTimeout(() => {
            window.location.href = "oila Hisobi.html";
        }, 2000);
    }
}