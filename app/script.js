const alertBox = document.querySelector('#alert');
const suggestionsBox = document.querySelector('#suggestions');
const climaFocado = document.querySelector('.clima-focado');
const body = document.querySelector('body');
const form = document.querySelector('form');
var eNoite = false;
var lingua = "pt";

function somaDia(date, soma) {
  var som = date.getDay() + soma;
  if(som > 6){
    som = som - 7
  }
    const diasPt = ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."];
  const diasEn = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];
  const diasEs = ["Dom.", "Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb."];
  
  if (lingua === "pt") {
    return diasPt[som];
  } else if (lingua === "en") {
    return diasEn[som];
  } else {
    return diasEs[som];
  }
}

function obterLocalizacaoUsuario() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        buscarCidadePorCoordenadas(lat, lon);
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        apiTemp("São Paulo");
        apiSemana("São Paulo");
      }
    );
  } else {
    console.log("Geolocalização não suportada pelo navegador");
    apiTemp("São Paulo");
    apiSemana("São Paulo");
  }
}

async function buscarCidadePorCoordenadas(lat, lon) {
  const chaveApi = "be8e85f6f23f12abc4517022d09d5e8a";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${chaveApi}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.name) {
      document.querySelector('#cidade').value = data.name;
      apiTemp(data.name);
      apiSemana(data.name);
    }
  } catch (error) {
    console.error("Erro ao buscar cidade:", error);
  }
}

window.addEventListener('load', obterLocalizacaoUsuario);

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

