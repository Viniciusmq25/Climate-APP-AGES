const alertBox = document.querySelector('#alert');
const suggestionsBox = document.querySelector('#suggestions');
const climaFocado = document.querySelector('.clima-focado');

document.querySelector('#cidade').addEventListener('input', async (event) => {
  //Função para buscar cidades com mais de 3 caracteres digitados pelo usuário e exibir sugestões de cidades 
  alertBox.style.display = "none";
  const cidade = event.target.value.trim();

  if (cidade.length < 3) {
    suggestionsBox.style.display = "none";
    return;
  }

  const chaveApiAutoPreenchimento = "f80ffc97d8db4bb89a48d6ee3924d834";
  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${cidade}&format=json&apiKey=${chaveApiAutoPreenchimento}`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    displaySuggestions(result.results);
  } catch (error) {
    console.log('error', error);
  }
});

// Adiciona evento de clique no input para mostrar sugestões caso já tenha texto
document.querySelector('#cidade').addEventListener('click', async (event) => {
  const cidade = event.target.value.trim();
  if (cidade.length >= 3) {
    const chaveApiAutoPreenchimento = "f80ffc97d8db4bb89a48d6ee3924d834";
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${cidade}&format=json&apiKey=${chaveApiAutoPreenchimento}`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      displaySuggestions(result.results);
    } catch (error) {
      console.log('error', error);
    }
  }
});

document.addEventListener('click', (event) => {
  if (!suggestionsBox.contains(event.target) && event.target.id !== 'cidade') {
    suggestionsBox.style.display = "none";
    alertBox.style.display = "none";
  }
});


function displaySuggestions(suggestions) {
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = "block";

    if (suggestions.length === 0) {
        suggestionsBox.innerHTML= "Nenhum lugar encontrado";
        return;
    }

    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.innerHTML = `<img src="imagens/find.svg" class="img-suggestion" alt="Confirmação de pesquisa"> ${suggestion.city}, ${suggestion.country}`;
        //adiciona a classe img-suggestion na imagem da div
        div.classList.add('suggestion-item');
        //adiciona um icone na esquerda do texto da div
        if(div.textContent.includes("undefined")) {
            div.style.display = "none";
        }
        div.addEventListener('click', () => {
            document.querySelector('#cidade').value = suggestion.city;
            suggestionsBox.style.display = "none";
            apiTemp(suggestion.city);
        });
        suggestionsBox.appendChild(div);
    });
}

