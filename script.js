// Vent til hele HTML-siden er lastet inn før vi kjører koden
document.addEventListener('DOMContentLoaded', () => {

    // Finn HTML-elementene vi trenger å manipulere
    const gameImage = document.getElementById('game-image');
    const startButton = document.getElementById('start-button');
    const choicesDiv = document.getElementById('choices');

    // Sjekk at vi faktisk fant elementene
    if (!gameImage || !startButton || !choicesDiv) {
        console.error("Klarte ikke å finne et eller flere nødvendige HTML-elementer!");
        return; // Avslutt hvis noe mangler
    }

    // Legg til en lytter for klikk på startknappen
    startButton.addEventListener('click', () => {
        console.log("Startknapp klikket!"); // For feilsøking i konsollen

        // Bytt bilde til DTV1.jpg - OPPDATERT FILNAVN/FORMAT
        gameImage.src = 'images/DTV1.jpg';
        gameImage.alt = 'Scene 1'; // Oppdater alt-teksten også

        // Fjern startknappen (eller hele knapp-området)
        choicesDiv.innerHTML = '';

        console.log("Bildet byttet til DTV1.jpg og startknapp fjernet.");

        // Hvis du legger til lyd senere, kan .play()-kallet komme her
    });

}); // Slutt på DOMContentLoaded
