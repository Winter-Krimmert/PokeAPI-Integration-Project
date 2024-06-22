
/** should be for search page as well as local storage and display page*/





// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Check if we are on the details page and display the Pokémon details
    if (window.location.pathname.endsWith('details.html')) {
        displayPokemonDetails();
    }

    // Get the form element from the HTML
    const form = document.getElementById('pokemon-search-form');

    // Check if the form element exists
    if (form) {
        // Add an event listener to handle form submission
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission behavior
            const pokemonName = document.getElementById('pokemonName').value.toLowerCase().trim(); // Get the entered Pokémon name and convert it to lowercase
            fetchPokemonData(pokemonName); // Fetch the Pokémon data
        });
    } else {
        console.error('Form element not found.');
    }
});

// Function to fetch Pokémon data from the API and store it in localStorage
async function fetchPokemonData(pokemonName) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Pokemon not found!');
        }
        const data = await response.json();

        // Display the Pokémon card on the search page
        displayPokemonCard(data);
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        displayError(); // Display an error message to the user
    }
}

// Function to display selected Pokémon data on the details page
function displayPokemonDetails() {
    const pokemonData = JSON.parse(localStorage.getItem('selectedPokemon'));
    if (pokemonData) {
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
}

// Function to display the fetched Pokémon information as a card on the search page
function displayPokemonCard(data) {
    const pokemonInfoContainer = document.getElementById('pokemon-info'); // Get the container to display Pokémon info
    const card = createPokemonCard(data); // Create a Pokémon card with the fetched data
    pokemonInfoContainer.appendChild(card); // Append the new card to the container
}

// Function to create a Pokémon card element
function createPokemonCard(data) {
    const card = document.createElement('div'); // Create a div element for the card
    card.classList.add('card', 'mb-3'); // Add Bootstrap card classes
    card.style.maxWidth = '540px'; // Set the max width of the card

    const row = document.createElement('div'); // Create a div element for the row
    row.classList.add('row', 'no-gutters'); // Add Bootstrap row classes

    const colImg = document.createElement('div'); // Create a div element for the image column
    colImg.classList.add('col-md-4'); // Add Bootstrap column classes

    const img = document.createElement('img'); // Create an img element for the Pokémon image
    img.src = data.sprites.other['official-artwork'].front_default; // Set the image source to the official artwork
    img.classList.add('card-img'); // Add Bootstrap card image class
    img.alt = data.name; // Set the alt text for the image

    colImg.appendChild(img); // Append the image to the image column
    row.appendChild(colImg); // Append the image column to the row

    const colBody = document.createElement('div'); // Create a div element for the body column
    colBody.classList.add('col-md-8'); // Add Bootstrap column classes

    const cardBody = document.createElement('div'); // Create a div element for the card body
    cardBody.classList.add('card-body'); // Add Bootstrap card body class

    const cardTitle = document.createElement('h5'); // Create an h5 element for the card title
    cardTitle.classList.add('card-title'); // Add Bootstrap card title class
    cardTitle.textContent = data.name; // Set the card title to the Pokémon name

    const cardText1 = document.createElement('p'); // Create a p element for the Pokémon ID
    cardText1.classList.add('card-text'); // Add Bootstrap card text class
    cardText1.textContent = `ID: ${data.id}`; // Set the text to display the Pokémon ID

    const cardText2 = document.createElement('p'); // Create a p element for the Pokémon types
    cardText2.classList.add('card-text'); // Add Bootstrap card text class
    cardText2.textContent = `Types: ${getPokemonTypes(data.types)}`; // Set the text to display the Pokémon types

    const detailsLink = document.createElement('button'); // Create a button element for the details link
    detailsLink.classList.add('btn', 'btn-primary'); // Add Bootstrap button classes
    detailsLink.textContent = 'View Details'; // Set the button text
    detailsLink.addEventListener('click', function() {
        localStorage.setItem('selectedPokemon', JSON.stringify(data)); // Store the data in localStorage
        window.location.href = 'details.html'; // Redirect to the details page
    });

    cardBody.appendChild(cardTitle); // Append the card title to the card body
    cardBody.appendChild(cardText1); // Append the Pokémon ID to the card body
    cardBody.appendChild(cardText2); // Append the Pokémon types to the card body
    cardBody.appendChild(detailsLink); // Append the details link to the card body

    colBody.appendChild(cardBody); // Append the card body to the body column
    row.appendChild(colBody); // Append the body column to the row

    card.appendChild(row); // Append the row to the card

    return card; // Return the created card
}

// Function to get Pokémon types as a comma-separated string
function getPokemonTypes(types) {
    return types.map(type => type.type.name).join(', '); // Map the types to their names and join them with commas
}

// Function to display an error message
function displayError() {
    const pokemonInfoContainer = document.getElementById('pokemon-info'); // Get the container to display the error message
    const errorMessage = document.createElement('div'); // Create a div element for the error message
    errorMessage.classList.add('alert', 'alert-danger'); // Add Bootstrap alert classes
    errorMessage.textContent = 'Pokemon not found! Please try another name or ID.'; // Set the error message text
    pokemonInfoContainer.appendChild(errorMessage); // Append the error message to the container
}

/**END OF SEARCH, LOCAL STORAGE, DISPLAY */







/*TEAM Builder*/






// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Team builder functionality
    const teamForm = document.getElementById('teamForm');
    const teamResult = document.getElementById('teamResult');

    // Array to store Pokémon team
    let pokemonTeam = [];

    // Event listener for team form submission
    teamForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const pokemonName = document.getElementById('teamPokemonName').value.trim().toLowerCase();
        if (pokemonName === '') return; // Do nothing if input is empty

        fetchPokemonData(pokemonName); // Fetch Pokémon data
    });

    // Function to fetch Pokémon data from the API
    async function fetchPokemonData(pokemonName) {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Pokemon not found!');
            }
            const data = await response.json();

            // Add Pokémon data to team
            addPokemonToTeam(data);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
            displayError(); // Display error message to user
        }
    }

    // Function to add Pokémon to team
    function addPokemonToTeam(pokemon) {
        pokemonTeam.push(pokemon); // Add Pokémon to team array
        displayTeam(); // Update the displayed team
    }

    // Function to display Pokémon team
    function displayTeam() {
        teamResult.innerHTML = ''; // Clear previous team display

        pokemonTeam.forEach(pokemon => {
            const pokemonCard = createPokemonCard(pokemon);
            teamResult.appendChild(pokemonCard);
        });
    }

