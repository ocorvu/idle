import { Hero } from './modules/hero.js';
import { Achievement } from './modules/achievements.js';
import {
    inactiveButton, activeButton, enableItem,
    disableItem, showItem, hideItem, powerUp,
    showPoints, NumberUnitFormat, hasCssClass, 
    getDataAttribute, toggleElementsClass, syncHeroUpgrades, 
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

const attackButtons = document.querySelectorAll('[data-button-attack]');
const battleFeed = document.getElementById('battle-feed');
const battleFeedCloseButton = document.getElementById('battle-feed-close-button');
const buyButtons = document.querySelectorAll('[data-buy-option]');
const clearLocalStorageButton = document.getElementById('limpaCache');
const closeMenuButtons = document.querySelectorAll('[data-menu-close-button]');
const trainButton = document.getElementById('first');
const hackButton = document.getElementById('second');
const heroesUpgradesList = document.querySelectorAll('[data-heroes]');
const navItems = document.querySelectorAll('[data-button]');
const musicButtons = document.querySelectorAll('[data-music]');
const notEnoughCash = new Audio('sounds/not-enough-cash.mp3');
const saveButton = document.getElementById('save');
const targets = document.querySelectorAll('[data-target]');
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

function respawnCountdown(deadCharacterName, respawnTime, type, button) {
    const respawnTimerSpan = document.querySelector(`[data-character-card-respawn-timer="${deadCharacterName}"]`);

    respawnTimerSpan.classList.remove('hide');
    respawnTimerSpan.classList.add('card-respawn');

    setTimeout(() => {
        if (respawnTime < 1) {
            respawnTimerSpan.innerText = 'vivo';
            switch (type) {
                case 'Character':
                    button.classList.toggle('hide');
                    saveEnemies(deadCharacterName)
                    return;
                case 'Hero':
                    button.classList.toggle('hide') 
                    saveHeroes(deadCharacterName)
                    return;
                default:
                    break;
            }
        }
        respawnTimerSpan.innerText = respawnTime;
        respawnTime--;
        respawnCountdown(deadCharacterName, respawnTime, type, button);
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
                heroes[hero] = new Hero(h.name, h.totalHp, h.hp, h.atk, h.def, h.thumbnail, h._level, h.power, h.given_power, h.base_cost, h.cost_increase, h.require, h.dependant);
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

clickPoints(trainButton, 1);
clickPoints(hackButton, 99999999);

toggleElementsClass(targets, 'target');
toggleElementsClass(buyButtons, 'active');

heroesUpgradesList.forEach((hero) => {
    const heroId = hero.dataset.heroes;

    syncHeroCard(heroes, heroId);
    let requirement = heroes[heroId].getRequirement();
    requirement = heroes[requirement];
    
    if (heroes[heroId].canExist(requirement)) {
        syncHeroUpgrades(heroes, heroId, buyOption(buyButtons), points);
    }

    if (heroes[heroId].exists()) {
        const heroCard = document.querySelector(`[data-character-card="${heroId}"]`);

        heroCard.classList.remove('hide');
        heroCard.classList.add('card', 'hero-card-border');
    }
    achievementsLoop();
});

heroesUpgradesList.forEach((hero) => {
    const heroId = hero.dataset.heroes;

    let requirement = heroes[heroId].getRequirement();
    let dependant = heroes[heroId].getDependant();
    requirement = heroes[requirement];
    dependant = heroes[dependant];
    hero.addEventListener('click', () => {
    if (heroes[heroId].canExist(requirement)) {

        let [cost, level] = buy(heroes[heroId], buyOption(buyButtons), points);

        if (canBuy(cost, points)) {
            let up = powerUp(heroes[heroId], points, power, level);
            achievementsLoop();

            [power, points] = up;
            if ( heroId != 'shadow' && dependant.canExist(heroes[dependant.getRequirement()])) {
                syncHeroUpgrades(heroes, dependant.name.toLowerCase(), buyOption(buyButtons), points);
            }
            const heroCard = document.querySelector(`[data-character-card="${heroId}"]`);
            heroCard.classList.remove('hide');
            heroCard.classList.add('card', 'hero-card-border')

            syncHeroUpgrades(heroes, heroId, buyOption(buyButtons), points)
            saveHeroes(heroId);
            savePoints();
            trainButton.disable = false;
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

        let heroesCost = [...heroesUpgradesList].map((heroId) => getDataAttribute(heroId, 'heroes'))

        heroesCost.forEach((heroId) => {
                let requirement = heroes[heroId].getRequirement();
                requirement = heroes[requirement];
            if (heroes[heroId].canExist(requirement)) {
                syncHeroUpgrades(heroes, heroId, buyOption(buyButtons), points);
            }
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
        let target = hasCssClass(targets, 'target') || false;
        if (!target) {
            newActivity(feed, 'oie');
            return;
        }
        let defender = getDataAttribute(target, 'target');

        let battleLog = new BattleLog(heroes[attacker], enemies[defender], battleFeed);
        let character;

        if (!heroes[attacker].is_dead() && !enemies[defender].is_dead()) {
            battleLog.title();

            battleFeed.showModal();

            fight(heroes[attacker], enemies[defender], battleLog);
            resetRound();

            character = deadCharacter();

            switch (character.type()) {
                case 'Character':
                    target.classList.toggle('hide');
                    target.classList.remove('target');
                    respawnCountdown(character.name.toLowerCase(), character.respawnCooldown, character.type(), target);
                    break;
                case 'Hero':
                    button.classList.toggle('hide');
                    respawnCountdown(character.name.toLowerCase(), character.respawnCooldown, character.type(), button);
                    break;
                default:
                    break;
            }

            saveHeroes(attacker);
            saveEnemies(defender);
        } else {
            battleLog.log(`${character.name} está morto e não pode lutar`);
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