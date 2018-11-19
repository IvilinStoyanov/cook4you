export default class FavoriteRecipe {
    constructor() {
        this.favoriteRecipe = [];
    }

    addFavoriteRecipe(id, title, author, img) {
        const like = { id, title, author, img };
        this.favoriteRecipe.push(like);
    }

    deleteLike(id) {
        const index = this.favoriteRecipe.findIndex(el => el.id === id);
        this.favoriteRecipe.splice(index, 1);
    }

    isLiked(id) {
        return this.favoriteRecipe.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.favoriteRecipe.length;
    }
}