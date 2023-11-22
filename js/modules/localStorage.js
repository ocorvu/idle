import { Character } from './character.js';
import { Hero } from './hero.js';

const heroesLocal = [];
const enemiesLocal = [];

async function requestData(path) {
    let obj;
  
    const res = await fetch(path);
  
    obj = await res.json();
  
    return obj
  }
  
const data = await requestData('../../data/characters.json');

data.heroes.forEach(hero => {
    heroesLocal[hero.name.toLocaleLowerCase()] = new Hero(hero.name, hero.hp, hero.atk, hero.def, hero.thumbnail, hero.level, hero.power, hero.given_power, hero.base_cost, hero.cost_increase, hero.require);
});

data.enemies.forEach(enemie => {
    enemiesLocal[enemie.name.toLocaleLowerCase()] = new Character(enemie.name, enemie.hp, enemie.atk, enemie.def, enemie.thumbnail);
});

let characters = {
    heroes: {},
    enemies: {}
}

let obj = '';

for (let hero in heroesLocal) {
    obj = Object.assign(characters.heroes, {
        [hero]: heroesLocal[hero]
    });
}

for (let enemie in enemiesLocal) {
    obj = Object.assign(characters.enemies, {
        [enemie]: enemiesLocal[enemie]
    });
}

let items = localStorage.setItem('characters', JSON.stringify(characters));

export { heroesLocal, enemiesLocal }