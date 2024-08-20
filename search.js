// search.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('pokemon-search-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const pokemonName = document.getElementById('pokemonName').value.toLowerCase().trim();
            fetchPokemonData(pokemonName);
        });
    }

    async function fetchPokemonData(pokemonName) {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Pokemon not found!');
            }
            const data = await response.json();
            console.log('Pokemon data fetched:', data); // Debugging line
            displayPokemonCard(data);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
            displayError();
        }
    }

    function displayPokemonCard(data) {
        const pokemonInfoContainer = document.getElementById('pokemon-info');
        const card = createPokemonCard(data);
        pokemonInfoContainer.appendChild(card);

        // Add hover effect
        card.addEventListener('mouseover', function() {
            card.classList.add('hover');
        });

        card.addEventListener('mouseout', function() {
            card.classList.remove('hover');
        });
    }

    function createPokemonCard(data) {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3', 'pokemon-card');

        const row = document.createElement('div');
        row.classList.add('row', 'no-gutters');

        const colImg = document.createElement('div');
        colImg.classList.add('col-md-4');

        const img = document.createElement('img');
        img.src = data.sprites.other['official-artwork'].front_default;
        img.classList.add('card-img');
        img.alt = data.name;

        colImg.appendChild(img);
        row.appendChild(colImg);

        const colBody = document.createElement('div');
        colBody.classList.add('col-md-8');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = data.name;

        const cardText1 = document.createElement('p');
        cardText1.classList.add('card-text');
        cardText1.textContent = `ID: ${data.id}`;

        const cardText2 = document.createElement('p');
        cardText2.classList.add('card-text');
        cardText2.textContent = `Types: ${getPokemonTypes(data.types)}`;

        const detailsLink = document.createElement('button');
        detailsLink.classList.add('btn', 'btn-primary');
        detailsLink.textContent = 'View Details';
        detailsLink.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the card click event
            localStorage.setItem('selectedPokemon', JSON.stringify(data));
            window.location.href = 'details.html';
        });

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText1);
        cardBody.appendChild(cardText2);
        cardBody.appendChild(detailsLink);

        colBody.appendChild(cardBody);
        row.appendChild(colBody);

        card.appendChild(row);

        return card;
    }

    function getPokemonTypes(types) {
        return types.map(type => type.type.name).join(', ');
    }

    function displayError() {
        const pokemonInfoContainer = document.getElementById('pokemon-info');
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('alert', 'alert-danger');
        errorMessage.textContent = 'Pokemon not found! Please try another name or ID.';
        pokemonInfoContainer.appendChild(errorMessage);
    }
});

    // Add event listener to the search form if it exists
    const form = document.getElementById('pokemon-search-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            // Retrieve and clean up the entered Pokemon name
            const pokemonName = document.getElementById('pokemonName').value.toLowerCase().trim();
            // Fetch data for the entered Pokemon
            fetchPokemonData(pokemonName);
        });
    }