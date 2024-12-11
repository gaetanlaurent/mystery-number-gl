// Attend que la page soit entièrement chargée avant de lancer le code.
document.addEventListener("DOMContentLoaded", () => { 
    // Variables pour stocker les données du jeu.
    let mysteryNumber; // Le nombre que le joueur doit deviner.
    let attempts = 0; // Compte le nombre d'essais du joueur.
    let maxAttempts; // Nombre maximum d'essais selon la difficulté.
    let maxNumber; // Le nombre maximum que le joueur peut deviner.
    let barWidth = 100; // Largeur de la barre de progression (100% au départ).
    let intervalID = null; // ID pour gérer l'animation de la barre de progression.
    let gameEnded = false; // Indique si le jeu est terminé.

    const result = document.getElementById("result"); // Zone pour afficher les messages.
    const Button = document.getElementById("Button"); // Bouton pour valider la saisie.
    const number = document.getElementById("number"); // Champ où le joueur entre un nombre.
    const difficulty = document.getElementById("difficulty"); // Sélecteur de difficulté.
    const progressBar = document.getElementById("bar"); // Barre de progression visuelle.

    // Quand le joueur change la difficulté.
    difficulty.addEventListener("change", () => {
        const selectedDifficulty = difficulty.value; // Récupère la difficulté choisie.

        // Configure le jeu en fonction de la difficulté.
        switch (selectedDifficulty) {
            case "easy": // Mode facile.
                maxNumber = 10;
                maxAttempts = 3;
                break;
            case "medium": // Mode moyen.
                maxNumber = 50;
                maxAttempts = 2;
                break;
            case "hard": // Mode difficile.
                maxNumber = 100;
                maxAttempts = 1;
                break;
            case "impossible":
                maxNumber = 1000;
                maxAttempts = 1;
                break;
            default:
                return; // Si la difficulté n'est pas reconnue, on quitte sans rien faire.
        }

        // Génère un nombre mystère aléatoire.
        mysteryNumber = Math.floor(Math.random() * maxNumber) + 1;
        console.log(`Nombre mystère généré : ${mysteryNumber}`); // Affichage de debug.

        // Réinitialise les données pour un nouveau jeu.
        attempts = 0; // Le joueur n'a pas encore essayé.
        gameEnded = false; // Le jeu commence, il n'est pas encore terminé.
        number.disabled = false; // Réactive la saisie du joueur.
        number.min = 1; // Fixe la limite minimale du champ de saisie.
        number.max = maxNumber; // Fixe la limite maximale du champ de saisie.
        number.value = ""; // Vide le champ de saisie.
        Button.disabled = false; // Réactive le bouton.

        // Affiche les instructions pour cette partie.
        result.innerHTML = `<p>Trouvez le numéro mystère<br>(entre 1 et ${maxNumber})</p>`;

        // Réinitialise la barre de progression.
        barWidth = 100;
        progressBar.style.width = `${barWidth}%`;

        // Si une animation précédente existe, on l'arrête.
        if (intervalID) clearInterval(intervalID);

        // Lance une animation qui réduit la barre petit à petit.
        intervalID = setInterval(() => { 
            if (barWidth <= 0) { // Si la barre est vide (temps écoulé).
                clearInterval(intervalID); // Arrête l'animation.
                if (!gameEnded) { // Si le joueur n'a pas encore gagné ou perdu.
                    result.innerHTML += `
                        <p> ——————————— <p>
                        <p class="incorrect">Temps écoulé ! ⏰</p>
                        <p>Le nombre mystère était ${mysteryNumber}</p>
                        <button class="replay-btn" onclick="window.location.reload()">Rejouer</button>
                    `;
                    Button.disabled = true; // Désactive le bouton.
                    number.disabled = true; // Désactive le champ de saisie.
                    gameEnded = true; // Marque le jeu comme terminé.
                }
            } else { 
                barWidth--; // Réduit la largeur de la barre.
                progressBar.style.width = `${barWidth}%`; // Met à jour visuellement.
            }
        }, 150); // Réduction toutes les 200 ms.
    });

    // Quand le joueur clique sur le bouton pour valider sa réponse.
    Button.addEventListener("click", () => {
        if (gameEnded) return; // Si le jeu est terminé, on ne fait rien.

        const userGuess = parseInt(number.value, 10); // Récupère la valeur saisie par le joueur.
        attempts++; // Compte cet essai.

        // Vérifie si l'entrée est invalide.
        if (isNaN(userGuess) || userGuess < 1 || userGuess > maxNumber) {
            number.classList.add("invalid"); // Ajoute un effet visuel d'erreur.
            setTimeout(() => number.classList.remove("invalid"), 300); // Efface l'effet après 300 ms.
            attempts--; // Cet essai n'est pas compté.
            return;
        }

        // Si le joueur trouve le nombre mystère.
        if (userGuess === mysteryNumber) { 
            result.innerHTML = `
                <p>En ${attempts} essai(s) !</p>
                <p class="correct">Vous avez gagné ! 😁</p>
                <p>Nombre mystère : ${mysteryNumber}</p>
                <button class="replay-btn" onclick="window.location.reload()">Rejouer</button>
            `;
            Button.disabled = true; // Désactive le bouton.
            number.disabled = true; // Désactive la saisie.
            if (intervalID) clearInterval(intervalID); // Stoppe la barre de progression.
            gameEnded = true; // Le jeu est fini.
        } else { 
            const hint = userGuess < mysteryNumber ? "⬆️" : "⬇️";
            result.innerHTML += `
                <p> ——————————— <p>
                <p>${attempts === 1 ? "1er" : `${attempts}ème`} essai : ${userGuess}</p>
                <p>${hint}</p>
            `;

            if (attempts >= maxAttempts) { // Si le joueur atteint la limite d'essais.
                result.innerHTML += `
                    <p> ——————————— <p>
                    <p class="incorrect">Vous avez perdu ! 😢</p>
                    <p>Le nombre mystère était ${mysteryNumber}</p>
                    <button class="replay-btn" onclick="window.location.reload()">Rejouer</button>
                `;
                Button.disabled = true; // Désactive le bouton.
                number.disabled = true; // Désactive la saisie.
                if (intervalID) clearInterval(intervalID); // Stoppe la barre de progression.
                gameEnded = true; // Marque le jeu comme terminé.
            }
        }

        number.value = ""; // Vide le champ pour le prochain essai.
    });
});