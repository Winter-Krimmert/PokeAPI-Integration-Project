// Wait for the DOM content to load before executing
document.addEventListener('DOMContentLoaded', function() {
    // Check if the current page is details.html
    if (window.location.pathname.endsWith('details.html')) {
        // Retrieve selected Pokemon data from localStorage
        const selectedPokemon = JSON.parse(localStorage.getItem('selectedPokemon'));
        if (selectedPokemon) {
            // Display details of the selected Pokemon
            displayPokemonDetails(selectedPokemon);
        } else {
            // Handle error if selectedPokemon is null or undefined
            console.error('No selected Pokémon found in localStorage.');
            displayError();
        }
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
        const card = createPokemonCard(data);
        pokemonInfoContainer.appendChild(card);

        // Add hover effect to the Pokemon card
        card.addEventListener('mouseover', function() {
            card.classList.add('hover');
        });

        card.addEventListener('mouseout', function() {
            card.classList.remove('hover');
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
        detailsLink.classList.add('btn', 'btn-primary');
        detailsLink.textContent = 'View Details';
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
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('alert', 'alert-danger');
        errorMessage.textContent = 'Pokemon not found! Please try another name or ID.';
        pokemonInfoContainer.appendChild(errorMessage);
    }
});

// Function to display detailed information about a Pokemon
function displayPokemonDetails(pokemonData) {
    document.getElementById('pokemonImage').src = pokemonData.sprites.other['official-artwork'].front_default;
    document.getElementById('pokemonName').textContent = pokemonData.name;
    document.getElementById('pokemonDescription').textContent = `Some quick details about ${pokemonData.name}.`;
    document.getElementById('pokemonType').textContent = `Type: ${pokemonData.types.map(type => type.type.name).join(', ')}`;
    document.getElementById('pokemonAbilities').textContent = `Abilities: ${pokemonData.abilities.map(ability => ability.ability.name).join(', ')}`;

    const statsList = document.getElementById('statsList');
    statsList.innerHTML = '';
    pokemonData.stats.forEach(stat => {
        const statItem = document.createElement('li');
        statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
        statsList.appendChild(statItem);
    });
}


/* toggle the team section on the battle simulator page*/

document.getElementById('toggleTeamBtn').addEventListener('click', function() {
    const pokemonTeam = document.getElementById('pokemonTeam');
    const isCollapsed = pokemonTeam.classList.toggle('collapsed');
    this.textContent = isCollapsed ? 'Show Team' : 'Hide Team';
});

// Handle the battle form submission
document.getElementById('battleForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Add your battle simulation logic here
    // Hide the team section after starting the battle
    document.getElementById('pokemonTeam').classList.add('collapsed');
    document.getElementById('toggleTeamBtn').textContent = 'Show Team';
    // Show battle results
});