async function apiTemp(cidade) {
    const chaveApi = "be8e85f6f23f12abc4517022d09d5e8a";
    const apiCidade = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cidade)}&appid=${chaveApi}&units=metric&lang=pt_br`;
    
    try {
        const resultados = await fetch(apiCidade);
        const json = await resultados.json();
        console.log(json);
        
        if (json.cod === 200) {

          const lat = json.coord.lat;
          const lon = json.coord.lon;
          const dataHora = new Date(json.dt * 1000);
          dataHora.setHours(dataHora.getHours() - 3);
          const formattedDate = dataHora.toISOString().replace('T', ' ').slice(0, 19);
          const diaDoAno = formattedDate.slice(0, 10); // aaaa-mm-dd
          const hora = formattedDate.slice(11, 19);
          const dia = diaDoAno.slice(8, 10);


          const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
          const mes = meses[parseInt(diaDoAno.slice(5, 7)) - 1];
          
          const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
          const diaSemana = diasDaSemana[dataHora.getDay()];

          console.log(`Latitude: ${lat}, Longitude: ${lon}, Dia: ${dia} ${mes} ${diaSemana}, Horanaonaoformatada: ${json.dt}`);

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
                latitude: lat,
                longitude: lon,
                dia: dia,
                diaSemana: diaSemana,
                mes: mes,
                hora: hora
            });
        } else {
            showAlert("Não foi possível encontrar a sua cidade");
        }
    } catch (error) {
        console.log('error', error);
    }
}

document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();
    const cidade = document.querySelector('#cidade').value.trim();

    if (!cidade) {
        return showAlert("Você não digitou a cidade!");
    }

    apiTemp(cidade);
});

function showAlert(msg) {
    alertBox.innerHTML = msg;
    alertBox.style.display = "block";
}

function infos(json) {
    const date = new Date();
    document.querySelector(".dia-focado").innerHTML = `${json.diaSemana}` + ", " + `${json.dia}` + " de " + `${json.mes}`;
    document.querySelector("#local").innerHTML = `${json.city}, ${json.pais}`;
    document.querySelector("#tempHj").innerHTML = Math.floor(`${json.temperatura}`) + "°c";
    document.querySelector("#ventoDir").innerHTML = `${json.direcaoVento}` + "°";
    document.querySelector("#tempMinT").innerHTML = Math.floor(`${json.temperaturaMin}`) + "°c";
    document.querySelector("#tempMaxT").innerHTML = Math.floor(`${json.temperaturaMax}`) + "°c";
    document.querySelector("#umid").innerHTML = "Umidade: " + `${json.humidity}` + "%";
    document.querySelector("#vento").innerHTML = "Vento: " + `${json.windSpeed}` + "km/h";
    document.querySelector("#sensacao").innerHTML = "Sensação térmica: " + Math.floor(`${json.sensacao}`) + "°c";
    document.querySelector("#climaNome").innerHTML = "Clima: " + `${json.descrition}`;
    document.querySelector("#dia-um").innerHTML = somaDia(date,1);
    document.querySelector("#dia-dois").innerHTML = somaDia(date,2);
    document.querySelector("#dia-tres").innerHTML = somaDia(date,3);
    document.querySelector("#dia-quatro").innerHTML = somaDia(date,4);
    document.querySelector("#dia-cinco").innerHTML = somaDia(date,5);
    document.querySelector("#dia-seis").innerHTML = somaDia(date,6);

    var dirVento = document.querySelector(".vento");
    dirVento.style.transform = `rotate(${json.direcaoVento}deg)`;

    var imgsrc = document.querySelector(".imagem-focado");
    if(`${json.descrition}` == "algumas nuvens"){
        imgsrc.src = "imagens/poucas_nuvens.gif";
        climaFocado.style.background = "linear-gradient(#01678b,#43cdff)";
    }
    else if(`${json.descrition}` == "nublado"){
        imgsrc.src = "imagens/nublado.gif";
        climaFocado.style.background = "linear-gradient(#01678b,#43cdff)";
    }
    else if(`${json.descrition}` == "chuva forte"){
        imgsrc.src = "imagens/chuva_forte.gif";
        climaFocado.style.background = "linear-gradient(#01678b,#43cdff)";
    }
    else if(`${json.descrition}` == "chuva leve"){
        imgsrc.src = "imagens/chuva.gif";
        climaFocado.style.background = "linear-gradient(#009ad1,#43cdff)";

    }
    else if(`${json.descrition}` == "chuva moderada"){
        imgsrc.src = "imagens/nublado.gif";
        climaFocado.style.background = "linear-gradient(#01678b,#01678b)";
    }
    else if (`${json.descrition}` == "céu limpo"){
      imgsrc.src = "imagens/sun.gif";
      climaFocado.style.background = climaFocado.style.background = "linear-gradient(45deg, rgba(1,170,231,1) 75%, rgba(249,187,84,1) 92%, rgba(255,241,0,1) 100%)";
    }
    else if (`${json.descrition}` == "ensolarado"){
      imgsrc.src = "imagens/sun.gif";
      climaFocado.style.background = "linear-gradient(45deg, rgba(1,170,231,1) 75%, rgba(249,187,84,1) 92%, rgba(255,241,0,1) 100%)";
    }

    function somaDia(date, soma){
      var som = date.getDay() + soma;
      if(som > 7){
        som = som -7;
      }
        switch (som){
            case 0:
                var som = "Dom.";
                break;
            case 1:
                var som = "Seg.";
                break;
            case 2:
                var som = "Ter.";
                break;
            case 3:
                var som = "Qua.";
                break;
            case 4:
                var som = "Qui.";
                break;
            case 5:
                var som = "Sex.";
                break;
            case 6:
                var som = "Sab.";
                break;
            case 7:
                var som = "Dom.";
                break;
        }
      return som;
  }

}