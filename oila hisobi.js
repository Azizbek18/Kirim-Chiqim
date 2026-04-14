const SUPABASE_URL = "https://mwndanxkvpgeaicrjeia.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_deLmezxuUNJ7NZHLJJAAuA_YGluXUAo";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);



async function Yaratish() {

  const oila = document.getElementById("oila").value;
  const ism = document.getElementById("ism").value;
  const gmail = document.getElementById("gmail").value;
  const oylik = document.getElementById("oylik").value;
  const parol = document.getElementById("parol").value;

  const { data: foydalanuvchi, error: xatolik } = await _supabase
    .from('login')
    .select("*")
  if (xatolik) {
    alert("Xatolik: " + error.message)
    return;
  }
  if (foydalanuvchi.length > 0) {
    alert("Siz oldin ro'yhatdan o'tgan ekansiz kirish qismiga o'tishiz mumkin")
  }
  else {
    const { data, error } = await _supabase
      .from("login")
      .insert([
        {
          oila_nomi: oila,
          ism: ism,
          email: gmail,
          oylik_tolov: oylik,
          parol: parol
        }
      ]);
    if (error) {
      alert('Xatolik yuz berdi')
      return;
    }
    else {
      alert(innerText = "✅ Hisob muvaffaqiyatli yaratildi!")
    }
  }
};
