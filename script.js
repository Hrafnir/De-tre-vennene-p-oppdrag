// Vent til hele HTML-siden er lastet inn før vi kjører koden
document.addEventListener('DOMContentLoaded', () => {

    // Finn HTML-elementene vi trenger å manipulere
    const gameImage = document.getElementById('game-image');
    const startButton = document.getElementById('start-button');
    const choicesDiv = document.getElementById('choices'); // Vi trenger denne for å fjerne knappen

    // Sjekk at vi faktisk fant elementene (god praksis for feilsøking)
    if (!gameImage || !startButton || !choicesDiv) {
        console.error("Klarte ikke å finne et eller flere nødvendige HTML-elementer!");
        return; // Avslutt hvis noe mangler
    }

    // Legg til en lytter for klikk på startknappen
    startButton.addEventListener('click', () => {
        console.log("Startknapp klikket!"); // For feilsøking i konsollen

        // Bytt bilde til DTV1.png
        gameImage.src = 'images/DTV1.png';
        gameImage.alt = 'Scene 1'; // Oppdater alt-teksten også

        // Fjern startknappen (eller hele choices-diven hvis det er den eneste knappen)
        // startButton.remove(); // Fjerner bare knappen
        choicesDiv.innerHTML = ''; // Tømmer hele knapp-området - enklere hvis flere knapper skal komme senere

        console.log("Bildet byttet til DTV1.png og startknapp fjernet.");
    });

}); // Slutt på DOMContentLoaded
