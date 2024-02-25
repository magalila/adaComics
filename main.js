const searchInput = document.getElementById("disabledTextInput");

const btnBuscar = document.getElementById("btn-buscar");
const apiKey = "4312029a38b88aff37f0cb97247e4368"; //public key
const privateKey = "abec986f68b454f2c40036ad6be811cfa7848933";
const ts = Date.now(); // fecha actual "02/02/2024, 13:44:59";
const hash = md5(`${ts}${privateKey}${apiKey}`); //"25f31ceda42b5ad674ef508610f60113";
//para generar hash fechapublicKeyprivateKey

const url = `https://gateway.marvel.com:443/v1/public/series?ts=${ts}&apikey=${apiKey}&hash=${hash}`;
const main = document.getElementById("main");
//trae la data y formatea en json
fetch(url)
  .then((response) => response.json())
  .then((response) => printData(response.data.results))
  .catch((err) => console.log("Se ha producido un error: ", err));

// tarjeta personaje
const createCard= (thumbnail, title) => {
  return `
      <div class="col-md-3 col-sm-6 mb-6";>
          <div class="col-sm-12 mi-clase";>
              <img src="${thumbnail}" alt="${title}" class="img-fluid" >
              <h5 class="h6 text-light mt-2 mb-3">${title}</h5>
          </div>
      </div>
  `;
};

// mis personajes en pantalla
const printData = (personajes) => {
  let str = '<div class="row">';
  for (let i = 0; i < 20; i++) {
    const title = personajes[i].title;
    const thumbnail =
      personajes[i].thumbnail.path + "." + personajes[i].thumbnail.extension;
    str += createCard(thumbnail, title);
  }
  str += "</div>";
  main.innerHTML = str;
};



function displayResults(results) {
  const main = document.getElementById("main");
  let html = '<div class="row">';
  const selectedOrder = selectOrden.value;
  if (selectedOrder === "1") {
    results.sort((a, b) => {
      // ascendente
      const titleA = a.title || "";
      const titleB = b.title || "";
      return titleA.localeCompare(titleB);
    });
  } else if (selectedOrder === "2") {
    results.sort((a, b) => {
      // descendente
      const titleA = a.title || "";
      const titleB = b.title || "";
      return titleB.localeCompare(titleA);
    });}else   if(selectedOrder === '3') {
      // nuevo
      results.sort((a, b) => new Date(b.modified) - new Date(a.modified));
  } else if(selectedOrder === '4') {
      // viejo
      results.sort((a, b) => new Date(a.modified) - new Date(b.modified));
  }
    results.forEach((result) => {
      const thumbnail = result.thumbnail
        ? `${result.thumbnail.path}.${result.thumbnail.extension}`
        : "placeholder.jpg";
      let valor = ""; //result.title si es por comics result.name si es por personajes
      const selectedType = selectTipo.value;
      const searchTerm = searchInput.value;
      let { altAttribute } = MarvelApiUrl(selectedType, searchTerm);
      if (altAttribute === "title") {
        valor = result.title || "No existe el título";
      } else {
        valor = result.name || "No existe el nombre";}
      html += createCard(thumbnail, valor);
    });
    html += "</div>";
    main.innerHTML = html;
  }

  // buscador api
  async function searchInMarvelApi(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      displayResults(data.data.results);
    } catch (error) {
      console.error("Error al buscar en la API de Marvel:", error);
    }
  }

  // mi url
  function MarvelApiUrl(selectedType, searchTerm) {
    let apiUrl = "";
    let altAttribute = "";
    if (selectedType === "1") {
      apiUrl = `https://gateway.marvel.com:443/v1/public/series?titleStartsWith=${searchTerm}&apikey=${apiKey}&ts=${ts}&hash=${hash}`;
      altAttribute = "title";
    } else if (selectedType === "2") {
      apiUrl = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${searchTerm}&apikey=${apiKey}&ts=${ts}&hash=${hash}`;
      altAttribute = "name";
    }
    return { apiUrl, altAttribute };
  }

  //  tipo seleccionado
  const selectTipo = document.querySelector("#select-tipo");
  function typeChange() {
    const selectedType = selectTipo.value;
    const searchTerm = searchInput.value;
    const { apiUrl, altAttribute } = MarvelApiUrl(
      selectedType,
      searchTerm
    );
    searchInMarvelApi(apiUrl);
  }

  selectTipo.addEventListener("change", typeChange);
  
  btnBuscar.addEventListener("click", () => {
    let searchTerm = searchInput.value;
    if (searchTerm.length > 2) {
      const apiUrl = `https://gateway.marvel.com:443/v1/public/series?titleStartsWith=${searchTerm}&apikey=${apiKey}&ts=${ts}&hash=${hash}`;
      searchInMarvelApi(apiUrl);
    }
  });

  const selectOrden = document.querySelector("#select-orden");

  selectOrden.addEventListener("change", typeChange);


  
 


