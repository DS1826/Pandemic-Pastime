$("document").ready(function () {

    var ingredientsArray = [];
    var recipeArray = [];
    var index = 0;

    var apiKey = "2110241b69434bc091f80a84cfc427ad";

    //PARAMETERS
    //The maximum number of recipes to return (between 1 and 100). Defaults to 10
    var number = 5;
    //Whether to ignore typical pantry items, such as water, salt, flour, etc
    var ignorePantry = true;
    //Includes instructions in JSON object
    var includeInstructions = true;


    //Add ingredients button & functionality
    document.getElementById("addIngrBtn").onclick = function () {

        let ingredient = document.getElementById("ingredient").value;
        if (ingredient.length > 0 || ingredientsArray.length > 0) {
            let newItem = document.createElement("li")
            newItem.appendChild(document.createTextNode(ingredient));
            document.getElementById("ingredientList").appendChild(newItem);
            document.getElementById("ingredient").value = "";

            // Enable search button click after form input is valid
            document.getElementById("wine-query").disabled = false;
            document.getElementById("recipe-query").disabled = false;
            document.getElementById("wine-query").classList.remove("disabled");
            document.getElementById("recipe-query").classList.remove("disabled");


        } else {
            // alert ("you need to enter an ingredient");
             $("#alert-box").removeClass("hidden");

        }
    }

    //Clear Button
    document.getElementById("clearIngrBtn").onclick = function () {
        let parent = document.getElementById("ingredientList");
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        ingredientsArray = [];
        document.getElementById("wine-query").disabled = true;
        document.getElementById("recipe-query").disabled = true;
    }

    document.getElementById("formID").addEventListener("submit", function (e) {
        e.preventDefault();
        return false;
    });

    //Recipe search button & API call
    var ingredients = "";
    $("#recipe-query").on("click", function () {
        console.log("Recipe search button has been clicked");

        var list = document.getElementById('ingredientList').childNodes;
        for (var i = 0; i < list.length; i++) {
            var arrValue = list[i].innerHTML;
            ingredientsArray.push(arrValue);
            ingredients += "," + arrValue;
        }


        var queryURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&ignorePantry=" + ignorePantry + "&instructionsRequired=" + includeInstructions + "&number=" + number;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(response[0].image);
            console.log(response[0].title);
            console.log(response[0].id);
            // for (var i = 0; i < response[0].missedIngredients.length; i++) {
            //     console.log(response[0].missedIngredients[i].name);
            //     let newItem = document.createElement("li")
            //     newItem.appendChild(document.createTextNode(response[0].missedIngredients[i].name));
            //     document.getElementById("ingredientDisplay").appendChild(newItem);
                
            // }
           

            
           

            //function will append to webpag
            recipeArray = response;
            // renderRecipe();

            //This will get recipe instructions by the recipe ID
            var recipeID = response[0].id;
            var queryURL2 = "https://api.spoonacular.com/recipes/" + recipeID + "/information?apiKey=" + apiKey;

            $.ajax({
                url: queryURL2,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                console.log(response.instructions);

                $("#apiTitle").text(recipeArray[index].title);
                $(".recipe-img").attr("src", recipeArray[index].image);
                $("#instruct").text(response.instructions);
                $("#time").text(response.preparationMinutes + " minutes");

                for (i=0; i < ingredientsArray.length; i++) {
                    let newItem = document.createElement("li")
                    newItem.appendChild(document.createTextNode(ingredients[i]));
                    document.getElementById("ingredientDisplay").appendChild(newItem);
                }

                
            });

            
             //This will get recipe ingredients by the recipe ID
             var recipeID = response[index].id;
             var queryURL3 = "https://api.spoonacular.com/recipes/" + recipeID + "/ingredientWidget.json?apiKey=" + apiKey;
 
             $.ajax({
                 url: queryURL3,
                 method: "GET"
             }).then(function (response) {
                 console.log(response);
                 
                 var ingredients = response.ingredients;
                //  console.log(ingredients);
 
                 for (var i = 0; i < ingredients.length; i++) {

                    // var name = ingredients[i].name;
                    // var amount = ingredients[i].amount.us.value;
                    // var unit = ingredients[i].amount.us.unit;
                    // var image = response.ingredients[i].image;
                    // var listImg = $("<img>").attr("src", "ingredients[i].image");

                     var listItem = $("<li>").text(ingredients[i].name + "-" + ingredients[i].amount.us.value + " " + ingredients[i].amount.us.unit);
                     listItem.attr("id", "ing-item");
                     
                     $("#ingredientDisplay").append(listItem);
                    //  $("#ing-item").prepend(listImg);

                 }
 
                 
             });
    

        });

        console.log(ingredients);
        console.log(ingredientsArray);
        $("#recipe-display").removeClass("hidden");
        $("#search-options").addClass("hidden");

    });
    //Wine pairing search button & API call
    $("#wine-query").on("click", function () {
        console.log("Wine pairing button has been clicked");

        var list = document.getElementById('ingredientList').childNodes;
        for (var i = 0; i < list.length; i++) {
            var arrValue = list[i].innerHTML;
            ingredientsArray.push(arrValue);
            ingredients = arrValue
        }


        var queryURL = "https://api.spoonacular.com/food/wine/pairing?food=" + ingredients + "&apiKey=" + apiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            // console.log(response[index].imageUrl);
            // console.log(response[index].title);
            // console.log(response[index].id);

            WinePairArray = response;

            $("#wineName").text(response.pairedWines[0]);
            $("#wineDescrip").text(response.pairingText);



        });

        $("#wine-display").removeClass("hidden");
        $("#search-options").addClass("hidden");
    });


    //Wine pairing search button & API call
    $("#wine-query").on("click", function () {
        console.log("Wine pairing button has been clicked");

        var list = document.getElementById('ingredientList').childNodes;
        for (var i = 0; i < list.length; i++) {
            var arrValue = list[i].innerHTML;
            ingredientsArray.push(arrValue);
            ingredients = arrValue
        }


        var queryURL = "https://api.spoonacular.com/food/wine/pairing?food=" + ingredients + "&apiKey=" + apiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            WinePairArray = response;

            if (response.pairedWines[0] == null) {
                $("#wineName").text("No matches found");
                $("#wineDescrip").text("Sorry, no wine pairings found for that ingredient! Go back to the home page and try a different ingredient!");
            } else {
                var capitalizedWine = response.pairedWines[0].charAt(0).toUpperCase() + response.pairedWines[0].slice(1);
                $("#wineName").text(capitalizedWine);
                $("#wineDescrip").text(response.pairingText);
                $("#winePairImg").attr("src", response.productMatches[0].imageUrl);
            }



        });

        $("#wine-display").removeClass("hidden");
        $("#search-options").addClass("hidden");
    });
    //Clicking on the button on the winepairins page
    $("#backBtn").on("click", function () {

        $("#wine-display").addClass("hidden");
        $("#search-options").removeClass("hidden");
        $("#homeButton").addClass("hidden");


    })

    //Displays API info to page
    function renderRecipe() {
        $("#apiTitle").text(recipeArray[index].title);
        $(".recipe-img").attr("src", recipeArray[index].image);
        // $("#instruct").text(response.instructions);
        // $("#time").text(response.preparationMinutes + " minutes");
    }



    // //EDAMAM API Functionality

    var ingredients = "";
    $("#recipe-query").on("click", function () {
        console.log("Ready to display nutritional data");

        var list = document.getElementById('ingredientList').childNodes;
        for (var i = 0; i < list.length; i++) {
            var arrValue = list[i].innerHTML;
            ingredientsArray.push(arrValue);
            ingredients += "," + arrValue;
            console.log(arrValue);
        }

        $("#homeButton").addClass("hidden");
        $("#recipe-display").addClass("hidden");
        $("#wine-display").addClass("hidden");
        $("#search-options").removeClass("hidden");
        let parent = document.getElementById("ingredientDisplay");
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
      
        // var apiKey = "bfc7bebd&app_key=21bb623fe4e3afd71090437be434a117"
        // var queryURL = "https://api.edamam.com/api/food-database/v2/parser?ingr=" + ingredients + "&app_id=" + apiKey;


        // $.ajax({
        //     url: queryURL,
        //     method: "GET"
        // }).then(function (response) {
        //     console.log(response);
        //     for (var i = 0; i < response.parsed.length; i++) { 
        //     console.log (response.parsed[i]);
        //     console.log (response.parsed[i].food.nutrients);
        //     $('#nutri-info').append(`<li>${JSON.stringify(response).parsed[i].food.nutrients}</li>`);

        //     };
        // })
    });
        //Add an onclick "Next Recipe" to +1 the index
        var index = 0;
        // document.getElementById("NextBtn").onclick = function () {
        //     index++;
        //     renderRecipe();
        // }


        //CLICK Functions
        $("#homeButton").on("click", function () {
            console.log("homeButton button has been clicked");

            $("#homeButton").addClass("hidden");
            $("#recipe-display").addClass("hidden");
            $("#wine-display").addClass("hidden");
            $("#search-options").removeClass("hidden");

        });

        $("#recipe-query").on("click", function () {
            console.log("Recipe search button has been clicked");

            $("#homeButton").removeClass("hidden");
            $("#recipe-display").removeClass("hidden");
            $("#search-options").addClass("hidden");

        });

        $("#wine-query").on("click", function () {
            console.log("wine pairing button has been clicked");

            $("#homeButton").removeClass("hidden");
            $("#wine-display").removeClass("hidden");
            $("#search-options").addClass("hidden");

        });



        // Onclick event to close alert box pop up on homepage
        $("#close-btn").on("click", function () {

            $("#alert-box").addClass("hidden");

        });


    });