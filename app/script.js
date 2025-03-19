document.querySelector('#search').addEventListener('submit',async (event) => {
    event.preventDefault();
    const cidade = document.querySelector('#cidade').value.trim();
    

    if (!cidade) {
        return showAlert("Você não digitou a cidade!");
    }
   

    const chaveApi = "be8e85f6f23f12abc4517022d09d5e8a"
    const apiCidade = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cidade)}&appid=${chaveApi}&units=metric&lang=pt_br`;
    const resultados = await fetch(apiCidade);
    const json = await resultados.json();
    console.log(json);
    if(json.cod === 200){
        
        infos({
            city: json.name,
            pais: json.sys.country,
            temperatura: json.main.temp,
            temperaturaMax: json.main.temp_max,
            temperaturaMin: json.main.temp_min,
            descrition: json.weather[0].description,
            tempIcon: json.weather[0].icon,
            windSpeed: json.wind.speed,
            humidity: json.main.humidity,
            sensacao: json.main.feels_like,
            direcaoVento: json.wind.deg,

        });
    } else{
        showAlert("Não foi possivel encontrar a sua cidade")
    }
        
});

function showAlert(msg) {
    const alertBox = document.querySelector('#alert');
    alertBox.innerHTML = msg;
    alertBox.style.display = "block"; 
    alertBox.style.visibility = "visible"; 
    alertBox.style.opacity = "1"; 
}

function infos(json){
    showAlert("")
    document.querySelector("#local").innerHTML = `${json.city}, ${json.pais}`;
    document.querySelector("#tempHj").innerHTML = Math.round(`${json.temperatura}`) + "°";
    document.querySelector("#ventoDir").innerHTML = `${json.direcaoVento}` + "°";
    document.querySelector("#tempMinT").innerHTML = Math.round(`${json.temperaturaMin}`) + "°";
    document.querySelector("#tempMaxT").innerHTML = Math.round(`${json.temperaturaMax}`) + "°";
    document.querySelector("#climaNome").innerHTML = "Clima: " + `${json.descrition}`;
    document.querySelector("#umid").innerHTML = "Umidade: " + `${json.humidity}` + "%";
}