// Function to create a more detailed Pokémon card element using DOM manipulation
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card', 'mb-3');

    const cardImg = document.createElement('img');
    cardImg.classList.add('card-img-top');
    cardImg.src = pokemon.sprites.other['official-artwork'].front_default; // Official artwork image
    cardImg.alt = pokemon.name; // Set alt attribute for accessibility

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = pokemon.name; // Pokémon name as card title

    const types = document.createElement('p');
    types.classList.add('card-text', 'mb-2');
    types.textContent = `Type: ${pokemon.types.map(type => type.type.name).join(', ')}`; // Display types

    const abilities = document.createElement('p');
    abilities.classList.add('card-text', 'mb-2');
    abilities.textContent = `Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}`; // Display abilities

    const stats = document.createElement('ul');
    stats.classList.add('list-group', 'list-group-flush');
    pokemon.stats.forEach(stat => {
        const statItem = document.createElement('li');
        statItem.classList.add('list-group-item');
        statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
        stats.appendChild(statItem);
    });

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardImg); // Add image before other details
    cardBody.appendChild(types);
    cardBody.appendChild(abilities);
    cardBody.appendChild(stats);

    card.appendChild(cardBody);

    return card;
}

    // Function to remove Pokémon from team
    function removePokemonFromTeam(pokemon) {
        pokemonTeam = pokemonTeam.filter(p => p !== pokemon);
        displayTeam();
    }

    // Function to display an error message
    function displayError() {
        teamResult.innerHTML = '<p class="text-danger">Pokemon not found! Please try again.</p>';
    }
});





/*TEAM BUILDER END*/