document.querySelector('#cidade').addEventListener('click', async (event) => {
  // Adiciona evento de clique no input para mostrar sugestões caso já tenha texto  
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
        div.classList.add('suggestion-item');
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

      function calculaMax(inicio, fim) {
        var max = -200;
        for(var i = inicio; i < fim; i++) {
          if(json.list[i].main.temp_max > max) {
            max = json.list[i].main.temp_max;
          }
        }
        return max;
      }
      function calculaMin(inicio, fim) {
        var min = 600;
        for(var i = inicio; i < fim; i++) {
          if(json.list[i].main.temp_min < min) {
            min = json.list[i].main.temp_min;
          }
        }
        return min;
      }

      if (json.cod == 200) {
        infosSemana({
          tempDia1: calculaMax(0, 8),
          tempDia1M: calculaMin(0, 8),
          tempDia2: calculaMax(9, 16),
          tempDia2M: calculaMin(9, 16),
          tempDia3: calculaMax(17, 24),
          tempDia3M: calculaMin(17, 24),
          tempDia4: calculaMax(25, 32),
          tempDia4M: calculaMin(25, 32),
          tempDia5: calculaMax(32, 40),
          tempDia5M: calculaMin(32, 40),
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
      } else {
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
        
        if (json.cod === 200) {
          const lat = json.coord.lat;
          const lon = json.coord.lon;
          const dataHora = new Date(json.dt * 1000);
          dataHora.setHours(dataHora.getHours() - 3);
          const formattedDate = dataHora.toISOString().replace('T', ' ').slice(0, 19);
          const diaDoAno = formattedDate.slice(0, 10); // aaaa-mm-dd
          const hora = formattedDate.slice(11, 13);
          const dia = diaDoAno.slice(8, 10);

          const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
          const mes = meses[parseInt(diaDoAno.slice(5, 7)) - 1];
          
          const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
          const diaSemana = diasDaSemana[dataHora.getDay()];

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
              latitude: json.coord.lat,
              longitude: json.coord.lon,
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
  velVento = Math.round(`${json.windSpeed}` * 3.6);
  
  var formatoData;
  if(lingua === "pt") {
      const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
      formatoData = `${diasDaSemana[date.getDay()]}, ${json.dia} de ${json.mes}`;
  } 
  else if(lingua === "en") {
      const months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      formatoData = `${weekdays[date.getDay()]}, ${months[date.getMonth()]} ${json.dia}`;
  } 
  else if(lingua === "es") {
      const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      formatoData = `${diasSemana[date.getDay()]}, ${json.dia} de ${meses[date.getMonth()]}`;
  }
  
  document.querySelector(".dia-focado").innerHTML = formatoData;
  document.querySelector("#local").innerHTML = `${json.city}, ${json.pais}`;
  document.querySelector("#tempHj").innerHTML = Math.round(`${json.temperatura}`) + "°c";
  document.querySelector("#ventoDir").innerHTML = `${json.direcaoVento}` + "°";
  document.querySelector("#tempMinT").innerHTML = Math.round(`${json.temperaturaMin}`) + "°c";
  document.querySelector("#tempMaxT").innerHTML = Math.round(`${json.temperaturaMax}`) + "°c";
 
if (lingua === "pt") {
  document.querySelector("#vento").innerHTML = "Vento: " + velVento + " km/h";
} else if (lingua === "en") {
  document.querySelector("#vento").innerHTML = "Wind speed: " + velVento + " km/h";
} else {
  document.querySelector("#vento").innerHTML = "Velocidad del viento: " + velVento + " km/h";
}

if (lingua === "pt") {
  document.querySelector("#sensacao").innerHTML = "Sensação térmica: " + Math.round(`${json.sensacao}`) + "°c";
} else if (lingua === "en") {
  document.querySelector("#sensacao").innerHTML = "Feels like: " + Math.round(`${json.sensacao}`) + "°c";
} else {
  document.querySelector("#sensacao").innerHTML = "Sensación térmica: " + Math.round(`${json.sensacao}`) + "°c";
}


if (lingua === "pt") {
  document.querySelector("#climaNome").innerHTML = "Clima: " + `${json.descrition}`;
} else if (lingua === "en") {
  document.querySelector("#climaNome").innerHTML = "Climate: " + `${json.descrition}`;
} else {
  document.querySelector("#climaNome").innerHTML = "Clima: " + `${json.descrition}`;
}
  
  atualizarDiasSemana();

  const button1 = document.querySelector("#pt");
  button1.addEventListener('click', function(){
      const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezember"];
      const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
      document.querySelector(".dia-focado").innerHTML = `${diasDaSemana[date.getDay()]}, ${json.dia} de ${meses[date.getMonth()]}`;
      document.querySelector("#umid").textContent = "Umidade: " + `${json.humidity}` + "%";
      document.querySelector("#vento").textContent = "Vento: " + velVento + " km/h";
      document.querySelector("#sensacao").textContent = "Sensação térmica: " + Math.round(`${json.sensacao}`) + "°";
      document.querySelector("#climaNome").textContent = "Clima: " + `${json.descrition}`;
      lingua = "pt";
      atualizarDiasSemana();
  });

  const button2 = document.querySelector("#english");
  button2.addEventListener('click', function(){
      const months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      document.querySelector(".dia-focado").innerHTML = `${weekdays[date.getDay()]}, ${months[date.getMonth()]} ${json.dia}`;
      document.querySelector("#umid").textContent = "Umidity: " + `${json.humidity}` + "%";
      document.querySelector("#vento").textContent = "Wind speed: " + velVento + " km/h";
      document.querySelector("#sensacao").textContent = "Feels like: " + Math.round(`${json.sensacao}`) + "°";
      document.querySelector("#climaNome").textContent = "Climate: " + `${json.descrition}`;
      lingua = "en";
      atualizarDiasSemana();
  });

  const button3 = document.querySelector("#spanish");
  button3.addEventListener('click', function(){
      const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      document.querySelector(".dia-focado").innerHTML = `${diasSemana[date.getDay()]}, ${json.dia} de ${meses[date.getMonth()]}`;
      document.querySelector("#umid").textContent = "Humidad: " + `${json.humidity}` + "%";
      document.querySelector("#vento").textContent = "Velocidad del viento: " + velVento + " km/h";
      document.querySelector("#sensacao").textContent = "Sensación térmica: " + Math.round(`${json.sensacao}`) + "°";
      document.querySelector("#climaNome").textContent = "Clima: " + `${json.descrition}`;
      lingua = "es";
      atualizarDiasSemana();
  });

  var dirVento = document.querySelector(".vento");
  dirVento.style.transform = `rotate(${json.direcaoVento}deg)`;

  timezone = parseInt(json.timezone) / 3600;
  intHora = parseInt(json.hora) + 3 + timezone;
  if (intHora >= 24) {
      intHora = intHora - 24;
  }
  
  eNoite = intHora >= 18 || intHora < 6;
  if (eNoite){
      noite();
  }
  else {
      climaFocado.style.background = "linear-gradient(#009ad1, #43cdff)";
      body.style.background = "#18a7db";
      form.style.backgroundColor = "#18a7db";
  }

  const imgsrc = document.querySelector(".imagem-focado");
  switch(json.descrition) {
      case "algumas nuvens":
          imgsrc.src = "imagens/poucas_nuvensss.gif";
          if(eNoite){
              noite();
          }
          else climaFocado.style.background = "linear-gradient(#009ad1, #43cdff)";
          break;
      case "nublado":
          imgsrc.src = "imagens/nubladoer.gif";
          if(eNoite){
              noite();
          }
          else climaFocado.style.background = "linear-gradient(#01678b,#43cdff)";
          break;
      case "chuva forte":
          imgsrc.src = "imagens/chuva_forte.gif";
          if(eNoite){
              noite();
          }
          else climaFocado.style.background = "linear-gradient(#01678b,#43cdff)";
          break;
      case "chuva leve":
          imgsrc.src = "imagens/chuva.gif";
          if(eNoite){
              noite();
          }
          else climaFocado.style.background = "linear-gradient(#009ad1,#43cdff)";
          break;
      case "chuva moderada":
          imgsrc.src = "imagens/nubladoer.gif";
          if(eNoite){
              noite();
          }
          else climaFocado.style.background = "linear-gradient(#01678b,#01678b)";
          break;
      case "céu limpo":
          imgsrc.src = "imagens/suner.gif";
          if(eNoite){
              noite();
              imgsrc.src = "imagens/lua.gif";
          }
          break;
      case "ensolarado":
          imgsrc.src = "imagens/suner.gif";
          if(eNoite) {
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
}

function infosSemana(json) {
  const days = document.querySelectorAll('.dia-semana');
  document.querySelector("#tempDiaSemana1").innerHTML =  Math.round(`${json.tempDia1}`) + "°/" + Math.round(`${json.tempDia1M}`) + "°";
  document.querySelector("#tempDiaSemana2").innerHTML = Math.round(`${json.tempDia2}`) + "°/" + Math.round(`${json.tempDia2M}`) + "°";
  document.querySelector("#tempDiaSemana3").innerHTML = Math.round(`${json.tempDia3}`) + "°/" + Math.round(`${json.tempDia3M}`) + "°";
  document.querySelector("#tempDiaSemana4").innerHTML = Math.round(`${json.tempDia4}`) + "°/" + Math.round(`${json.tempDia4M}`) + "°";
  document.querySelector("#tempDiaSemana5").innerHTML = Math.round(`${json.tempDia5}`) + "°/" + Math.round(`${json.tempDia5M}`) + "°";
  
  atualizarImagemDia("#imagem-dia1", json.descDia1);
  atualizarImagemDia("#imagem-dia2", json.descDia2);
  atualizarImagemDia("#imagem-dia3", json.descDia3);
  atualizarImagemDia("#imagem-dia4", json.descDia4);
  atualizarImagemDia("#imagem-dia5", json.descDia5);

  days.forEach((day, index) => {
    day.dataset.umidade = json[`umidadeDia${index+1}`];
    day.dataset.vento = json[`velocidadeVento${index+1}`];
    day.dataset.sensacao = Math.round(json[`sensacaoDia${index+1}`]);
    day.dataset.clima = json[`descDia${index+1}`];
    day.dataset.tempMax = Math.round(json[`tempDia${index+1}`]);
    day.dataset.tempMin = Math.round(json[`tempDia${index+1}M`]);
  });

  eventoClick();
}

function eventoClick(){
  const days = document.querySelectorAll('.dia-semana');
  const date = new Date();

  days.forEach((day, index) => {
      day.addEventListener('click',function(){
          const selectedDate = new Date();
          selectedDate.setDate(date.getDate() + index + 1);
          
         
          var dataFormatada;
          if(lingua === "pt") {
              const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                          "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
              const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
              dataFormatada = `${diasDaSemana[selectedDate.getDay()]}, ${selectedDate.getDate()} de ${meses[selectedDate.getMonth()]}`;
          } 
          else if(lingua === "en") {
              const months = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"];
              const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
              dataFormatada = `${weekdays[selectedDate.getDay()]}, ${months[selectedDate.getMonth()]} ${selectedDate.getDate()}`;
          } 
          else if(lingua === "es") {
              const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
              const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
              dataFormatada = `${diasSemana[selectedDate.getDay()]}, ${selectedDate.getDate()} de ${meses[selectedDate.getMonth()]}`;
          }
          
          document.querySelector(".dia-focado").innerHTML = dataFormatada;

         
          document.querySelector("#tempHj").textContent = this.dataset.tempMax + "°";
          document.querySelector("#tempMinT").textContent = this.dataset.tempMin + "°";
          document.querySelector("#tempMaxT").textContent = this.dataset.tempMax + "°";
          
          if(lingua === "pt") {
              document.querySelector("#umid").textContent = "Umidade: " + this.dataset.umidade + "%";
              document.querySelector("#vento").textContent = "Vento: " + Math.round(this.dataset.vento * 3.6) + " km/h";
              document.querySelector("#sensacao").textContent = "Sensação térmica: " + Math.round(this.dataset.sensacao) + "°";
              document.querySelector("#climaNome").textContent = "Clima: " + this.dataset.clima;
          } else if(lingua === "en") {
              document.querySelector("#umid").textContent = "Umidity: " + this.dataset.umidade + "%";
              document.querySelector("#vento").textContent = "Wind speed: " + Math.round(this.dataset.vento * 3.6) + " km/h";
              document.querySelector("#sensacao").textContent = "Feels like: " + Math.round(this.dataset.sensacao) + "°";
              document.querySelector("#climaNome").textContent = "Climate: " + this.dataset.clima;
          } else if(lingua === "es") {
              document.querySelector("#umid").textContent = "Humidad: " + this.dataset.umidade + "%";
              document.querySelector("#vento").textContent = "Velocidad del viento: " + Math.round(this.dataset.vento * 3.6) + " km/h";
              document.querySelector("#sensacao").textContent = "Sensación térmica: " + Math.round(this.dataset.sensacao) + "°";
              document.querySelector("#climaNome").textContent = "Clima: " + this.dataset.clima;
          }

          atualizarImagem(this.dataset.clima);

          if(eNoite) noite();
          else {
              if(this.dataset.clima === "ensolarado" || this.dataset.clima === "céu limpo") {
                  climaFocado.style.background = "linear-gradient(45deg, rgba(1,170,231,1) 75%, rgba(249,187,84,1) 92%, rgba(255,241,0,1) 100%)";
              } else if(this.dataset.clima.includes("chuva")) {
                  climaFocado.style.background = "linear-gradient(#01678b,#43cdff)";
              } else {
                  climaFocado.style.background = "linear-gradient(#009ad1, #43cdff)";
              }
              body.style.background = "#18a7db";
              form.style.backgroundColor = "#18a7db";
          }

          days.forEach(d => d.classList.remove('dia-selecionado'));
          this.classList.add('dia-selecionado');
      });
  });
}

function translatePortugues(umidade, vento, sensacao, clima){
  const button = document.querySelector("#pt");
  button.addEventListener('click', function(){
      document.querySelector("#umid").textContent = "Umidade: " + umidade + "%";
      document.querySelector("#vento").textContent = "Vento: " + vento + " km/h";
      document.querySelector("#sensacao").textContent = "Sensação térmica: " + sensacao + "°";
      document.querySelector("#climaNome").textContent = "Clima: " + clima;
      lingua = "pt";
      atualizarDiasSemana();
  });
}

function translateEnglish(umidade, vento, sensacao, clima){
  const button = document.querySelector("#english");
  button.addEventListener('click', function(){
      document.querySelector("#umid").textContent = "Umidity: " + umidade + "%";
      document.querySelector("#vento").textContent = "Wind speed: " + vento + " km/h";
      document.querySelector("#sensacao").textContent = "Feels like: " + sensacao + "°";
      document.querySelector("#climaNome").textContent = "Climate: " + clima;
      lingua = "en";
      atualizarDiasSemana();
  });
}

function translateSpanish(umidade, vento, sensacao, clima){
  const button = document.querySelector("#spanish");
  button.addEventListener('click', function(){
      document.querySelector("#umid").textContent = "Humidad: " + umidade + "%";
      document.querySelector("#vento").textContent = "Velocidad del viento: " + vento + " km/h";
      document.querySelector("#sensacao").textContent = "Sensación térmica " + sensacao + "°";
      document.querySelector("#climaNome").textContent = "Clima: " + clima;
      lingua = "es";
      atualizarDiasSemana();
  });
}

function atualizarImagem(desc){
  const imgsrc = document.querySelector(".imagem-focado");
  
  switch(desc) {
    case "algumas nuvens": imgsrc.src = "imagens/poucas_nuvensss.gif"; break;
    case "nublado": imgsrc.src = "imagens/nubladoer.gif"; break;
    case "chuva forte": imgsrc.src = "imagens/chuva_forte.gif"; break;
    case "chuva leve": imgsrc.src = "imagens/chuva.gif"; break;
    case "chuva moderada": imgsrc.src = "imagens/nubladoer.gif"; break;
    case "céu limpo": imgsrc.src = eNoite ? "imagens/lua.gif" : "imagens/suner.gif"; break;
    case "ensolarado": imgsrc.src = eNoite ? "imagens/lua.gif" : "imagens/suner.gif"; break;
    case "nuvens dispersas": imgsrc.src = "imagens/poucas_nuvens.gif"; break;     
    default: imgsrc.src = "imagens/snow.gif"; break;
  }
}

function atualizarImagemDia(selector, descricao) {
  var imgsrc = document.querySelector(selector);
  switch(descricao) {
      case "algumas nuvens": imgsrc.src = "imagens/poucas_nuvens.gif"; break;
      case "nublado": imgsrc.src = "imagens/nublado.gif"; break;
      case "chuva forte": imgsrc.src = "imagens/chuva_forte.gif"; break;
      case "chuva leve": imgsrc.src = "imagens/chuva.gif"; break;
      case "chuva moderada": imgsrc.src = "imagens/nublado.gif"; break;
      case "céu limpo": imgsrc.src = "imagens/sun.gif"; break;
      case "ensolarado": imgsrc.src = "imagens/sun.gif"; break;
      case "nuvens dispersas": imgsrc.src = "imagens/poucas_nuvens.gif"; break;
      default: imgsrc.src = "imagens/snow.gif"; break;
  }
}

function noite(){
  climaFocado.style.background = "url(imagens/night.png), linear-gradient(#01344d,#014d6e)";
  climaFocado.style.backgroundSize = "cover";
  body.style.background = "linear-gradient(#01344d ,#014d6e)";
  form.style.backgroundColor = "#01344d";
}

function atualizarDiasSemana() {
  const date = new Date();
  const days = document.querySelectorAll('.dia-semana');
  document.querySelector("#dia-um").innerHTML = somaDia(date, 1);
  document.querySelector("#dia-dois").innerHTML = somaDia(date, 2);
  document.querySelector("#dia-tres").innerHTML = somaDia(date, 3);
  document.querySelector("#dia-quatro").innerHTML = somaDia(date, 4);
  document.querySelector("#dia-cinco").innerHTML = somaDia(date, 5);
}