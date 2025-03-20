const alertBox = document.querySelector('#alert');
const suggestionsBox = document.querySelector('#suggestions');

document.querySelector('#cidade').addEventListener('input', async (event) => {
    //Função para buscar cidades com mais de 3 caracteres digitados pelo usuário e exibir sugestões de cidades 
    
    //const cidade remove tudo que não é letra
    const cidade = event.target.value.trim() //

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

document.addEventListener('click', (event) => {
  if (!suggestionsBox.contains(event.target) && event.target.id !== 'cidade') {
    suggestionsBox.style.display = "none";
  }
});


function displaySuggestions(suggestions) {
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = "block";

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
        
        if (json.cod === 200) {
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
        } else {
            showAlert("Não foi possível encontrar a sua cidade");
        }
    } catch (error) {
        console.log('error', error);
        showAlert("Erro ao buscar dados da cidade");
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
    alertBox.style.display = "none";
    document.querySelector("#local").innerHTML = `${json.city}, ${json.pais}`;
    document.querySelector("#tempHj").innerHTML = Math.round(`${json.temperatura}`) + "°c";
    document.querySelector("#ventoDir").innerHTML = `${json.direcaoVento}` + "°";
    document.querySelector("#tempMinT").innerHTML = Math.round(`${json.temperaturaMin}`) + "°c";
    document.querySelector("#tempMaxT").innerHTML = Math.round(`${json.temperaturaMax}`) + "°c";
    document.querySelector("#umid").innerHTML = "Umidade: " + `${json.humidity}` + "%";
    document.querySelector("#vento").innerHTML = "Vento: " + `${json.windSpeed}` + "km/h";
    document.querySelector("#sensacao").innerHTML = "Sensação térmica: " + Math.round(`${json.sensacao}`) + "°c";
    document.querySelector("#climaNome").innerHTML = "Clima: " + `${json.descrition}`;
}