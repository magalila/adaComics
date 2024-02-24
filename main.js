
const searchInput = document.getElementById('disabledTextInput');

const btnBuscar = document.getElementById('btn-buscar');
const apiKey = "4312029a38b88aff37f0cb97247e4368"; //public key
const privateKey = "abec986f68b454f2c40036ad6be811cfa7848933";
const ts = Date.now(); // fecha actual "02/02/2024, 13:44:59";
const hash = md5(`${ts}${privateKey}${apiKey}`);//"25f31ceda42b5ad674ef508610f60113"; 
//para generar hash fechapublicKeyprivateKey

const url = `https://gateway.marvel.com:443/v1/public/series?ts=${ts}&apikey=${apiKey}&hash=${hash}`;
const main = document.getElementById("main");
//me va a traer la data y la va a formatear en json 
fetch(url)
  .then((response) => response.json())
  .then((response) => printData(response.data.results))
  .catch((err) => console.log("Se ha producido un error: ", err));

const printData = (personajes) => {
  //   console.log(personajes.lenght);
  let str = '<div class="row">';
  let i = 0;
  let title = [];
  let comics = [];
  let bio = [];
  for (i = 0; i < 20; i++) {
    title[i] = personajes[i].title;
    comics[i] =
      personajes[i].thumbnail.path + "." + personajes[i].thumbnail.extension;
    bio[i] = personajes[i].description;
    if (!title[i]) {
      title[i] = "Im sorry, but this heroe has not name";
    }
    if (!comics[i]) {
      comics[i] = "Im sorry, but this heroe has not name";
    }
    if (!bio[i]) {
      bio[i] = "Im sorry, but this heroe has not name";
    }
    str =
      str +
      `
      <div class="col-md-3">
      <div class="col-sm-12">
          <img src="${comics[i]}" alt="${title[i]}" class="img-fluid" style="max-width: 100%; max-height: 100%;">
          <h5 class="title text-light">${title[i]}</h5>
        </div>
        </div>
      `;
  }
  str = str + "</div>";
  main.innerHTML = str;
};




function displayResults(results) {
    const main = document.getElementById("main");
    let html = '<div class="row">';
   
    results.forEach(result => {
        const thumbnail = result.thumbnail ? `${result.thumbnail.path}.${result.thumbnail.extension}` : 'placeholder.jpg';
        let valor = result.title|| 'No title available';//result.title si es por comics result.name si es por personajes
        const selectedType = selectTipo.value;
        const searchTerm = searchInput.value;
        const selectedOrder = selectOrden.value;
        const {  altAttribute } = buildMarvelApiUrl(selectedType, searchTerm, selectedOrder)
        if( altAttribute === 'name'){
          valor = result.name|| 'No title available';//result.title si es por comics result.name si es por personajes
        }
        html += `
        <div class="col-md-3">
        <div class="col-sm-7">
            <img src="${thumbnail}" alt="${valor}" class="img-fluid" ">
            <h5 class="title text-light">${valor}</h5>
          </div>
          </div>
        `;
    });
    html += '</div>';
    main.innerHTML = html;
}



// Función para buscar en la API de Marvel
async function searchInMarvelApi(url) {
  try {
      const response = await fetch(url);
      const data = await response.json();
      displayResults(data.data.results);
  } catch (error) {
      console.error('Error al buscar en la API de Marvel:', error);
  }
}

// Función para construir la URL de la API según el tipo seleccionado
function buildMarvelApiUrl(selectedType, searchTerm, selectedOrder) {
  let apiUrl = '';
  let altAttribute = '';
  if (selectedType === '1') {
      apiUrl = `https://gateway.marvel.com:443/v1/public/series?titleStartsWith=${searchTerm}&apikey=${apiKey}&ts=${ts}&hash=${hash}`;
      altAttribute = 'title';
  } else if (selectedType === '2') {
      apiUrl = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${searchTerm}&apikey=${apiKey}&ts=${ts}&hash=${hash}`;
      altAttribute = 'name';
  }
  if (selectedOrder === '1') {
    console.log("hola soy el orden", selectedOrder, "ordenar de A-Z")
  //   // Ordenar alfabéticamente de la A a la Z
  //   let results = data.data.results;
  //   results.sort((a, b) => {
  //     const titleA = a[altAttribute].toUpperCase();
  //     const titleB = b[altAttribute].toUpperCase();
  //     if (titleA < titleB) return -1;
  //     if (titleA > titleB) return 1;
      
  //   });
  }else if(selectedOrder === '2'){
    console.log("hola soy el orden", selectedOrder, "ordenar de Z-A")
  }else if(selectedOrder === '3'){
    console.log("hola soy el orden", selectedOrder, "ordenar mas nuevo");
  }
  else if(selectedOrder === '4'){
    console.log("hola soy el orden", selectedOrder, "ordenar mas viejo");
  }
  return {apiUrl, altAttribute};
}

// Función para manejar el cambio en el tipo seleccionado
const selectTipo = document.querySelector('#select-tipo');
function handleTypeChange() {
  const selectedType = selectTipo.value;
  const searchTerm = searchInput.value;
  const selectedOrder = selectOrden.value;
  const { apiUrl, altAttribute } = buildMarvelApiUrl(selectedType, searchTerm, selectedOrder);
  searchInMarvelApi(apiUrl)
  
}

// Event listener para el cambio en el tipo seleccionado
selectTipo.addEventListener('change', handleTypeChange);

// Event listener para el botón de búsqueda
btnBuscar.addEventListener('click', () => {
  const searchTerm = searchInput.value;
  if (searchTerm.length > 2) {
      const apiUrl = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${searchTerm}&apikey=${apiKey}&ts=${ts}&hash=${hash}`;
      searchInMarvelApi(apiUrl);
  }
});


const selectOrden = document.querySelector('#select-orden');
// Event listener para el cambio en el select-orden
selectOrden.addEventListener('change', handleTypeChange);
