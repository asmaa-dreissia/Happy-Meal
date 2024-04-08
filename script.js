$(document).ready(function() {
    // Charger les données depuis le fichier JSON
    $.getJSON("data.json", function(data) {
        // Stocker les données des recettes dans une variable
        const recettes = data.recettes;

        // Fonction pour afficher les recettes sur la page d'accueil
        function afficherRecettes() {
            // Sélectionner la section où afficher les recettes
            const recettesSection = $("#recettesSection");

            // Parcourir chaque recette dans les données
            recettes.forEach(function(recette) {
                // Créer un élément de recette
                const recetteHTML = `
                    <div class="recette">
                        <h2>${recette.nom}</h2>
                        <p>Catégorie : ${recette.categorie}</p>
                        <p>Temps de préparation : ${recette.temps_preparation}</p>
                        <button class="voirDetails" data-id="${recette.nom}">Voir détails</button>
                    </div>
                `;
                // Ajouter l'élément de recette au début de la section des recettes
                recettesSection.prepend(recetteHTML);
            });
        }

        // Appeler la fonction pour afficher les recettes au chargement de la page
        afficherRecettes();

        // Activer l'autocomplétion dans la barre de recherche
        $("#searchBar").autocomplete({
            source: recettes.map(recette => recette.nom), // Utiliser les noms des recettes comme source d'autocomplétion
            select: function(event, ui) {
                // Lorsqu'une recette est sélectionnée, ajouter uniquement cette recette au début de la section
                const recetteChoisie = recettes.find(recette => recette.nom === ui.item.value);
                const recetteHTML = `
                    <div class="recette">
                        <h2>${recetteChoisie.nom}</h2>
                        <p>Catégorie : ${recetteChoisie.categorie}</p>
                        <p>Temps de préparation : ${recetteChoisie.temps_preparation}</p>
                        <button class="voirDetails" data-id="${recetteChoisie.nom}">Voir détails</button>
                    </div>
                `;
                // Ajouter la recette choisie au début de la section des recettes sans vider les recettes existantes
                $("#recettesSection").prepend(recetteHTML);
            }
        });

        // Fonction pour filtrer les recettes par ingrédient
        function filtrerParIngredient(ingredient) {
            return recettes.filter(function(recette) {
                return recette.ingredients.some(function(ing) {
                    return ing.toLowerCase().includes(ingredient.toLowerCase());
                });
            });
        }

        // Gérer la saisie dans la barre de recherche
        $("#searchBar").on("input", function() {
            // Récupérer la valeur saisie par l'utilisateur
            const valeurRecherchee = $(this).val().toLowerCase();

            // Vérifier si la valeur saisie est suffisamment longue pour une recherche
            if (valeurRecherchee.length > 2) { // Vous pouvez ajuster la longueur minimale si nécessaire
                // Filtrer les recettes qui contiennent l'ingrédient recherché
                const recettesFiltrees = filtrerParIngredient(valeurRecherchee);

                // Afficher les recettes filtrées
                afficherRecettes(recettesFiltrees);
            } else {
                // Si la recherche est trop courte, afficher toutes les recettes
                afficherRecettes(recettes);
            }
        });

        // Appeler la fonction pour afficher toutes les recettes au chargement de la page
        afficherRecettes(recettes);

        // Gérer le clic sur le bouton "Voir détails"
        $(document).on("click", ".voirDetails", function() {
            // Récupérer le nom de la recette à partir de l'attribut data-id
            const nomRecette = $(this).data("id");

            // Rediriger vers la page de détail de la recette avec le nom de la recette en paramètre
            window.location.href = `recette.html?nom=${encodeURIComponent(nomRecette)}`;
        });
    });
});


