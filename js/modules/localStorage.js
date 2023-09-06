import { Character } from './character.js';

import data from '../../data/characters.json' assert { type: 'json' };

const heroesLocal = []
const enemiesLocal = []

data.heroes.forEach(hero => {
    heroesLocal[hero.name.toLocaleLowerCase()] = new Character(hero.name, hero.hp, hero.atk, hero.def, hero.thumbnail)
});

data.enemies.forEach(enemie => {
    enemiesLocal[enemie.name.toLocaleLowerCase()] = new Character(enemie.name, enemie.hp, enemie.atk, enemie.def, enemie.thumbnail)
});

let characters =
{
    heroes: {},
    enemies: {}
}

let obj = ''

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

let items = localStorage.setItem('characters', JSON.stringify(characters)) 

// localStorage.clear()

export {heroesLocal, enemiesLocal}