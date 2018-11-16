import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state 
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

const controlSearch = async () => {
    // get query from view
    const query = searchView.getInput();
    console.log(query);

    if(query) {
        // new search object
        state.search = new Search(query);

        // prepare UI for result 
        // render loader 
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);


        // search for recipes
       await state.search.getResult();

        // render result on UI
        console.log(state.search.result)
        clearLoader();
        searchView.renderResult(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();

});

