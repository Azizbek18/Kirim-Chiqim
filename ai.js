const chat = document.getElementById("chat");

function add(text, type){
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerHTML = `<div class="bubble">${text}</div>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function random(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function ai(msg){
  msg = msg.toLowerCase();

  if(msg.includes("transport")){
    return random([
      "Oxirgi haftalarda transportga ko‘p sarflagansiz. Jamoat transportiga o‘ting.",
      "Taxi o‘rniga avtobus ishlatsangiz 40% tejaysiz.",
      "Yandex Together orqali xarajatni kamaytirish mumkin."
    ]);
  }

  if(msg.includes("ovqat")){
    return random([
      "Restoran xarajatlari yuqori — kamaytirish foydali.",
      "Uyda ovqat qilish orqali katta tejash mumkin.",
      "Fast foodni kamaytirish tavsiya etiladi."
    ]);
  }

  if(msg.includes("tejash")){
    return random([
      "Har kuni xarajat yozib boring.",
      "Keraksiz obunalarni o‘chiring.",
      "Limit qo‘ying va undan oshmang."
    ]);
  }

  return random([
    "Aniqroq yozsangiz yordam beraman.",
    "Qaysi xarajat haqida gapiryapsiz?",
    "Moliyaviy holatingizni tahlil qilaymi?"
  ]);
}

function send(){
  const input = document.getElementById("input");
  const text = input.value.trim();
  if(!text) return;

  add(text, "user");

  setTimeout(()=>{
    add(ai(text), "ai");
  },500);

  input.value="";
}

document.getElementById("input").addEventListener("keypress", e=>{
  if(e.key==="Enter") send();
});


add("Assalomu alaykum! Men sizning byudjet yordamchingizman 💰", "ai");