const alertBox = document.querySelector('#alert');
const suggestionsBox = document.querySelector('#suggestions');
const climaFocado = document.querySelector('.clima-focado');
const body = document.querySelector('body');
const form = document.querySelector('form');

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
            apiSemana(suggestion.city);
        });
        suggestionsBox.appendChild(div);
    });
}

const dropdownMenu = document.getElementById("dropContent");
const dropdownButton = document.getElementById("language");

const changeDisplayDropdown = function(){
  dropdownMenu.classList.toggle("show");
}

dropdownButton.addEventListener("click", function (e){
  e.stopPropagation();
  changeDisplayDropdown();
});

document.documentElement.addEventListener("click", function () {
  if (dropdownMenu.classList.contains("show")) {
    changeDisplayDropdown();
  }
});

async function apiSemana(cidade) {
  const chaveApi = "be8e85f6f23f12abc4517022d09d5e8a";
  const apiSemana = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(cidade)}&appid=${chaveApi}&units=metric&lang=pt_br`;
  try {
      const resultados = await fetch(apiSemana);
      const json = await resultados.json();
      console.log(json);

      function calculaMax(inicio, fim) {
        let max = -200;
        
        for(let i = inicio; i < fim; i++) {
          if(json.list[i].main.temp_max > max) {
            max = json.list[i].main.temp_max;
          }
        }
        return max;
      }
      function calculaMin(inicio, fim) {
        let min = 600;
        
        for(let i = inicio; i < fim; i++) {
          if(json.list[i].main.temp_min < min) {
            min = json.list[i].main.temp_min;
          }
        }
        return min;
      }

      if (json.cod == 200) {
        var dia1 = calculaMax(0, 8);
        var dia1min = calculaMin(0, 8);
        var dia2 = calculaMax(9, 16);
        var dia2min = calculaMin(9, 16);
        var dia3 = calculaMax(17, 24);
        var dia3min = calculaMin(17, 24);
        var dia4 = calculaMax(25, 32);
        var dia4min = calculaMin(25, 32);
        var dia5 = calculaMax(32, 40);
        var dia5min = calculaMin(32, 40);
        infosSemana({
          tempDia1: dia1,
          tempDia1M: dia1min,
          tempDia2: dia2,
          tempDia2M: dia2min,
          tempDia3: dia3,
          tempDia3M: dia3min,
          tempDia4: dia4,
          tempDia4M: dia4min,
          tempDia5: dia5,
          tempDia5M: dia5min,
          descDia1: json.list[7].weather[0].description,
          descDia2: json.list[15].weather[0].description,
          descDia3: json.list[23].weather[0].description,
          descDia4: json.list[31].weather[0].description,
          descDia5: json.list[39].weather[0].description,
          umidadeDia1: json.list[7].main.humidity,
          umidadeDia2: json.list[15].main.humidity,
          umidadeDia3: json.list[23].main.humidity,
          umidadeDia4: json.list[31].main.humidity,
          umidadeDia5: json.list[39].main.humidity,
          velocidadeVento1: json.list[7].wind.speed,
          velocidadeVento2: json.list[15].wind.speed,
          velocidadeVento3: json.list[23].wind.speed,
          velocidadeVento4: json.list[31].wind.speed,
          velocidadeVento5: json.list[39].wind.speed,
          sensacaoDia1: json.list[7].main.feels_like,
          sensacaoDia2: json.list[15].main.feels_like,
          sensacaoDia3: json.list[23].main.feels_like,
          sensacaoDia4: json.list[31].main.feels_like,
          sensacaoDia5: json.list[39].main.feels_like,
        });
      } 
  else {
      showAlert("Não foi possível encontrar a sua cidade");
  }
} catch (error) {
  console.log('error', error);
}

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
          const hora = formattedDate.slice(11, 13);
          const dia = diaDoAno.slice(8, 10);


          const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
          const mes = meses[parseInt(diaDoAno.slice(5, 7)) - 1];
          
          const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
          const diaSemana = diasDaSemana[dataHora.getDay()];

          console.log(`Latitude: ${lat}, Longitude: ${lon}, Dia: ${dia} ${mes} ${diaSemana}, Hora ${hora}`);

            infos({
                city: json.name,
                pais: json.sys.country,
                temperatura: json.main.temp,
                temperaturaMax: json.main.temp_max,
                temperaturaMin: json.main.temp_min,
                descrition: json.weather[0].description,
                windSpeed: json.wind.speed,
                humidity: json.main.humidity,
                sensacao: json.main.feels_like,
                direcaoVento: json.wind.deg,
                latitude: lat,
                longitude: lon,
                dia: dia,
                diaSemana: diaSemana,
                mes: mes,
                hora: hora,
                timezone: json.timezone
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
    apiSemana(cidade);
});

function showAlert(msg) {
    alertBox.innerHTML = msg;
    alertBox.style.display = "block";
}

function infos(json) {
    const date = new Date();
    velVento = Math.round(`${json.windSpeed}` *3,6);
    document.querySelector(".dia-focado").innerHTML = `${json.diaSemana}` + ", " + `${json.dia}` + " de " + `${json.mes}`;
    document.querySelector("#local").innerHTML = `${json.city}, ${json.pais}`;
    document.querySelector("#tempHj").innerHTML = Math.round(`${json.temperatura}`) + "°c";
    document.querySelector("#ventoDir").innerHTML = `${json.direcaoVento}` + "°";
    document.querySelector("#tempMinT").innerHTML = Math.round(`${json.temperaturaMin}`) + "°c";
    document.querySelector("#tempMaxT").innerHTML = Math.round(`${json.temperaturaMax}`) + "°c";
    document.querySelector("#umid").innerHTML = "Umidade: " + `${json.humidity}` + "%";
    document.querySelector("#vento").innerHTML = "Vento: " + velVento + " km/h";
    document.querySelector("#sensacao").innerHTML = "Sensação térmica: " + Math.round(`${json.sensacao}`) + "°c";
    document.querySelector("#climaNome").innerHTML = "Clima: " + `${json.descrition}`;
    document.querySelector("#dia-um").innerHTML = somaDia(date,1);
    document.querySelector("#dia-dois").innerHTML = somaDia(date,2);
    document.querySelector("#dia-tres").innerHTML = somaDia(date,3);
    document.querySelector("#dia-quatro").innerHTML = somaDia(date,4);
    document.querySelector("#dia-cinco").innerHTML = somaDia(date,5);

    var dirVento = document.querySelector(".vento");
    dirVento.style.transform = `rotate(${json.direcaoVento}deg)`;

    timezone = parseInt(json.timezone) / 3600;
    intHora = parseInt(json.hora) + 3 + timezone; // converte a hora para inteiro
    if (intHora >= 24) {
        intHora = intHora - 24;
    }
    console.log(intHora);
    const isNight = intHora >= 18 || intHora < 6; // verifica se é noite (entre 18h e 6h)
    
    if (isNight) {
      noite();
  } else {
      climaFocado.style.background = "linear-gradient(#009ad1, #43cdff)";
      body.style.background = "#18a7db";
      form.style.backgroundColor = "#18a7db";
  }

  const imgsrc = document.querySelector(".imagem-focado");

    switch(json.descrition) {
        case "algumas nuvens":
            imgsrc.src = "imagens/poucas_nuvensss.gif";
            if(isNight) {
              noite();
            } else {
                climaFocado.style.background = "linear-gradient(#009ad1, #43cdff)";
            }
            break;
        case "nublado":
            imgsrc.src = "imagens/nubladoer.gif";
            if(isNight) {
                noite();
            } else {
                climaFocado.style.background = "linear-gradient(#01678b,#43cdff)";
            }
            break;
        case "chuva forte":
            imgsrc.src = "imagens/chuva_forte.gif";
            if(isNight) {
              noite();
            } else {
                climaFocado.style.background = "linear-gradient(#01678b,#43cdff)";
            }
            break;
        case "chuva leve":
            imgsrc.src = "imagens/chuva.gif";
            if(isNight) {
                noite();
            } else {
                climaFocado.style.background = "linear-gradient(#009ad1,#43cdff)";
            }
            break;
        case "chuva moderada":
            imgsrc.src = "imagens/nubladoer.gif";
            if(isNight) {
                noite();
            } else {
                climaFocado.style.background = "linear-gradient(#01678b,#01678b)";
            }
            break;
        case "céu limpo":
          imgsrc.src = "imagens/suner.gif";
          if(isNight){
            noite();
            imgsrc.src = "imagens/lua.gif";
          }
          break;
        case "ensolarado":
            imgsrc.src = "imagens/suner.gif";
            console.log(imgsrc.src);
            if(isNight) {
                noite();
                imgsrc.src = "imagens/lua.gif";
            } else {
                climaFocado.style.background = "linear-gradient(45deg, rgba(1,170,231,1) 75%, rgba(249,187,84,1) 92%, rgba(255,241,0,1) 100%)";
            }
            break;
        case "nuvens dispersas":
          imgsrc.src = "imagens/suner.gif";
          break;
          default:
        imgsrc.src = "imagens/snow.gif";
        break;
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

function infosSemana(json) {
  const days = document.querySelectorAll('.dia-semana');
  document.querySelector("#tempDiaSemana1").innerHTML =  Math.round(`${json.tempDia1}`) + "°/" + Math.round(`${json.tempDia1M}`) + "°";
  document.querySelector("#tempDiaSemana2").innerHTML = Math.round(`${json.tempDia2}`) + "°/" + Math.round(`${json.tempDia2M}`) + "°";
  document.querySelector("#tempDiaSemana3").innerHTML = Math.round(`${json.tempDia3}`) + "°/" + Math.round(`${json.tempDia3M}`) + "°"
  document.querySelector("#tempDiaSemana4").innerHTML = Math.round(`${json.tempDia4}`) + "°/" + Math.round(`${json.tempDia4M}`) + "°"
  document.querySelector("#tempDiaSemana5").innerHTML = Math.round(`${json.tempDia5}`) + "°/" + Math.round(`${json.tempDia5M}`) + "°"
  atualizarImagemDia("#imagem-dia1", json.descDia1);
  atualizarImagemDia("#imagem-dia2", json.descDia2);
  atualizarImagemDia("#imagem-dia3", json.descDia3);
  atualizarImagemDia("#imagem-dia4", json.descDia4);
  atualizarImagemDia("#imagem-dia5", json.descDia5);

  days[0].dataset.umidade = json.umidadeDia1;
  days[0].dataset.vento = json.velocidadeVento1;
  days[0].dataset.sensacao =  Math.round(json.sensacaoDia1);
  days[0].dataset.clima = json.descDia1;
  days[0].dataset.tempMax =  Math.round(json.tempDia1);
  days[0].dataset.tempMin =  Math.round(json.tempDia1M);

  days[1].dataset.umidade = json.umidadeDia2;
  days[1].dataset.vento = json.velocidadeVento2;
  days[1].dataset.sensacao =  Math.round(json.sensacaoDia2);
  days[1].dataset.clima = json.descDia2;
  days[1].dataset.tempMax =  Math.round(json.tempDia2);
  days[1].dataset.tempMin =  Math.round(json.tempDia2M);

  days[2].dataset.umidade = json.umidadeDia3;
  days[2].dataset.vento = json.velocidadeVento3;
  days[2].dataset.sensacao =  Math.round(json.sensacaoDia3);
  days[2].dataset.clima = json.descDia3;
  days[2].dataset.tempMax =  Math.round(json.tempDia3);
  days[2].dataset.tempMin =  Math.round(json.tempDia3M);

  days[3].dataset.umidade = json.umidadeDia4;
  days[3].dataset.vento = json.velocidadeVento4;
  days[3].dataset.sensacao =  Math.round(json.sensacaoDia4);
  days[3].dataset.clima = json.descDia4;
  days[3].dataset.tempMax =  Math.round(json.tempDia4);
  days[3].dataset.tempMin =  Math.round(json.tempDia4M);

  days[4].dataset.umidade = json.umidadeDia5;
  days[4].dataset.vento = json.velocidadeVento5;
  days[4].dataset.sensacao =  Math.round(json.sensacaoDia5);
  days[4].dataset.clima = json.descDia5;
  days[4].dataset.tempMax =  Math.round(json.tempDia5);
  days[4].dataset.tempMin =  Math.round(json.tempDia5M);

  eventoClick();
}

function eventoClick(){
  const days = document.querySelectorAll('.dia-semana');

  days.forEach((day) => {
    day.addEventListener('click',function(){
      document.querySelector("#tempHj").textContent = this.dataset.tempMax + "°";
      document.querySelector("#tempMinT").textContent = this.dataset.tempMin + "°";
      document.querySelector("#tempMaxT").textContent = this.dataset.tempMax + "°";
      document.querySelector("#umid").textContent = "Umidade: " + this.dataset.umidade + "%";
      document.querySelector("#vento").textContent = "Vento: " + Math.round(this.dataset.vento * 3.6) + " km/h";
      document.querySelector("#sensacao").textContent = "Sensação térmica: " + Math.round(this.dataset.sensacao) + "°";
      document.querySelector("#climaNome").textContent = "Clima: " + this.dataset.clima;

      atualizarImagem(this.dataset.clima);

      

      if(this.dataset.clima === "ensolarado" || this.dataset.clima === "céu limpo") {
        climaFocado.style.background = "linear-gradient(45deg, rgba(1,170,231,1) 75%, rgba(249,187,84,1) 92%, rgba(255,241,0,1) 100%)";
        body.style.background = "#18a7db";
        form.style.backgroundColor = "#18a7db";
      } else if(this.dataset.clima.includes("chuva")) {
        climaFocado.style.background = "linear-gradient(#01678b,#43cdff)";
      }
      else{
        climaFocado.style.background = "linear-gradient(#009ad1, #43cdff)";
        body.style.background = "#18a7db";
        form.style.backgroundColor = "#18a7db";
      }

      days.forEach(d => d.classList.remove('dia-selecionado'));
      this.classList.add('dia-selecionado');
    });
  });
}

function atualizarImagem(desc){
  const imgsrc = document.querySelector(".imagem-focado");
  const horaAtual = new Date().getHours();
  const isNight = horaAtual >= 18 || horaAtual < 6;
  
  switch(desc) {
    case "algumas nuvens":
        imgsrc.src = "imagens/poucas_nuvensss.gif";
        break;
    case "nublado":
        imgsrc.src = "imagens/nubladoer.gif";
        break;
    case "chuva forte":
        imgsrc.src = "imagens/chuva_forte.gif";
        break;
    case "chuva leve":
        imgsrc.src = "imagens/chuva.gif";
        break;
    case "chuva moderada":
        imgsrc.src = "imagens/nubladoer.gif";
        break;
    case "céu limpo":
      imgsrc.src = isNight ? "imagens/lua.gif" : "imagens/suner.gif";
      break;
    case "ensolarado":
        imgsrc.src = "imagens/suner.gif";
        break;
    case "nuvens dispersas": 
        imgsrc.src = "imagens/poucas_nuvens.gif";
        break;     
    default:
        imgsrc.src = "imagens/snow.gif";
        break;
  }
}

function atualizarImagemDia(selector, descricao) {
  var imgsrc = document.querySelector(selector);
  
  switch(descricao) {
      case "algumas nuvens":
          imgsrc.src = "imagens/poucas_nuvens.gif";
          break;
      case "nublado":
          imgsrc.src = "imagens/nublado.gif";
          break;
      case "chuva forte":
          imgsrc.src = "imagens/chuva_forte.gif";
          break;
      case "chuva leve":
          imgsrc.src = "imagens/chuva.gif";
          break;
      case "chuva moderada":
          imgsrc.src = "imagens/nublado.gif";
          break;
      case "céu limpo":
          imgsrc.src = "imagens/sun.gif";
          break;
      case "ensolarado":
          imgsrc.src = "imagens/sun.gif";
          break;
      case "nuvens dispersas": 
          imgsrc.src = "imagens/poucas_nuvens.gif";
          break;
      default:
        imgsrc.src = "imagens/snow.gif";
        break;
  }
}

function noite(){
  climaFocado.style.background = "url(imagens/night.png), linear-gradient(#01344d,#014d6e)";
  climaFocado.style.backgroundSize = "cover";
  body.style.background = "linear-gradient(#01344d ,#014d6e)";
  form.style.backgroundColor = "#01344d";
  var imgsrc = document.querySelector(".imagem-focado");
}