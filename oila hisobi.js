const SUPABASE_URL = "https://mwndanxkvpgeaicrjeia.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_deLmezxuUNJ7NZHLJJAAuA_YGluXUAo";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("registerForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const family_name = document.getElementById("family_name").value;
  const user_name = document.getElementById("user_name").value;
  const email = document.getElementById("email").value;
  const income = document.getElementById("income").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase

  if (error) {
    msg.innerText = "Xatolik: " + error.message;
    return;
  }


  const { error: dbError } = await supabase
    .from("login")
    .insert([
      {
         ism : user_name,
         familya : family_name,
         oila_nomi : 
      }
    ]);

  if (dbError) {
    msg.innerText = "DB xatolik: " + dbError.message;
    return;
  }

  msg.innerText = "✅ Hisob muvaffaqiyatli yaratildi!";
});