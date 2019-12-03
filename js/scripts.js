var pokemonRepository = (function() {    //* Begin IIFE
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  var $pokemonList = $('ul');

  //* Function for adding new Pokemon data
  function add(pokemon) {
    // Needs to be an 'object' type
    if (typeof pokemon !== 'object') {
      return 'Not a valid input'
    }else{
    repository.push(pokemon);
    }
  }

  //* Function for pulling all Pokemon data
  function getAll() {
    return repository;
  }

  //* Function for adding a list for each Pokemon object
  function addListItem(pokemon) {
    var $listItem = $('<li></li>');
    $pokemonList.append($listItem);
    var $button = $('<button type="button" id="pokemon-button" class="btn btn-outline-light" data-toggle="modal" data-target="#exampleModalCenter">' + pokemon.name + '</button>');
    $listItem.append($button);
    $button.on('click', function() {
      showDetails(pokemon)
    })
  }

  //* Function for loading Pokemon list from the API
  function loadList() {
    return $.ajax(apiUrl, {dataType: 'json'}).then(function(responseJSON) {
      return responseJSON;
    }).then(function(json) {
      json.results.forEach(function(item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function(e) {
      console.error(e);
    })
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url, {dataType: 'json'}).then(function(responseJSON) {
      return responseJSON;
    }).then(function(details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight;
      item.types = Object.keys(details.types);
    }).catch(function(e) {
      console.error(e);
    })
  }

  //* Function for showing modal for Pokemon data
  function showModal(item) {
    console.log('TCL: showModal -> item', item.imageUrl);

    //* Create element for Pokemon name
    var $nameElement = $('h5');
    $nameElement.html(item.name.charAt(0).toUpperCase() + item.name.slice(1));

    var $imageElement = $('<img src="' + item.imageUrl + '">')
    $('div.pokemon-img').html($imageElement)

    var $heightElement = $('div.pokemon-info');
    $heightElement.html('Height: ' + item.height);
  }

  //* Function for showing each Pokemons' details
  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
      console.log(item);
      return item;
    }).then(function(item) {
      console.log('TCL: showDetails -> item', item);
      showModal(item);
    });
  }

  return{
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal,
  };
})();


//* Creates Pokemon list with Pokemon's name on the button
pokemonRepository.loadList().then(function() {
  //* All the requisite data is loaded
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});