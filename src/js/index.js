import axios from 'axios';

async function getResult(query) {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = '199125905b110cd830a0145b7816c544';
    try {
        const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`);
        const recipes = res.data.recipes;
        const count = res.data.count;
        console.log(count);
        console.log(recipes);
    } catch (error) {
        alert(error);
    }  
}

getResult('pizza');