var pokemonRepository = (function() {
    /* IIFE (Pokedex-san Array Inside) */
    'use strict';
    var repository = [];
  
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    function addListItem(pokemon) {
      var pokelist = $(
        '.list-group'
      ); /* Place JQuery List Item & Button Tags w/ CSS-Class Styles */
      var listitem = $('<li class="list-group-item"></li>');
      $(pokelist).append(listitem);
      var btn = $(
        '<button class="btn btn-dark" data-toggle="modal" data-target="#PokeModal"></button>'
      );
      $(btn).text(pokemon.name);
      $(listitem).append(btn);
      btn.on('click', function() {
        /* JQuery Click Button, Event Listener for Displaying showDetails Function Properties */
        showDetails(pokemon);
      });
    }
    function showDetails(item) {
      pokemonRepository.loadDetails(item).then(function() {
        showModal(item);
      });
    }
    function add(name) {
      /* For Adding Additional Pokemon Attributes to Pokedex-san Array */
      repository.push(name);
    }
  
    function catchAll() {
      /* Function to Return Pokedex-san Objects in the Array */
      return repository;
    }
  
    function loadList() {
      return $.ajax(apiUrl, { dataType: 'json' })
        .then(function(item) {
          /* Replaced Fetch Option w/ Ajax Option */
  
          $.each(item.results, function(index, item) {
            var pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        })
        .catch(function(error) {
          /* Load Functions (in Order) for (Pokemon API) Data Retrieval */
          document.write(error);
        });
    }
    function loadDetails(item) {
      var url = item.detailsUrl;
      return $.ajax(url)
        .then(function(details) {
          /* Replaced Fetch Option w/ Ajax Option */
          item.imageUrl = details.sprites.front_default;
          item.height = details.height;
          item.weight = details.weight;
          item.types = Object.keys(details.types);
        })
        .catch(function(error) {
          document.write(error);
        });
    }
    /* Begin Jquery Model Definition */
    function showModal(item) {
      $('#pokeName').text(item.name);
      $('#pokeImg').attr('src', item.imageUrl);
      $('#pokeHeight').text('Height: ' + item.height);
      $('#pokeWeight').text('Weight: ' + item.weight);
    }
    /* End Jquery Model Definition */
    return {
      /* All Previous Functions Returned (in Order) Available Outside of the IIFE */
      add: add,
      catchAll: catchAll,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails
    };
  })();
  
  pokemonRepository.loadList().then(function() {
    'use strict';
    pokemonRepository.catchAll().forEach(function(pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
  });