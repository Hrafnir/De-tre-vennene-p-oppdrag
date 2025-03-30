document.addEventListener('DOMContentLoaded', () => {
    const gameImage = document.getElementById('game-image');
    const startButton = document.getElementById('start-button');
    const choicesDiv = document.getElementById('choices');
    const backgroundMusic = document.getElementById('background-music');

    if (!gameImage || !startButton || !choicesDiv || !backgroundMusic) {
        console.error("FEIL: Fant ikke alle HTML-elementene!");
        // Skriver ut hvilke som eventuelt mangler:
        if (!gameImage) console.error("Mangler #game-image");
        if (!startButton) console.error("Mangler #start-button");
        if (!choicesDiv) console.error("Mangler #choices");
        if (!backgroundMusic) console.error("Mangler #background-music");
        return;
    } else {
        console.log("Alle HTML-elementer funnet OK."); // Bekreftelse
    }

    startButton.addEventListener('click', () => {
        console.log("Startknapp klikket!");

        // Bytt bilde
        gameImage.src = 'images/DTV1.jpg';
        gameImage.alt = 'Scene 1';
        console.log("Bildet byttet til DTV1.jpg.");

        // Fjern startknappen
        choicesDiv.innerHTML = '';
        console.log("Startknapp fjernet.");

        // Start bakgrunnsmusikken
        console.log("Prøver å starte musikk nå..."); // Rett før play()
        console.log("Referanse til lydelement:", backgroundMusic); // Sjekk at det er et audio-element

        backgroundMusic.play().then(() => {
            console.log("SUKSESS: Musikk .play() fullført (Promise resolved)."); // Inne i .then()
        }).catch(error => {
            // VIKTIG: Denne SKAL fange opp feil hvis nettleseren blokkerer!
            console.error("FEIL: Musikk .play() feilet (Promise rejected):", error); // Inne i .catch()
        });

        console.log("Kommando for musikkavspilling er sendt."); // Rett etter play()
    });
});
