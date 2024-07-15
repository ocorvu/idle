import { Hero } from './modules/hero.js';
import { Achievement } from './modules/achievements.js';
import {
    inactiveButton, activeButton, enableItem,
    disableItem, showItem, hideItem, powerUp,
    showPoints, NumberUnitFormat, hasCssClass, 
    getDataAttribute, toggleElementsClass, syncHeroUprades, 
    playSound, canBuy, syncHeroCard,
    syncEnemieCard, buyOption, alert,
    addAchiement
} from './modules/functions.js';
import { newActivity } from './modules/feed.js';
import { Character } from './modules/character.js';
import { deadCharacter, fight, resetRound } from './modules/fight.js';
import { load } from './modules/localStorage.js';
import { buy } from './modules/buy.js';
import { BattleLog } from './modules/battlelog.js';

if (localStorage.getItem('characters') == null) {
    await load("data/characters.json");
}

const attackButtons = document.querySelectorAll("[data-button-attack]");
const battleFeed = document.getElementById('battle-feed');
const battleFeedCloseButton = document.getElementById('battle-feed-close-button');
const buyButtons = document.querySelectorAll('[data-buy-option]');
const clearLocalStorageButton = document.getElementById('limpaCache');
const closeMenuButtons = document.querySelectorAll('[data-menu-close-button]');
const firstButton = document.getElementById('first');
const heroesUpgradesList = document.querySelectorAll('[data-heroes]');
const navItems = document.querySelectorAll('[data-button]');
const musicButtons = document.querySelectorAll('[data-music]');
const notEnoughCash = new Audio('sounds/not-enough-cash.mp3');
const secondButton = document.getElementById('second');
const saveButton = document.getElementById('save');
const targets = document.querySelectorAll('[data-enemie-target]');
const volume = document.getElementById('volume');

const heroes = {};
const enemies = {};
const achievements = { level: {} };

let characters = JSON.parse(localStorage.getItem('characters'));
let points;
let power;
let timestamp = 1000;

// Recupera os points do Local Storage ou define o valor para 1
localStorage.getItem('points') ? (points = Number(localStorage.getItem('points'))) : (points = 1);
// Recupera o power do Local Storage ou define o valor para 1
localStorage.getItem('power') ? (power = Number(localStorage.getItem('power'))) : (power = 1);

function levelAchievements(first, last, step = 10) {
    for (let i = first; i <= last; i += step) {
        achievements['level'][`${i}`] = new Achievement(`Reaches ${i}`, `reaches level ${i}`);
    }
}

function plus(value) {
    points += value;
}

async function gameLoop() {
    const game = await pointsLoop();
    document.title = `Idle - ${NumberUnitFormat(points)}`
    window.requestAnimationFrame(gameLoop)
}

function achievementsLoop() {
    for (const hero in heroes) {
        for (const achievement in achievements) {

            for (let level in achievements[achievement]) {
                if (heroes[hero]._level >= level && !achievements[achievement][level].getAchieved(heroes[hero].name)) {

                    heroes[hero].gainAchievement(achievements[achievement][level].name);
                    achievements[achievement][level].setAchieved(heroes[hero].name);

                    addAchiement(hero, level);
                    newActivity(feed, `${heroes[hero].name} ${achievements[achievement][level].message}`)

                    alert(achievements[achievement][level].name, heroes[hero].name, achievements[achievement][level].message, '');
                }
            }
        }
    }
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 200);
    });
}

function respawnCountdown(deadCharacterName, respawnTime, character) {
    const respawnTimerSpan = document.querySelector(`[data-hero-card-respawn-timer="${deadCharacterName}"]`);

    respawnTimerSpan.classList.remove('hide');
    respawnTimerSpan.classList.add('card-respawn');

    setTimeout(() => {
        if (respawnTime < 1) {
            const atkButton = hasCssClass(attackButtons, 'hide');
            respawnTimerSpan.innerText = 'vivo';
            atkButton.classList.toggle('hide');
            switch (character) {
                case 'enemie':
                    saveEnemies(deadCharacterName)
                    break;
                case 'hero':
                    saveHeroes(deadCharacterName)
                    break;
                default:
                    break;
            }
        }
        respawnTimerSpan.innerText = respawnTime;

        respawnTime--;
        respawnCountdown(deadCharacterName, respawnTime, character);
    }, 1000)
}

function savePoints() {
    let localPoints = localStorage.setItem('points', points);
    let localPower = localStorage.setItem('power', power);
}

function saveHeroes(hero) {
    let localChars = localStorage.getItem("characters");
    let Chars = JSON.parse(localChars);

    let obj = '';
    obj = Object.assign(Chars.heroes, {
        [hero]: heroes[hero]
    })

    let saveHero = localStorage.setItem('characters', JSON.stringify(Chars));
}

function saveEnemies(enemie) {
    let localChars = localStorage.getItem("characters");
    let Chars = JSON.parse(localChars);

    let obj = '';
    obj = Object.assign(Chars.enemies, {
        [enemie]: enemies[enemie]
    })

    let saveEnemie = localStorage.setItem('characters', JSON.stringify(Chars));
}

function pointsLoop() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(plus(power), showPoints(NumberUnitFormat(points), 'box', 'clicks'));
        }, timestamp);
    });
}

function createCharacters(characters, heroes, enemies) {
    for (let character in characters) {
        if (character == 'heroes') {
            for (let hero in characters[character]) {
                const h = characters[character][hero];
                heroes[hero] = new Hero(h.name, h.totalHp, h.hp, h.atk, h.def, h.thumbnail, h._level, h.power, h.given_power, h.base_cost, h.cost_increase, h.require);
            }
        }
        if (character == 'enemies') {
            for (let enemie in characters[character]) {
                const e = characters[character][enemie];
    
                enemies[enemie] = new Character(e.name, e.totalHp, e.hp, e.atk, e.def, e.thumbnail);
    
                syncEnemieCard(enemies, enemie);
            }
        }
    }
}

