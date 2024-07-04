import { Hero } from './modules/hero.js';
import { Achievement } from './modules/achievements.js';
import {
    inactiveButton, activeButton, enableItem,
    disableItem, showItem, hideItem, powerUp,
    showPoints, NumberUnitFormat, hasCssClass, getDataAttribute, toggleElementsClass, syncHeroUprades, playSound, canBuy
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

const firstButton = document.getElementById('first');
const secondButton = document.getElementById('second');
const menuItems = document.querySelectorAll('[data-button]');
const notEnoughCash = new Audio('sounds/not-enough-cash.mp3');
const musicButtons = document.querySelectorAll('[data-music]');
const closeButtons = document.querySelectorAll('.settings-close-button');
const closeMenuButtons = document.querySelectorAll('[data-close-button]');
const saveButton = document.getElementById('save');
const clearLocalStorageButton = document.getElementById('limpaCache');
const heroesList = document.querySelectorAll('[data-heroes]');
const targets = document.querySelectorAll('[data-enemie-target]');
const buyButtons = document.querySelectorAll('[data-buy-option]');
const battleFeed = document.getElementById('battle-feed');
const attackButtons = document.querySelectorAll("[data-button-attack]");
const battleFeedCloseButton = document.getElementById('battle-feed-close-button');
const heroes = {};
const enemies = {};
const achievements = { level: {} };

let characters = JSON.parse(localStorage.getItem('characters'));
let points;
let power;
let timestamp = 1000;
let volume = document.getElementById('volume');

if (localStorage.getItem('points')) {
    points = Number(localStorage.getItem('points'));
    console.log('if - points');
} else {
    points = 1;
    console.log('else - points');
}

if (localStorage.getItem('power')) {
    power = Number(localStorage.getItem('power'));
    console.log('if - power');
} else {
    power = 1;
    console.log('else - power');
}

const alert = (title, hero, message, type) => {
    const alertPlaceholder = document.getElementById('alertPlaceHolder');
    const notification = document.createElement('article');
    notification.classList.add('alertBox');

    notification.innerHTML = [
        '<section class="alertBody" class="alertTile">',
        `<h4 class="alertTitle">${title}</h4>`,
        `<p>${hero} ${message}</p>`,
        '</section>',
        '<button type="button" id="closeAlert" class="close">X</button>',
    ].join('');

    alertPlaceholder.append(notification);
    const alertCloseButton = document.getElementById('closeAlert');

    alertCloseButton.addEventListener('click', () => {
        notification.remove();
    });

    return new Promise(resolve => (
        setTimeout(() => {
            resolve(notification.remove());
        }, 5000)
    ));
}

function addAchiement(heroName, achieved) {
    const hero = document.querySelector(`[data-achievement-hero-list='${heroName}'`);
    const achievement = document.createElement('li');

    achievement.innerHTML = achieved;

    achievement.classList.add('hero-achievement-level');

    hero.appendChild(achievement);
}

function levelAchievements(first, last, step = 10) {
    for (let i = first; i <= last; i += step) {
        achievements['level'][`${i}`] = new Achievement(`Reaches ${i}`, `reaches level ${i}`);
    }
}

function syncHeroCard(hero) {
    const heroCardThumb = document.querySelector(`[data-hero-card-thumb="${hero}"]`);
    const heroCardName = document.querySelector(`[data-hero-card-name="${hero}"]`);
    const heroCardHp = document.querySelector(`[data-hero-card-hp="${hero}"]`);
    const heroCardTotalHp = document.querySelector(`[data-hero-card-total-hp="${hero}"]`);
    const heroCardHpBar = document.querySelector(`[data-hero-card-hp-bar="${hero}"]`);
    const heroCardAtk = document.querySelector(`[data-hero-card-atk="${hero}"]`);
    const heroCardDef = document.querySelector(`[data-hero-card-def="${hero}"]`);

    heroCardName.innerText = heroes[hero].name;
    heroCardAtk.innerText = heroes[hero].atk;
    heroCardDef.innerText = heroes[hero].def;

    heroCardHp.innerText = heroes[hero].hp;
    heroCardTotalHp.innerText = heroes[hero].totalHp;

    heroCardHpBar.value = heroes[hero].hp;
    heroCardHpBar.max = heroes[hero].totalHp;
    heroCardHpBar.innerText = heroes[hero].hp;

    heroCardThumb.src = heroes[hero].thumbnail;
}

function syncEnemieCard(enemie) {
    const enemieCardThumb = document.querySelector(`[data-enemie-card-thumb="${enemie}"]`);
    const enemieCardName = document.querySelector(`[data-enemie-card-name="${enemie}"]`);
    const enemieCardHp = document.querySelector(`[data-enemie-card-hp="${enemie}"]`);
    const enemieCardTotalHp = document.querySelector(`[data-enemie-card-total-hp="${enemie}"]`);
    const enemieCardHpBar = document.querySelector(`[data-enemie-card-hp-bar="${enemie}"]`);
    const enemieCardAtk = document.querySelector(`[data-enemie-card-atk="${enemie}"]`);
    const enemieCardDef = document.querySelector(`[data-enemie-card-def="${enemie}"]`);

    enemieCardName.innerText = enemies[enemie].name;
    enemieCardAtk.innerText = enemies[enemie].atk;
    enemieCardDef.innerText = enemies[enemie].def;

    enemieCardHp.innerText = enemies[enemie].hp;
    enemieCardTotalHp.innerText = enemies[enemie].totalHp;

    enemieCardHpBar.value = enemies[enemie].hp;
    enemieCardHpBar.max = enemies[enemie].totalHp;
    enemieCardHpBar.innerText = enemies[enemie].hp;

    enemieCardThumb.src = enemies[enemie].thumbnail;
}

function plus(value) {
    points += value;
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

            syncEnemieCard(enemie);
        }
    }
}

