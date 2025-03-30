document.addEventListener('DOMContentLoaded', () => {
    // Hent elementer
    const gameImage = document.getElementById('game-image');
    const startButton = document.getElementById('start-button');
    const choicesDiv = document.getElementById('choices');
    const backgroundMusic = document.getElementById('background-music');
    const volumeSlider = document.getElementById('volume-slider');
    const storyText = document.getElementById('story-text');
    const gameMap = document.getElementById('game-map'); // Hent map-elementet
    const dialogueBox = document.getElementById('dialogue-box');
    const dialogueNpcText = document.getElementById('dialogue-npc-text');
    const dialogueOptionsDiv = document.getElementById('dialogue-options');

    // Sjekk alle elementer
    if (!gameImage || !startButton || !choicesDiv || !backgroundMusic || !volumeSlider || !storyText || !gameMap || !dialogueBox || !dialogueNpcText || !dialogueOptionsDiv) {
        console.error("FEIL: Fant ikke alle HTML-elementene!");
        // Legg til flere spesifikke sjekker her om nødvendig
        return;
    } else {
        console.log("Alle HTML-elementer funnet OK.");
    }

    // --- Volumkontroll-kode (som før) ---
    backgroundMusic.volume = volumeSlider.value;
    volumeSlider.addEventListener('input', () => {
        backgroundMusic.volume = volumeSlider.value;
    });
    // --- Slutt Volumkontroll-kode ---


    // --- Spill-logikk ---

    // Definer scener og dialog (forenklet start)
    const scenes = {
        start: {
            image: "images/DTVStartbilde.jpg",
            alt: "Startbilde",
            mapAreas: [] // Ingen klikkbare områder på startbildet
        },
        scene2_mia: {
            image: "images/DTV2.jpg", // ANTATT FILNAVN! Endre om nødvendig
            alt: "Gråtende jente (Mia)",
            mapAreas: [
                // DEFINER OMRÅDET FOR MIA HER! Juster koordinatene (x1,y1,x2,y2 for rektangel)
                // Du må finne koordinatene manuelt (f.eks. i et bilderedigeringsprogram)
                { id: 'mia-area', shape: 'rect', coords: '150,100,250,350', alt: 'Mia', action: 'startDialogueMia' }
            ],
            initialText: "Dere får øye på en eldre jente som sitter alene og gråter."
        },
        scene3_hint_found: { // Eksempel på neste scene
             image: "images/DTV3_park.jpg", // ANTATT FILNAVN!
             alt: "Parken",
             mapAreas: [ /* Nye områder her */ ],
             initialText: "Mia fortalte at katten forsvant nær parken."
        }
        // ... flere scener
    };

    const dialogueMia = {
        start: {
            npcText: "*(Hulk)* ... Hva vil dere?",
            options: [
                { text: "Hei! Hva er galt? Hvorfor gråter du?", nextNode: 'askWhy' },
                { text: "(Summer hvisker) La oss spørre forsiktig.", nextNode: 'askWhy' },
                { text: "Slutt å gråte!", nextNode: 'beRude' }
            ]
        },
        askWhy: {
            npcText: "Det er... det er katten min, Snehvit! Hun... hun er borte! *(Snufs)* Jeg finner henne ikke noe sted.",
            options: [
                { text: "Å nei! Hvor så du henne sist?", nextNode: 'askLastSeen' },
                { text: "(Rose sier) Vi kan hjelpe deg å lete!", nextNode: 'offerHelp' },
                { text: "Katter stikker ofte av, hun kommer nok tilbake.", nextNode: 'dismissive' }
            ]
        },
        offerHelp: {
            npcText: "Ville dere...? Åh, tusen takk! Hun er liten og hvit med et blått halsbånd. Jeg så henne sist borte ved den store eika i parken!",
            options: [
                { text: "Ok, vi går til parken med en gang! (Hint funnet)", nextNode: 'endDialogueGoToPark' } // Hintet!
            ]
        },
         askLastSeen: {
            npcText: "Jeg... jeg tror det var borte ved den store eika i parken. *(Hulk)* Hun elsker å klatre der.",
            options: [
                 { text: "Ok, da sjekker vi parken! (Hint funnet)", nextNode: 'endDialogueGoToPark' } // Hintet!
            ]
        },
        beRude: {
             npcText: "*(Gråter enda mer)* Gå vekk!",
             options: [
                 { text: "Ok, ok, unnskyld. Hva har skjedd?", nextNode: 'askWhy' },
                 { text: "(Gå videre uten å hjelpe)", nextNode: 'leave' } // Kanskje en dårlig slutt?
            ]
        },
         dismissive: {
             npcText: "Men... men hun pleier aldri å være borte så lenge! *(Ser trist ut)*",
             options: [
                  { text: "Vi kan jo se etter henne likevel? Hvor var hun sist?", nextNode: 'askLastSeen' },
                  { text: "(Gå videre uten å hjelpe)", nextNode: 'leave' }
             ]
        },
        leave: {
            // Håndterer at spilleren går uten å hjelpe (kan f.eks. bytte scene uten hintet?)
            // For nå, la oss bare lukke dialogen
            npcText: "", // Ingen tekst, handling skjer i selectDialogueOption
            options: []
        },
        endDialogueGoToPark: {
             // Lukker dialogen og trigger scenebytte til parken
             npcText: "",
             options: []
        }
        // ... flere noder
    };


    // Funksjon for å bytte scene
    function changeScene(sceneId) {
        const scene = scenes[sceneId];
        if (!scene) {
            console.error(`Scene "${sceneId}" finnes ikke!`);
            return;
        }

        console.log(`Bytter til scene: ${sceneId}`);
        gameImage.src = scene.image;
        gameImage.alt = scene.alt;
        storyText.textContent = scene.initialText || ""; // Vis starttekst for scenen

        // Tøm og fyll map-elementet
        gameMap.innerHTML = ''; // Tøm gamle områder
        gameImage.removeAttribute('usemap'); // Fjern gammel kobling

        if (scene.mapAreas && scene.mapAreas.length > 0) {
            scene.mapAreas.forEach(areaData => {
                const areaElement = document.createElement('area');
                areaElement.id = areaData.id;
                areaElement.shape = areaData.shape;
                areaElement.coords = areaData.coords;
                areaElement.alt = areaData.alt;
                areaElement.href = "#"; // For å gjøre den klikkbar
                areaElement.style.cursor = "pointer"; // Vis klikkemarkør

                // Legg til klikk-lytter basert på action
                if (areaData.action === 'startDialogueMia') {
                    areaElement.addEventListener('click', (e) => {
                        e.preventDefault(); // Forhindre at # legges til URL
                        showDialogue('start'); // Start Mia-dialogen
                    });
                }
                // Legg til flere 'else if' for andre actions/områder
                 else {
                     areaElement.addEventListener('click', (e) => {
                          e.preventDefault();
                          console.log(`Klikket på område: ${areaData.id} (ingen action definert)`);
                          storyText.textContent = `Du ser på ${areaData.alt}.`; // Enkel default handling
                     });
                 }

                gameMap.appendChild(areaElement);
            });
            gameImage.useMap = '#game-map'; // Koble bildet til det nye kartet
            console.log("Image map oppdatert for scenen.");
        } else {
             console.log("Ingen klikkbare områder for denne scenen.");
        }

         // Skjul dialogboksen når scenen byttes
         hideDialogue();
    }

    // Funksjon for å vise dialog
    function showDialogue(nodeId) {
        const node = dialogueMia[nodeId];
        if (!node) {
            console.error(`Dialog-node "${nodeId}" finnes ikke!`);
            hideDialogue();
            return;
        }

        dialogueNpcText.textContent = node.npcText; // Vis Mias tekst
        dialogueOptionsDiv.innerHTML = ''; // Tøm gamle valg

        if (node.options && node.options.length > 0) {
             // Vis nye valg
            node.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option.text;
                button.addEventListener('click', () => {
                    selectDialogueOption(option.nextNode);
                });
                dialogueOptionsDiv.appendChild(button);
            });
             dialogueBox.style.display = 'block'; // Vis dialogboksen
        } else {
            // Hvis ingen valg, skjul boksen (eller håndter slutten av dialogen)
             console.log(`Dialog slutt eller node '${nodeId}' har ingen options.`);
            hideDialogue();
            // Trigger handling basert på slutt-node
            handleDialogueEnd(nodeId);
        }
    }

     // Funksjon for å håndtere valg
    function selectDialogueOption(nextNodeId) {
         console.log(`Valgt option, går til node: ${nextNodeId}`);
        showDialogue(nextNodeId); // Vis neste del av dialogen
    }

     // Funksjon for å håndtere spesielle slutt-noder
     function handleDialogueEnd(nodeId) {
          if (nodeId === 'endDialogueGoToPark') {
               console.log("Hint funnet! Går til parken.");
               changeScene('scene3_hint_found'); // Bytt til neste scene
          } else if (nodeId === 'leave') {
               console.log("Spilleren går uten å hjelpe.");
               // Kanskje bytt til en annen scene eller bare la spilleren være i samme scene
               hideDialogue(); // Skjul dialogen uansett
          }
          // Legg til flere 'else if' for andre avslutninger
     }


    // Funksjon for å skjule dialog
    function hideDialogue() {
        dialogueBox.style.display = 'none';
    }


    // --- Start av spillet ---
    changeScene('start'); // Vis startscenen når siden lastes (istedet for å hardkode i HTML)

    // Oppdater Startknapp-lytteren
    startButton.addEventListener('click', () => {
        console.log("Startknapp klikket!");
        choicesDiv.innerHTML = ''; // Fjern startknappen

        // Start musikken
        backgroundMusic.play().catch(error => console.error("Kunne ikke spille av lyd:", error));

        // Gå til neste scene (Mia)
        changeScene('scene2_mia');
        console.log("Bildet byttet til scene 2 (Mia) og musikk startet.");
    });

}); // Slutt på DOMContentLoaded
