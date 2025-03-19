document.querySelector('#search').addEventListener('submit',async (event) => {
    event.preventDefault();
    const cidade = document.querySelector('#cidade').value.trim();
    const alertBox = document.querySelector('#alert');

    if (!cidade) {
        showAlert("Você não digitou a cidade!");
        return;
    }
    alertBox.innerHTML = "";
    alertBox.style.display = "none";

    const chaveApi = be8e85f6f23f12abc4517022d09d5e8a
    const apiCidade = 'https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cidade)}&appid=${chaveApi}&units=metric&lang=pt_br'
    const resultados = await fetch(apiUrl);
});

function showAlert(msg) {
    const alertBox = document.querySelector('#alert');
    alertBox.innerHTML = msg;
    alertBox.style.display = "block"; 
    alertBox.style.visibility = "visible"; 
    alertBox.style.opacity = "1"; 
}
