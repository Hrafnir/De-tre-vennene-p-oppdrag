document.addEventListener('DOMContentLoaded', () => {
    // Hent elementer
    const gameImage = document.getElementById('game-image');
    const startButton = document.getElementById('start-button');
    const choicesDiv = document.getElementById('choices');
    const backgroundMusic = document.getElementById('background-music');
    const volumeSlider = document.getElementById('volume-slider');
    const storyText = document.getElementById('story-text');
    // const gameMap = document.getElementById('game-map'); // <= FJERNET
    const dialogueBox = document.getElementById('dialogue-box');
    const dialogueNpcText = document.getElementById('dialogue-npc-text');
    const dialogueOptionsDiv = document.getElementById('dialogue-options');

    // Sjekk nødvendige elementer (uten gameMap)
    if (!gameImage || !choicesDiv || !backgroundMusic || !volumeSlider || !storyText || !dialogueBox || !dialogueNpcText || !dialogueOptionsDiv) {
        console.error("FEIL: Fant ikke alle nødvendige HTML-elementene!");
        // Legg til flere spesifikke sjekker her om nødvendig
        return;
    } else {
        console.log("Alle nødvendige HTML-elementer funnet OK.");
    }

    // --- Volumkontroll-kode (som før) ---
    if (backgroundMusic && volumeSlider) {
        backgroundMusic.volume = volumeSlider.value;
        volumeSlider.addEventListener('input', () => {
            backgroundMusic.volume = volumeSlider.value;
        });
    }
    // --- Slutt Volumkontroll-kode ---


    // --- Spill-logikk ---
    let currentSceneId = 'start'; // Holder styr på hvilken scene vi er i

    // Definer scener og dialog
    const scenes = {
        start: {
            // **** VIKTIG: Sett inn RIKTIG filnavn og ORIGINALE dimensjoner ****
            image: "images/ChatGPT Image 30. mars 2025, 19_26_00.png", // <= ER DETTE RIKTIG STARTBILDE NÅ?
            originalWidth: 800,  // <= SETT INN FAKTISK BREDDE I PIKSLER
            originalHeight: 600, // <= SETT INN FAKTISK HØYDE I PIKSLER
            alt: "Startbilde",
            clickableAreas: [], // Ingen klikkbare områder på startbildet
            initialText: "Velkommen!"
        },
        scene2_mia: {
            // **** VIKTIG: Sett inn RIKTIG filnavn og ORIGINALE dimensjoner ****
            image: "images/DTV2.png",
            originalWidth: 1535,  // <= SETT INN FAKTISK BREDDE I PIKSLER
            originalHeight: 1023, // <= SETT INN FAKTISK HØYDE I PIKSLER
            alt: "Gråtende jente (Mia)",
            clickableAreas: [
                // Bruker koordinatene du fant i Photoshop
                // **** VIKTIG: Erstatt tallene under med de DU fant ****
                { id: 'mia-area', action: 'startDialogueMia', rectCoords: { x1: 1022, y1: 297, x2: 1349, y2: 1000 } }
            ],
            initialText: "Dere får øye på en eldre jente som sitter alene og gråter."
        },
        scene3_hint_found: {
             // **** VIKTIG: Sett inn RIKTIG filnavn og ORIGINALE dimensjoner ****
             image: "images/DTV3_park.jpg", // ANTATT FILNAVN!
             originalWidth: 800,  // <= SETT INN FAKTISK BREDDE I PIKSLER
             originalHeight: 600, // <= SETT INN FAKTISK HØYDE I PIKSLER
             alt: "Parken",
             clickableAreas: [ /* Nye områder her, definert med rectCoords */ ],
             initialText: "Mia fortalte at katten forsvant nær parken."
        }
        // ... flere scener
    };

    // Dialogtreet for Mia (samme som før)
    const dialogueMia = {
        start: { npcText: "*(Hulk)* ... Hva vil dere?", options: [ { text: "Hei! Hva er galt?", nextNode: 'askWhy' }, { text: "Slutt å gråte!", nextNode: 'beRude' } ]},
        askWhy: { npcText: "Det er... katten min, Snehvit! Hun... er borte!", options: [ { text: "Hvor så du henne sist?", nextNode: 'askLastSeen' }, { text: "Vi kan hjelpe deg å lete!", nextNode: 'offerHelp' } ]},
        offerHelp: { npcText: "Tusen takk! Hun er hvit med blått halsbånd. Så henne sist ved eika i parken!", options: [ { text: "Ok, vi går til parken! (Hint funnet)", nextNode: 'endDialogueGoToPark' } ]},
        askLastSeen: { npcText: "Ved den store eika i parken. Hun klatrer der.", options: [ { text: "Da sjekker vi parken! (Hint funnet)", nextNode: 'endDialogueGoToPark' } ]},
        beRude: { npcText: "*(Gråter mer)* Gå vekk!", options: [ { text: "Unnskyld. Hva har skjedd?", nextNode: 'askWhy' }, { text: "(Gå videre)", nextNode: 'leave' } ]},
        leave: { npcText: "", options: [] },
        endDialogueGoToPark: { npcText: "", options: [] }
        // ... flere noder
    };


    // Funksjon for å bytte scene (UTEN map/area-logikk)
    function changeScene(sceneId) {
        console.log(`--- changeScene KALT med sceneId: ${sceneId} ---`);
        const scene = scenes[sceneId];
        if (!scene) {
            console.error(`Scene "${sceneId}" finnes ikke!`);
            return;
        }
        console.log(`Forsøker å sette bilde src til: ${scene.image}`);
        console.log(`Bildets originale dimensjoner: ${scene.originalWidth}x${scene.originalHeight}`);

        gameImage.src = scene.image;
        gameImage.alt = scene.alt;
        storyText.textContent = scene.initialText || "";
        currentSceneId = sceneId; // Oppdater hvilken scene vi er i

        // Skjul dialogboksen når scenen byttes
        hideDialogue();
        console.log(`Scene byttet til: ${sceneId}`);
    }

    // --- NYTT: Klikk-lytter direkte på bildet ---
    gameImage.addEventListener('click', (event) => {
        const scene = scenes[currentSceneId]; // Hent data for den aktive scenen
        if (!scene || !scene.clickableAreas || scene.clickableAreas.length === 0) {
            console.log("Ingen klikkbare områder definert for denne scenen.");
            return; // Ingen områder å sjekke i denne scenen
        }

        // Hent klikk-koordinater relativt til bildet slik det vises
        const clickX = event.offsetX;
        const clickY = event.offsetY;

        // Hent bildets viste dimensjoner
        const displayWidth = gameImage.clientWidth;
        const displayHeight = gameImage.clientHeight;

        // Hent bildets originale dimensjoner (fra scene-data)
        const originalWidth = scene.originalWidth;
        const originalHeight = scene.originalHeight;

        // Hvis original dimensjon mangler, kan vi ikke skalere riktig
        if (!originalWidth || !originalHeight) {
             console.error("Mangler originale dimensjoner for bildet i scene-definisjonen!");
             return;
        }

        // Beregn skaleringsfaktorer
        const scaleX = displayWidth / originalWidth;
        const scaleY = displayHeight / originalHeight;

        console.log(`Klikk på bildet: (${clickX}, ${clickY}). Vist størrelse: ${displayWidth}x${displayHeight}. Skala: ${scaleX.toFixed(2)}x${scaleY.toFixed(2)}`);

        // Gå gjennom de definerte klikkbare områdene for denne scenen
        for (const area of scene.clickableAreas) {
            if (area.rectCoords) { // Sjekk om det er et rektangel
                const coords = area.rectCoords; // Hent originale piksel-koordinater

                // Beregn grensene for området slik det vises på skjermen
                const displayX1 = coords.x1 * scaleX;
                const displayY1 = coords.y1 * scaleY;
                const displayX2 = coords.x2 * scaleX;
                const displayY2 = coords.y2 * scaleY;

                 console.log(`Sjekker område '${area.id}': Viste grenser (${displayX1.toFixed(0)}, ${displayY1.toFixed(0)}) til (${displayX2.toFixed(0)}, ${displayY2.toFixed(0)})`);

                // Sjekk om klikket er innenfor det skalerte rektangelet
                if (clickX >= displayX1 && clickX <= displayX2 && clickY >= displayY1 && clickY <= displayY2) {
                    console.log(`Treff på område: ${area.id}`);

                    // Utfør handlingen knyttet til området
                    if (area.action === 'startDialogueMia') {
                        showDialogue('start');
                    }
                    // Legg til 'else if' for andre actions her
                    else {
                         console.log(`Ingen kjent handling for '${area.action}'`);
                    }
                    break; // Avslutt sjekking etter første treff (hvis områder kan overlappe)
                }
            }
            // Legg til 'else if' for andre former (sirkel etc.) her hvis nødvendig
        }
    });


    // Funksjoner for dialog (showDialogue, selectDialogueOption, handleDialogueEnd, hideDialogue)
    // ... (Lim inn de samme dialog-funksjonene fra forrige svar her) ...
    // ... (VIKTIG: Sørg for at disse funksjonene er med!) ...
    // Funksjon for å vise dialog
    function showDialogue(nodeId) {
        const node = dialogueMia[nodeId];
        if (!node) {
            console.error(`Dialog-node "${nodeId}" finnes ikke!`);
            hideDialogue();
            return;
        }
        dialogueNpcText.textContent = node.npcText;
        dialogueOptionsDiv.innerHTML = '';
        if (node.options && node.options.length > 0) {
            node.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option.text;
                button.addEventListener('click', () => {
                    selectDialogueOption(option.nextNode);
                });
                dialogueOptionsDiv.appendChild(button);
            });
            dialogueBox.style.display = 'block';
        } else {
            console.log(`Dialog slutt eller node '${nodeId}' har ingen options.`);
            hideDialogue();
            handleDialogueEnd(nodeId);
        }
    }
    // Funksjon for å håndtere valg
    function selectDialogueOption(nextNodeId) {
         console.log(`Valgt option, går til node: ${nextNodeId}`);
        showDialogue(nextNodeId);
    }
     // Funksjon for å håndtere spesielle slutt-noder
     function handleDialogueEnd(nodeId) {
          if (nodeId === 'endDialogueGoToPark') {
               console.log("Hint funnet! Går til parken.");
               changeScene('scene3_hint_found');
          } else if (nodeId === 'leave') {
               console.log("Spilleren går uten å hjelpe.");
               hideDialogue();
          }
     }
    // Funksjon for å skjule dialog
    function hideDialogue() {
        dialogueBox.style.display = 'none';
    }

    // --- Start av spillet ---
    // Finner startknappen (hvis den finnes - kan fjernes fra HTML etter hvert)
     const initialStartButton = document.getElementById('start-button');
     if (initialStartButton) {
         initialStartButton.addEventListener('click', () => {
             console.log("Startknapp klikket!");
              if(choicesDiv) choicesDiv.innerHTML = ''; // Fjern startknappen hvis choicesDiv finnes

             // Start musikken
             if(backgroundMusic) backgroundMusic.play().catch(error => console.error("Kunne ikke spille av lyd:", error));

             // Gå til neste scene (Mia) - ELLER til DTV1 hvis du legger inn den scenen
             changeScene('scene2_mia');
             console.log("Scene byttet etter startknapp og musikk startet.");
         });
     } else {
         // Hvis startknappen ikke finnes, start direkte (eller vis startscenen)
          console.log("Startknapp ikke funnet, viser startscene.");
         changeScene('start'); // Sørg for at startscenen vises
     }

     // Kall changeScene for å laste inn den initielle scenen uansett
     changeScene(currentSceneId); // Laster scenen definert i currentSceneId ('start')

}); // Slutt på DOMContentLoaded
