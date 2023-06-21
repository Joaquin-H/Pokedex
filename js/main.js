const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const URL = "https://pokeapi.co/api/v2/pokemon/";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Funcion que se encarga de realizar solicitudes a la api

function traerInfo(func) {
    //el parametro func es el que pasaremos para crear cada div de cada pokemon
    // el array requests almacena todas las promesas de las solicitudes HTTP a la API
    const requests = [];

    // se realiza un bucle para iterar y se agrega una promesa a requests por cada numero de pokemon
    for (let i = 1; i < 152; i++) {
        // las promesas se crean utilizando fetch
        requests.push(fetch(URL + i).then((response) => response.json()));
    }
    // promise.all(requests) se utiliza para esperar que todas las promesas se resuelvan.
    Promise.all(requests).then((data) => {
        //creamos un document fragment (nodo especial utilizado para contener otros nodos)
        const fragment = document.createDocumentFragment();
        //le aplicamos a cada pokemon la funcion crearPokemon, agregamos cada pokemon al fragment y el fragment a la lista
        data.forEach((pokemon) => {
            const pokemonElement = func(pokemon);
            fragment.appendChild(pokemonElement);
        });

        listaPokemon.appendChild(fragment);
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// funcion utilizada para crear pokemon 
// toma un objeto pokemon que contiene toda la info

function crearPokemon(pokemon) {
    //creamos un div y le agregamos la clase pokemon

    const div = document.createElement("div");
    div.classList.add("pokemon");

    // extraemos los tipos del pokemon y creamos un fragmento de html con los tipos como <p></p>

    const tipos = pokemon.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`).join('');
    const id = pokeID(pokemon.id);
    div.setAttribute("data-tipo", pokemon.types[0].type.name); 

    // construimos el contenido HTML del elemtno div utilizando una plantilla
    div.innerHTML = `
        <p class="pokemon-id-back">#${id}</p>
        <div class="pokemon-imagen">
        <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
        </div>
        <div class="pokemon-info">
        <div class="nombre-contenedor">
            <p class="pokemon-id">#${id}</p>
            <h2 class="pokemon-nombre">${pokemon.name}</h2>
        </div>
        <div class="pokemon-tipos">
            ${tipos}
        </div>
        <div class="pokemon-stats">
            <p class="stat">${pokemon.height}M</p>
            <p class="stat">${pokemon.weight}KG</p>
        </div>
        </div>
    `;
    return div;
}

// funcion que toma un numero de id y formatea para que siempre tenga 3 digitos
function pokeID(id) {
let pokemonId = id.toString();
if (pokemonId.length === 1) {
    pokemonId = "00" + id;
} else if (pokemonId.length === 2) {
    pokemonId = "0" + id;
}
return pokemonId;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// funcion que se ejecuta al darle click a un boton, toma el boton y le añade un event listener (filtrar pokemon)
function filtrado() {
    botonesHeader.forEach((boton) => boton.addEventListener("click", filtrarPokemon));
    }

// funcion que se ejecuta al dar clic a cada uno de los botones
function filtrarPokemon(event) {
    //extraemos el id del boton
    const botonId = event.currentTarget.id;
    //borramos el contenido de la lista para cargarla con los pokemon filtrados
    listaPokemon.innerHTML = "";
    filtrarInfo(crearPokemon, botonId);
}

// es similar a traerInfo pero filtramos los pokemon por un boton Id
function filtrarInfo(func, botonId) {
    const requests = [];

    for (let i = 1; i < 152; i++) {
        requests.push(fetch(URL + i).then((response) => response.json()));
    }

    Promise.all(requests).then((data) => {
        const fragment = document.createDocumentFragment();

        data.forEach((pokemon) => {
            const tipos = pokemon.types.map((type) => type.type.name);
            if (botonId === "ver-todos" || tipos.includes(botonId)) {
                const pokemonElement = func(pokemon);
                if (pokemonElement instanceof Node) {
                    fragment.appendChild(pokemonElement);
                }
            }
        });
        listaPokemon.appendChild(fragment);
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

traerInfo(crearPokemon);
filtrado();
