const xabarCon = document.querySelector(".xabar-con");

function xabarnoma(xabar, turi) {
    let xabarMatn = document.createElement('div');
    xabarMatn.classList.add("xabar", turi);
    xabarMatn.innerText = xabar;

    xabarCon.appendChild(xabarMatn);

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
  
    if(email.value === "" || parol.value === ""){
        xabarnoma("Maydonlarni to'ldiring", "error"); 
        return;
    }

    const { data: foydalanuvchi, error: xatolik } = await _supabase
        .from('login')
        .select('*')
        .eq('email', email.value)
        .eq('parol', parol.value);

    if(xatolik){
        xabarnoma("Xatolik yuz berdi: " + xatolik.message, "error");
        return;
    }

    if(foydalanuvchi && foydalanuvchi.length > 0){
        xabarnoma("Siz tizimga muvaffaqiyatli kirdingiz!!!", "success");
        
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