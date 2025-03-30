// Vent til hele HTML-siden er lastet inn før vi kjører koden
document.addEventListener('DOMContentLoaded', () => {

    // Finn HTML-elementene vi trenger å manipulere
    const gameImage = document.getElementById('game-image');
    const startButton = document.getElementById('start-button');
    const choicesDiv = document.getElementById('choices');
    const backgroundMusic = document.getElementById('background-music'); // *** Henter lydelementet ***

    // Sjekk at vi faktisk fant alle elementene (inkludert musikk)
    if (!gameImage || !startButton || !choicesDiv || !backgroundMusic) { // *** Sjekker også musikkelementet ***
        console.error("Klarte ikke å finne et eller flere nødvendige HTML-elementer!");
        return; // Avslutt hvis noe mangler
    }

    // Legg til en lytter for klikk på startknappen
    startButton.addEventListener('click', () => {
        console.log("Startknapp klikket!"); // For feilsøking i konsollen

        // Bytt bilde til DTV1.jpg (som skal fungere)
        gameImage.src = 'images/DTV1.jpg';
        gameImage.alt = 'Scene 1';

        // Fjern startknappen (eller hele knapp-området)
        choicesDiv.innerHTML = '';

        // *** START MUSIKKEN ***
        // Prøver å spille av og fanger opp eventuelle feil
        backgroundMusic.play().then(() => {
            console.log("Musikk startet.");
        }).catch(error => {
            console.error("Kunne ikke spille av lyd:", error);
        });
        // *** SLUTT PÅ MUSIKK-KODE ***

        console.log("Bildet byttet og forsøk på å starte musikk gjort.");
    });

}); // Slutt på DOMContentLoaded
