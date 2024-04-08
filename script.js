$(document).ready(function() {
    // Load data from JSON file
    $.getJSON("data.json", function(data) {
        const recettes = data.recettes;

        // Function to display recipes
        function afficherRecettes(recettes) {
            const recipesSection = $("#recipesSection");
            recipesSection.empty();

            // Browse recipes and display them
            recettes.forEach(recette => {
                const recetteHTML = `
                    <div class="recette">
                        <h2>${recette.nom}</h2>
                        <p>Catégorie : ${recette.categorie}</p>
                        <p>Temps de préparation : ${recette.temps_preparation}</p>
                        <button class="voirDetails" data-id="${recette.nom}">Voir détails</button>
                    </div>
                `;
                recipesSection.append(recetteHTML);
            });
        }

        // Enable autocompletion in the search bar
        $("#searchBar").autocomplete({
            source: function(request, response) {
                // Combinez les noms des recettes et les noms des ingrédients comme source d'autocomplétion
                const allNames = recettes.flatMap(recette => [recette.nom, ...recette.ingredients]);
                const filteredNames = $.ui.autocomplete.filter(allNames, request.term);
                response(filteredNames);
            },
            select: function(event, ui) {
                const selectedName = ui.item.value;
                const selectedRecipe = recettes.find(recette => recette.nom === selectedName || recette.ingredients.includes(selectedName));
                if (selectedRecipe) {
                    const recetteHTML = `
                        <div class="recette">
                            <h2>${selectedRecipe.nom}</h2>
                            <p>Catégorie : ${selectedRecipe.categorie}</p>
                            <p>Temps de préparation : ${selectedRecipe.temps_preparation}</p>
                            <button class="voirDetails" data-id="${selectedRecipe.nom}">Voir détails</button>
                        </div>
                    `;
                    $("#recipesSection").empty().prepend(recetteHTML); // Vider et remplacer le contenu par la recette sélectionnée
                }
            }
        });

        function filtrerParIngredient(ingredient) {
            return recettes.filter(function(recette) {
                return recette.ingredients.some(function(ing) {
                    // Utilisez ing.nom pour accéder au nom de l'ingrédient
                    return ing.nom.toLowerCase().includes(ingredient.toLowerCase());
                });
            });
        }
        

        // Gérer la saisie dans la barre de recherche
        $("#searchBar").on("input", function() {
            const valeurRecherchee = $(this).val().toLowerCase();
            if (valeurRecherchee.length > 2) {
                const recettesFiltrees = filtrerParIngredient(valeurRecherchee);
                afficherRecettes(recettesFiltrees);
            } else {
                $("#recipesSection").empty(); // Vider la section si la recherche est trop courte
            }
        });

        // Gérer le clic sur le bouton "Voir détails"
        $(document).on("click", ".voirDetails", function() {
            const nomRecette = $(this).data("id");
            window.location.href = `recette.html?nom=${encodeURIComponent(nomRecette)}`;
        });
    });
});
