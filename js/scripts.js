var pokemonRepository = (() => {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
  var $modalContainer = document.querySelector('.modal');
  var $overlay = document.querySelector(".overlay");

  function loadList() {
    return fetch(apiUrl)
      .then(res => res.json())
      .then(pokemonList => {
        var response = pokemonList.results;
        response.forEach(item => {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      }).catch(err => {
        console.log(err);
      });
  }

  function add(item) {
    repository.push(item);
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return fetch(url)
      .then(res => res.json())
      .then(details => {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
      }).catch(err => console.log(err))
  }

  function addListItem(pokemon) {
    var $pokemonList = document.querySelector("ul");
    var $listItem = document.createElement("li");
    var $button = document.createElement("button");

    $button.innerText = pokemon.name;
    $button.classList.add("list-button");
    $pokemonList.appendChild($listItem);
    $listItem.appendChild($button)
    addListener($button, pokemon);
  }

function addListener(button, pokemon) {
  button.addEventListener("click", (e) => {
      showDetails(pokemon);
    });
  }
  
function showDetails(item) {
  var $pokemonName = document.querySelector(".pokemon-name");
  var $pokemonImg = document.querySelector(".pokemon-img");
  var $pokemonHeight = document.querySelector(".pokemon-height");
  pokemonRepository.loadDetails(item)
    .then(() => {
       $modalContainer.classList.add("modal-visible");
       $overlay.classList.add("overlay-visible");
       $modalContainer.classList.remove("modal");
       $pokemonName.textContent = item.name;
       $pokemonImg.src = item.imageUrl;
       $pokemonHeight.textContent = item.height;
       console.log(item)
    });
}

function hideDetails() {
    $modalContainer.classList.remove("modal-visible");
    $overlay.classList.remove("overlay-visible");
    $modalContainer.classList.add("modal");
  }

  document.querySelector(".modal-close").addEventListener("click", () => {
    hideDetails();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $modalContainer.classList.contains('modal-visible')) {
      hideDetails();
    }
  });

  $overlay.addEventListener('click', (e) => {
    var target = e.target;
    console.log(target);
    if (target === $overlay) {
      hideDetails();
    }
  });
  
function getAll() {
  return repository;
}

return {
  loadList: loadList,
  loadDetails: loadDetails,
  addListItem: addListItem,
  getAll: getAll
};
})();

pokemonRepository.loadList()
  .then(() => {
    pokemonRepository.getAll().forEach(pokemon => {
      pokemonRepository.addListItem(pokemon);
    });
  }); 
