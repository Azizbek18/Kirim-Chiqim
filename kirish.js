let supaBaseUrl = 'https://mwndanxkvpgeaicrjeia.supabase.co'
let supaBaseKey = 'sb_publishable_deLmezxuUNJ7NZHLJJAAuA_YGluXUAo'

const _supabase = supabase.createClient(supaBaseUrl, supaBaseKey)

async function Yubor    () {
    let email = document.getElementById('email')
    let parol = document.getElementById('parol')
  
    if(email.value == "" && parol.value == ""){
        alert("Maydonlarni to'ldiring")
        return
    }

    const {data:foydalanuvchi, error:xatolik} = await _supabase
    .from('login')
    .select('*')
    .eq('email',email.value)
    .eq('parol', parol.value)
    if(xatolik){
        alert("Xatolik yuz berdi" + error.message)
        return
    }
    if(foydalanuvchi.length > 0){
        alert("Siz tizimga muvaffaqiyatli kirdingiz!!!")
        window.location.href = "qarzlar.html"
    }
    else{
        alert("Siz ro'yxatdan o'tmagansiz")
        window.location.href = "oila Hisobi.html"
    }
}
