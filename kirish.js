let supaBaseUrl = 'https://pcdugrawrtezxmzagaqh.supabase.co'
let supaBaseKey = 'sb_publishable_oJnISbwOks8wEIh6gCAkqw_Npr5Q6qB'

const _supabase = supabase.createClient(supaBaseUrl, supaBaseKey)

async function Yubor() {
    let email = document.getElementById('email').value
    let parol = document.getElementById('parol').value


    const { data, error } = await _supabase
        .from('Malumotlar')
        .insert([
            {
                Ism: email,
                Familiya: parol,
            }
        ])
    if (error) {
        alert('Xatolik yuz berdi!', error)
    }
    else {
        alert("Bazaga qo'shildi")
        tozala()
    }
}
function tozala() {
    email.value = ''
    parol.value = ''
   
}