function clickPoints(button, points) {
    button.addEventListener('click', () => {
        plus(points * power);
    });
}

createCharacters(characters, heroes, enemies);

levelAchievements(10, 100);

clickPoints(firstButton, 1);
clickPoints(secondButton, 99999999);

toggleElementsClass(targets, 'target');
toggleElementsClass(buyButtons, 'active');

heroesUpgradesList.forEach((hero) => {
    const heroId = hero.dataset.heroes;

    syncHeroCard(heroes, heroId);
    let requirement = heroes[heroId].getRequirement();
    requirement = heroes[requirement];
    
    if (heroes[heroId].canExist(requirement)) {
        syncHeroUprades(heroes, heroId, buyOption(buyButtons), points);
    }

    if (heroes[heroId].exists()) {
        const heroCard = document.querySelector(`[data-hero-card="${heroId}"]`);

        heroCard.classList.remove('hide');
        heroCard.classList.add('card', 'hero-card-border');
    }
    achievementsLoop();
});

heroesUpgradesList.forEach((hero) => {
    const heroId = hero.dataset.heroes;

    let requirement = heroes[heroId].getRequirement();
    requirement = heroes[requirement];
    hero.addEventListener('click', () => {
    if (heroes[heroId].canExist(requirement)) {

        let [cost, level] = buy(heroes[heroId], buyOption(buyButtons), points);

        if (canBuy(cost, points)) {
            let up = powerUp(heroes[heroId], points, power, level);
            achievementsLoop();

            [power, points] = up;

            const heroCard = document.querySelector(`[data-hero-card="${heroId}"]`);
            heroCard.classList.remove('hide');
            heroCard.classList.add('card', 'hero-card-border')

            syncHeroUprades(heroes, heroId, buyOption(buyButtons), points)
            saveHeroes(heroId);
            savePoints();
        } else {
            playSound(notEnoughCash, volume);
        }
    }
});
});

closeMenuButtons.forEach(button => {
    button.addEventListener('click', () => {
        const menuName = button.dataset.menuCloseButton
        const menu = document.querySelector(`[data-content="${menuName}"]`);
        switch (menuName) {
            case 'upgrades':
                menu.classList.toggle('show');
                menu.classList.toggle(`${menuName}-md`);
                break;
            case 'achievements':
                menu.classList.toggle('show');
                menu.classList.toggle(`${menuName}-md`);
                break;
            default:
                menu.classList.toggle('hide')
                break;
        }
    });
});

buyButtons.forEach((button) => {
    button.addEventListener('click', () => {

        let heroesCost = [...heroesUpgradesList].map((hero) => getDataAttribute(hero, 'heroes'))

        heroesCost.forEach((hero) => {
            syncHeroUprades(heroes, hero, getDataAttribute(button, 'buyOption'), points)
        })
    })
})
battleFeedCloseButton.addEventListener('click', () => {
    try {
        battleFeed.querySelector('h2').remove();
        battleFeed.querySelectorAll('p').forEach(n => n.remove());
    } catch (e) {
        console.warn(e);
    }

    battleFeed.close();
});

attackButtons.forEach(button => {
    button.addEventListener('click', () => {
        let attacker = button.dataset.buttonAttack;
        let defender = getDataAttribute(hasCssClass(targets, 'target'), 'enemieTarget');
        let battleLog = new BattleLog(heroes[attacker], enemies[defender], battleFeed);

        if (!heroes[attacker].is_dead() && !enemies[defender].is_dead()) {
            battleLog.title();

            battleFeed.showModal();

            fight(heroes[attacker], enemies[defender], battleLog);
            resetRound();

            let [deadCharacterName, deadCharacterRespawn] = deadCharacter();

            if (heroes[attacker].is_dead()) {

                button.classList.toggle('hide');
                respawnCountdown(deadCharacterName, deadCharacterRespawn, 'hero');
            }
            if (enemies[defender].is_dead()) {
                respawnCountdown(deadCharacterName, deadCharacterRespawn, 'enemie');
            }

            saveHeroes(attacker);
            saveEnemies(defender);
        } else {
            battleLog.log(`${heroes[attacker].name} está morto e não pode lutar`);
            battleFeed.showModal();
        }

        syncHeroCard(heroes, attacker);
        syncEnemieCard(enemies, defender);
    });
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const value = item.dataset.button;
        switch (value) {
            case 'information':
                hideItem('config');
                showItem('information');
                break;
            case 'config':
                hideItem('information');
                showItem('config');
                break;
            default:
                const menu = document.getElementById(value);

                menu.classList.toggle(`${value}-md`);
                menu.classList.toggle('show');
                break;
        }
    });
});

musicButtons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.music;
        inactiveButton(value, volume);
        activeButton(value);

        if (value == 'off') {
            disableItem(volume);
            inactiveButton('on', volume)
        } else {
            inactiveButton('off', volume)
            enableItem(volume);
        }
    });
});

saveButton.addEventListener('click', () => {
    const saveMessage = document.getElementById('saveMessage');
    savePoints();
    saveMessage.classList.remove('hide');

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(saveMessage.classList.add('hide'));
        }, 3000);
    });
});

clearLocalStorageButton.addEventListener('click', () => {
    const clearLocalStorageMessage = document.getElementById('limpaCacheMessage');
    localStorage.clear();
    clearLocalStorageMessage.classList.remove('hide');

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(
                clearLocalStorageMessage.classList.add('hide'),
                location.reload()
            );
        }, 3000);
    })
})

window.requestAnimationFrame(gameLoop);