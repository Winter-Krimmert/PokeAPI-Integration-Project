document.addEventListener('DOMContentLoaded', function() {
    // Initialize the team array from localStorage
    let teamPokemon = JSON.parse(localStorage.getItem('teamPokemon')) || [];

    // Get the toggle button and team container
    const toggleTeamBtn = document.getElementById('toggleTeamBtn');
    const teamResultContainer = document.getElementById('pokemonTeam');

    // Function to display the team Pokémon
    function displayTeam() {
        teamResultContainer.innerHTML = '';

        teamPokemon.forEach(pokemon => {
            const card = createTeamPokemonCard(pokemon);
            teamResultContainer.appendChild(card);
        });
    }

    // Create a Pokémon card for the team
    function createTeamPokemonCard(pokemonData) {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3', 'pokemon-card');
        card.style.cursor = 'pointer'; // Add pointer cursor

        const row = document.createElement('div');
        row.classList.add('row', 'no-gutters');

        // Create and configure Pokémon image element
        const colImg = document.createElement('div');
        colImg.classList.add('col-md-4');
        const img = document.createElement('img');
        img.src = pokemonData.sprites.other['official-artwork'].front_default;
        img.classList.add('card-img');
        img.alt = pokemonData.name;
        colImg.appendChild(img);
        row.appendChild(colImg);

        // Create and configure Pokémon card body
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

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText1);
        cardBody.appendChild(cardText2);
        colBody.appendChild(cardBody);
        row.appendChild(colBody);
        card.appendChild(row);

        // Event listener to enlarge the card and show details
        card.addEventListener('click', function(event) {
            event.stopPropagation();
            enlargeCard(pokemonData);
        });

        return card;
    }

    // Function to enlarge the Pokémon card and show details
    function enlargeCard(pokemonData) {
        // Remove any existing detail card
        const existingDetailCard = document.querySelector('.pokemon-detail-card');
        if (existingDetailCard) {
            existingDetailCard.remove();
        }

        const detailCard = document.createElement('div');
        detailCard.classList.add('card', 'mt-3', 'pokemon-detail-card');
        detailCard.style.position = 'fixed'; // Fix position
        detailCard.style.top = '50%'; // Center vertically
        detailCard.style.left = '50%'; // Center horizontally
        detailCard.style.transform = 'translate(-50%, -50%)'; // Centering transform
        detailCard.style.zIndex = '1000'; // Ensure it's above other content
        detailCard.style.backgroundColor = '#fff'; // Background color
        detailCard.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Add some shadow
        detailCard.style.padding = '20px'; // Padding for detail card
        detailCard.style.maxWidth = '90vw'; // Max width as viewport width
        detailCard.style.maxHeight = '90vh'; // Max height as viewport height
        detailCard.style.overflowY = 'auto'; // Enable vertical scroll if needed
        detailCard.style.overflowX = 'hidden'; // Prevent horizontal scroll

        // Create container for the detail card content with flexbox layout
        const detailContent = document.createElement('div');
        detailContent.style.display = 'flex';
        detailContent.style.flexDirection = 'column';
        detailContent.style.alignItems = 'center';
        detailContent.style.justifyContent = 'center';

        // Create content for the detail card
        const title = document.createElement('h5');
        title.textContent = pokemonData.name;
        title.style.textAlign = 'center';
        title.style.fontSize = '24px'; // Larger font size for clarity

        const img = document.createElement('img');
        img.src = pokemonData.sprites.other['official-artwork'].front_default;
        img.alt = pokemonData.name;
        img.style.width = '80%'; // Adjust width as needed
        img.style.height = 'auto';
        img.style.imageRendering = 'crisp-edges'; // Crisp rendering for high DPI

        const idText = document.createElement('p');
        idText.textContent = `ID: ${pokemonData.id}`;
        idText.style.textAlign = 'center';
        idText.style.fontSize = '18px'; // Larger font size for clarity

        const typesText = document.createElement('p');
        typesText.textContent = `Types: ${getPokemonTypes(pokemonData.types)}`;
        typesText.style.textAlign = 'center';
        typesText.style.fontSize = '18px'; // Larger font size for clarity

        const abilitiesText = document.createElement('p');
        abilitiesText.textContent = `Abilities: ${getPokemonAbilities(pokemonData.abilities)}`;
        abilitiesText.style.textAlign = 'center';
        abilitiesText.style.fontSize = '18px'; // Larger font size for clarity

        const heightText = document.createElement('p');
        heightText.textContent = `Height: ${pokemonData.height / 10} m`; // Height in meters
        heightText.style.textAlign = 'center';
        heightText.style.fontSize = '18px'; // Larger font size for clarity

        const weightText = document.createElement('p');
        weightText.textContent = `Weight: ${pokemonData.weight / 10} kg`; // Weight in kg
        weightText.style.textAlign = 'center';
        weightText.style.fontSize = '18px'; // Larger font size for clarity

        const statsList = document.createElement('ul');
        statsList.textContent = 'Stats:';
        statsList.style.textAlign = 'center';
        statsList.style.fontSize = '18px'; // Larger font size for clarity
        pokemonData.stats.forEach(stat => {
            const listItem = document.createElement('li');
            listItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
            statsList.appendChild(listItem);
        });

        // Append content to detail content container
        detailContent.appendChild(title);
        detailContent.appendChild(img);
        detailContent.appendChild(idText);
        detailContent.appendChild(typesText);
        detailContent.appendChild(abilitiesText);
        detailContent.appendChild(heightText);
        detailContent.appendChild(weightText);
        detailContent.appendChild(statsList);

        // Add a close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.classList.add('btn', 'btn-danger');
        closeButton.style.marginTop = '10px';
        closeButton.style.fontSize = '18px'; // Larger font size for clarity
        closeButton.addEventListener('click', function(event) {
            event.stopPropagation();
            detailCard.remove(); // Remove detail card on close
        });

        detailContent.appendChild(closeButton);

        // Append detail content to detail card
        detailCard.appendChild(detailContent);

        // Add event listener to close card when clicking outside of it
        document.body.addEventListener('click', function closeCard(event) {
            if (!detailCard.contains(event.target)) {
                detailCard.remove();
                document.body.removeEventListener('click', closeCard);
            }
        });

        // Append detail card to body
        document.body.appendChild(detailCard);
    }

    // Retrieve Pokémon types as a comma-separated string
    function getPokemonTypes(types) {
        return types.map(type => type.type.name).join(', ');
    }

    // Retrieve Pokémon abilities as a comma-separated string
    function getPokemonAbilities(abilities) {
        return abilities.map(ability => ability.ability.name).join(', ');
    }

    // Function to toggle visibility of the team
    toggleTeamBtn.addEventListener('click', function() {
        if (teamResultContainer.style.display === 'none' || teamResultContainer.style.display === '') {
            teamResultContainer.style.display = 'block';
            toggleTeamBtn.textContent = 'Hide Team';
        } else {
            teamResultContainer.style.display = 'none';
            toggleTeamBtn.textContent = 'Show Team';
        }
    });

    // Display the team on page load
    displayTeam();

    // Battle form submission
    const battleForm = document.getElementById('battleForm');
    battleForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        const pokemon1Name = document.getElementById('pokemon1Name').value.trim();
        const pokemon2Name = document.getElementById('pokemon2Name').value.trim();
        
        // Fetch Pokémon data for battle simulation
        Promise.all([fetchPokemonData(pokemon1Name), fetchPokemonData(pokemon2Name)])
            .then(results => {
                const [pokemon1Data, pokemon2Data] = results;
                displayBattleResults(pokemon1Data, pokemon2Data);
            })
            .catch(error => {
                console.error('Error fetching Pokémon data:', error);
            });
    });

    // Fetch Pokémon data from PokeAPI
    function fetchPokemonData(pokemonNameOrId) {
        return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`)
            .then(response => {
                if (!response.ok) throw new Error('Pokémon not found');
                return response.json();
            });
    }

// Display battle results
function displayBattleResults(pokemon1Data, pokemon2Data) {
    // Set Pokémon names in the table headers
    document.getElementById('pokemon1NameDisplay').textContent = pokemon1Data.name;
    document.getElementById('pokemon2NameDisplay').textContent = pokemon2Data.name;

    // Add Pokémon 1 image
    const pokemon1ImageContainer = document.getElementById('pokemon1ImageContainer');
    pokemon1ImageContainer.innerHTML = ''; // Clear previous image
    const pokemon1Image = document.createElement('img');
    pokemon1Image.src = pokemon1Data.sprites.other['official-artwork'].front_default;
    pokemon1Image.alt = pokemon1Data.name;
    pokemon1Image.style.width = '100px'; // Set image width
    pokemon1Image.style.height = 'auto'; // Maintain aspect ratio
    pokemon1ImageContainer.appendChild(pokemon1Image);

    // Add Pokémon 2 image
    const pokemon2ImageContainer = document.getElementById('pokemon2ImageContainer');
    pokemon2ImageContainer.innerHTML = ''; // Clear previous image
    const pokemon2Image = document.createElement('img');
    pokemon2Image.src = pokemon2Data.sprites.other['official-artwork'].front_default;
    pokemon2Image.alt = pokemon2Data.name;
    pokemon2Image.style.width = '100px'; // Set image width
    pokemon2Image.style.height = 'auto'; // Maintain aspect ratio
    pokemon2ImageContainer.appendChild(pokemon2Image);

    // Populate Pokémon 1 data
    document.getElementById('pokemon1Id').textContent = pokemon1Data.id;
    document.getElementById('pokemon1Types').textContent = getPokemonTypes(pokemon1Data.types);
    document.getElementById('pokemon1Abilities').textContent = getPokemonAbilities(pokemon1Data.abilities);
    document.getElementById('pokemon1Height').textContent = `${(pokemon1Data.height / 10).toFixed(2)} m`;
    document.getElementById('pokemon1Weight').textContent = `${(pokemon1Data.weight / 10).toFixed(2)} kg`;
    document.getElementById('pokemon1StatsTotal').textContent = pokemon1Data.stats.reduce((acc, stat) => acc + stat.base_stat, 0);

    // Populate Pokémon 2 data
    document.getElementById('pokemon2Id').textContent = pokemon2Data.id;
    document.getElementById('pokemon2Types').textContent = getPokemonTypes(pokemon2Data.types);
    document.getElementById('pokemon2Abilities').textContent = getPokemonAbilities(pokemon2Data.abilities);
    document.getElementById('pokemon2Height').textContent = `${(pokemon2Data.height / 10).toFixed(2)} m`;
    document.getElementById('pokemon2Weight').textContent = `${(pokemon2Data.weight / 10).toFixed(2)} kg`;
    document.getElementById('pokemon2StatsTotal').textContent = pokemon2Data.stats.reduce((acc, stat) => acc + stat.base_stat, 0);

    // Determine winner based on total stats
    const winnerText = document.getElementById('winner');
    const stats1Total = pokemon1Data.stats.reduce((acc, stat) => acc + stat.base_stat, 0);
    const stats2Total = pokemon2Data.stats.reduce((acc, stat) => acc + stat.base_stat, 0);

    if (stats1Total > stats2Total) {
        winnerText.textContent = `${pokemon1Data.name} wins!`;
    } else if (stats1Total < stats2Total) {
        winnerText.textContent = `${pokemon2Data.name} wins!`;
    } else {
        winnerText.textContent = 'It\'s a tie!';
    }
}

// Helper functions to get Pokémon types and abilities
function getPokemonTypes(types) {
    return types.map(typeInfo => typeInfo.type.name).join(', ');
}

function getPokemonAbilities(abilities) {
    return abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');
}
});