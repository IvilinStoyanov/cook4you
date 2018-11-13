import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResult() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = '199125905b110cd830a0145b7816c544';
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }
}
