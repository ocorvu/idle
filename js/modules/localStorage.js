import { requestData } from './functions.js';
import { Character } from './character.js';
import { Hero } from './hero.js';

async function createCharacters(path) {
    const data = await requestData(path);

    const characters = {
        heroes: {},
        enemies: {},
    };

    data.heroes.forEach(hero => {
        Object.assign(characters.heroes, {
            [hero.name.toLowerCase()]: new Hero(hero.name, hero.totalHp, hero.hp, hero.atk, hero.def, hero.thumbnail, hero.level, hero.power, hero.given_power, hero.base_cost, hero.cost_increase, hero.require)
        })
    });

    data.enemies.forEach(enemie => {
        Object.assign(characters.enemies, {
            [enemie.name.toLowerCase()]: new Character(enemie.name, enemie.totalHp, enemie.hp, enemie.atk, enemie.def, enemie.thumbnail)
        })
    });

    return characters;
}

async function load(file) {
    const characters = await createCharacters(file);

    const save = localStorage.setItem('characters', JSON.stringify(characters));
}

export {load}