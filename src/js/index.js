import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import FavoriteRecipe from './models/FavoriteRecipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state 
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};
window.state = state;

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // get query from view
    const query = searchView.getInput();
    console.log(query);

    if (query) {
        // new search object
        state.search = new Search(query);

        // prepare UI for result 
        // render loader 
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        // search for recipes
        try {
            await state.search.getResult();
            // render result on UI 
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something went wrong');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);
    }
})

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // hightlight selected recipe
        if (state.search) searchView.highlightSelected(id);

        // create new recipe object
        state.recipe = new Recipe(id);

        // get recipe data
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe 
            console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            console.log(state.recipe);

        } catch (error) {
            alert('Error processing recipe');
        }
    }
}

/**
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// handle delete and update list items
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle the delete method
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id);

        // delete from UI
        listView.deleteItem(id);

        // handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, value);
    }
});

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * FAVORITE_RECIPE CONTROLLER
 */
const controlfavoriteRecipe = () => {
    if(!state.favoriteRecipe) state.favoriteRecipe = new FavoriteRecipe();
    const currentID = state.recipe.id;
    
    // user has NOT yet liked current recipe
    if(!state.favoriteRecipe.isLiked(currentID)) {
        // add like to the  state
        const newFavoriteRecipe = state.favoriteRecipe.addFavoriteRecipe(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // toggle the like button

        // add favoriteRecipe to UI list
            console.log(state.favoriteRecipe);

    // user HAS liked current recipe
    } else {
         // remove from from state
            state.favoriteRecipe.deleteLike(currentID);
            
        // toggle the like button

        // Remove favoriteRecipe from UI list
        console.log(state.favoriteRecipe);  
    }
};

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // add ingredient to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // favorite_recipe controller
        controlfavoriteRecipe(); 
    }
});

window.l = new List();