levelAchievements(10, 100);

firstButton.addEventListener('click', () => {
    plus(1 * power);
    showPoints(points, 'box');
})
secondButton.addEventListener('click', () => {
    plus(99999999 * power);
    showPoints(points, 'box');
})

heroesList.forEach((hero) => {

    const heroId = hero.dataset.heroes;

    let buyOption = () => { return getDataAttribute(hasCssClass(buyButtons, 'active'), 'buyOption') };

    syncHeroCard(heroId);
    syncHeroUprades(heroes, heroId, buyOption(), points);

    if (heroes[heroId].exists()) {
        const heroCard = document.querySelector(`[data-hero-card="${heroId}"]`);

        heroCard.classList.remove('hide');
        heroCard.classList.add('card', 'hero-card-border');
    }

    achievementsLoop();

    hero.addEventListener('click', () => {
        let requirement = heroes[heroId].getRequirement();
        requirement = heroes[requirement];

        if (heroes[heroId].canExist(requirement)) {

            let [cost, level] = buy(heroes[heroId], buyOption(), points);

            if (canBuy(cost, points)) {
                let up = powerUp(heroes[heroId], points, power, level);
                achievementsLoop();

                [power, points] = up;

                const heroCard = document.querySelector(`[data-hero-card="${heroId}"]`);
                heroCard.classList.remove('hide');
                heroCard.classList.add('card', 'hero-card-border')

                syncHeroUprades(heroes, heroId, buyOption(), points)
                saveHeroes(heroId);
                savePoints();
            } else {
                playSound(notEnoughCash, volume);
            }
        }
    })
})

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const menu = button.parentElement.parentElement.dataset.content
        hideItem(menu);
    });
});

closeMenuButtons.forEach(button => {
    button.addEventListener('click', () => {
        const content = button.dataset.closeButton;
        const menuToClose = document.querySelector(`[data-content="${content}"]`);
        menuToClose.classList.toggle('show');
        menuToClose.classList.toggle(`${content}-md`);
    });
});

toggleElementsClass(targets, 'target');
toggleElementsClass(buyButtons, 'active');

buyButtons.forEach((button) => {
    button.addEventListener('click', () => {

        let heroesCost = [...heroesList].map((hero) => getDataAttribute(hero, 'heroes'))

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

        syncHeroCard(attacker);
        syncEnemieCard(defender);
    });
});

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

menuItems.forEach(item => {
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

async function gameLoop() {
    const game = await pointsLoop();
    document.title = `Idle - ${NumberUnitFormat(points)}`
    window.requestAnimationFrame(gameLoop)
}
window.requestAnimationFrame(gameLoop);