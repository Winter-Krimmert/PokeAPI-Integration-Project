document.addEventListener('DOMContentLoaded', function() {
    // Initialize the team array from localStorage, or an empty array if not present
    let teamPokemon = JSON.parse(localStorage.getItem('teamPokemon')) || [];

    // Display initial team members on page load
    updateTeamUI();

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

    // Asynchronously fetch Pokemon data from the API
    async function fetchPokemonData(pokemonName) {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Pokemon not found!');
            }
            const data = await response.json();
            console.log('Pokemon data fetched:', data); // Debugging line
            // Display fetched Pokemon card
            displayPokemonCard(data);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
            // Display error message if Pokemon data fetch fails
            displayError();
        }
    }

    // Display the Pokemon card in the UI
    function displayPokemonCard(data) {
        const pokemonInfoContainer = document.getElementById('pokemon-info');
        // Clear previous results
        pokemonInfoContainer.innerHTML = '';
        const card = createPokemonCard(data);
        pokemonInfoContainer.appendChild(card);

        // Add hover effect to the Pokemon card
        card.addEventListener('mouseover', function() {
            card.classList.add('hover');
        });

        card.addEventListener('mouseout', function() {
            card.classList.remove('hover');
        });

        // Add event listener to view details button
        const detailsLink = card.querySelector('.btn-details');
        detailsLink.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the card click event from bubbling
            localStorage.setItem('selectedPokemon', JSON.stringify(data));
            window.location.href = 'details.html'; // Redirect to details page
        });

        // Add Pokemon to team when clicked on card (excluding details button)
        card.addEventListener('click', function(event) {
            if (!event.target.closest('.btn-details')) {
                addToTeam(data);
            }
        });
    }

    // Create a Pokemon card DOM element
    function createPokemonCard(data) {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3', 'pokemon-card');

        const row = document.createElement('div');
        row.classList.add('row', 'no-gutters');

        // Create and configure Pokemon image element
        const colImg = document.createElement('div');
        colImg.classList.add('col-md-4');
        const img = document.createElement('img');
        img.src = data.sprites.other['official-artwork'].front_default;
        img.classList.add('card-img');
        img.alt = data.name;
        colImg.appendChild(img);
        row.appendChild(colImg);

        // Create and configure Pokemon card body
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
        detailsLink.classList.add('btn', 'btn-primary', 'btn-details');
        detailsLink.textContent = 'Details';
        // Handle click event to view details of the Pokemon
        detailsLink.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the card click event from bubbling
            localStorage.setItem('selectedPokemon', JSON.stringify(data));
            window.location.href = 'details.html'; // Redirect to details page
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

    // Retrieve Pokemon types as a comma-separated string
    function getPokemonTypes(types) {
        return types.map(type => type.type.name).join(', ');
    }

    // Display error message when Pokemon data fetch fails
    function displayError() {
        const pokemonInfoContainer = document.getElementById('pokemon-info');
        // Clear previous results
        pokemonInfoContainer.innerHTML = '';
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('alert', 'alert-danger');
        errorMessage.textContent = 'Pokemon not found! Please try another name or ID.';
        pokemonInfoContainer.appendChild(errorMessage);
    }

    // Function to add Pokemon to the team
    function addToTeam(pokemonData) {
        if (!teamPokemon.some(pokemon => pokemon.id === pokemonData.id)) {
            teamPokemon.push(pokemonData);
            // Update localStorage with the updated team data
            localStorage.setItem('teamPokemon', JSON.stringify(teamPokemon));
            updateTeamUI();
        } else {
            console.log('Pokemon is already in the team!');
        }
    }

    // Function to update the team UI
    function updateTeamUI() {
        const teamResultContainer = document.getElementById('teamResult');
        teamResultContainer.innerHTML = '';

        teamPokemon.forEach(pokemon => {
            const card = createTeamPokemonCard(pokemon);
            teamResultContainer.appendChild(card);
        });
    }

    // Create a Pokemon card for the team
    function createTeamPokemonCard(pokemonData) {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3', 'pokemon-card', 'clicked'); // Optionally add 'clicked' class for styling

        const row = document.createElement('div');
        row.classList.add('row', 'no-gutters');

        // Create and configure Pokemon image element
        const colImg = document.createElement('div');
        colImg.classList.add('col-md-4');
        const img = document.createElement('img');
        img.src = pokemonData.sprites.other['official-artwork'].front_default;
        img.classList.add('card-img');
        img.alt = pokemonData.name;
        colImg.appendChild(img);
        row.appendChild(colImg);

        // Create and configure Pokemon card body
        const colBody = document.createElement('div');
        colBody.classList.add('col-md-8');
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = pokemonData.name;
        const cardText1 = document.createElement('p');
        cardText1.classList.add('card-text');
        cardText1.textContent = `ID: ${pokemonData.id}`;
        const cardText2 = document.createElement('p');
        cardText2.classList.add('card-text');
        cardText2.textContent = `Types: ${getPokemonTypes(pokemonData.types)}`;

        // Create a div to hold the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('d-flex', 'justify-content-start', 'mt-2'); // Align buttons to the left with margin

        // Create details button
        const detailsButton = document.createElement('button');
        detailsButton.classList.add('btn', 'btn-primary', 'btn-details');
        detailsButton.textContent = 'Details';
        // Handle click event to view details of the Pokemon
        detailsButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the card click event from bubbling
            localStorage.setItem('selectedPokemon', JSON.stringify(pokemonData));
            window.location.href = 'details.html'; // Redirect to details page
        });

        // Create remove button
        const removeButton = document.createElement('button');
        removeButton.classList.add('btn', 'btn-danger', 'btn-remove', 'ml-2'); // Add margin-left for spacing
        removeButton.textContent = 'Remove';
        removeButton.style.backgroundColor = '#ff6f61'; // Adjust color as needed

        // Handle click event to remove Pokemon from the team
        removeButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the card click event from bubbling
            removeFromTeam(pokemonData); // Assuming `pokemonData` is defined elsewhere
        });

        // Append buttons to the button container
        buttonContainer.appendChild(detailsButton);
        buttonContainer.appendChild(removeButton);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText1);
        cardBody.appendChild(cardText2);
        cardBody.appendChild(buttonContainer); // Append button container to card body
        colBody.appendChild(cardBody);
        row.appendChild(colBody);
        card.appendChild(row);

        return card;
    }

    // Function to remove Pokemon from the team
    function removeFromTeam(pokemonData) {
        teamPokemon = teamPokemon.filter(pokemon => pokemon.id !== pokemonData.id);
        // Update localStorage with the updated team data
        localStorage.setItem('teamPokemon', JSON.stringify(teamPokemon));
        updateTeamUI();
    }
});
