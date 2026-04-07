const SUPABASE_URL = "https://mwndanxkvpgeaicrjeia.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_deLmezxuUNJ7NZHLJJAAuA_YGluXUAo";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("registerForm");
const msg = document.getElementById("msg");

let btn = document.querySelector('.btn')

btn.addEventListener("click", async (e) => {
  e.preventDefault();

  const oila = document.getElementById("oila").value;
  const ism = document.getElementById("ism").value;
  const email = document.getElementById("email").value;
  const parol = document.getElementById("parol").value;
  const tasdiqlang = document.getElementById("tasdiqlang").value;

  const { data, error } = await _supabase

if (parol !== tasdiqlang) {
  alert("Parollar mos emas");
  return;
}


  const { error: dbError } = await _supabase
    .from("login")
    .insert([
      {
         ism : ism,
         familya : email,
         oila_nomi : oila
      }
    ]);

  if (dbError) {
    alert("DB xatolik: " + dbError.message);
    return;
  }

  alert( "✅ Hisob muvaffaqiyatli yaratildi!");
});