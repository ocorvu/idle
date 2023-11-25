import { Hero } from './modules/hero.js';
import { Achievement } from './modules/achievements.js';
import {
    inactiveButton, activeButton, enableItem,
    disableItem, showItem, hideItem, powerUp,
    showPoints, NumberUnitFormat
} from './modules/functions.js';
import { newActivity } from './modules/feed.js';
import { Character } from './modules/character.js';
import { fight, resetRound } from './modules/fight.js';

async function load() {
    let loadCharacters = await import('./modules/localStorage.js');
}

if (localStorage.getItem('characters') == null) {
    await load();
}

let characters = JSON.parse(localStorage.getItem('characters'));

const firstButton = document.getElementById('first');
const secondButton = document.getElementById('second');
const menuItems = document.querySelectorAll('[data-button]');
const notEnoughCash = new Audio('sounds/not-enough-cash.mp3');
const musicButtons = document.querySelectorAll('[data-music]');
const saveButton = document.getElementById('save');
const clearLocalStorageButton = document.getElementById('limpaCache');
const heroesList = document.querySelectorAll('[data-heroes]');
const enemiesList = document.querySelectorAll('[data-enemies]');
const targets = document.querySelectorAll('[data-enemie-target]');
const achievementList = document.querySelectorAll("[data-achievement='list']");
const heroes = {};
const enemies = {};
const achievements = { level: {} };


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

    alertCloseButton.addEventListener('click',  () => {
        notification.remove();
    })

    return new Promise(resolve => (
        setTimeout(() => {
            resolve(notification.remove());
        }, 10000)
    ))
}
let volume = document.getElementById('volume');
let power = 1;
let points = 1;
let timestamp = 1000;

if (localStorage.getItem('points')) {
    points = Number(localStorage.getItem('points'));
} else {
    points = 1;
}

for (let character in characters) {
    if (character == 'heroes') {
        for (let hero in characters[character]) {
            const h = characters[character][hero];
            heroes[hero] = new Hero(h.name, h.totalHp, h.hp, h.atk, h.def, h.thumbnail, h.level, h.power, h.given_power, h.base_cost, h.cost_increase, h.require);
        }
    }
    if (character == 'enemies') {
        for (let enemie in characters[character]) {
            const e = characters[character][enemie];
            

            syncEnemieCard(enemie);
        }
    }
}

levelAchievements(10, 100);

function addAchiement(heroId, achieved) {
    achievementList.forEach(item => {
        const hero = document.querySelector(`[data-achievement-hero='${heroId}'`);
        const heroAchievements = hero.childNodes[3];
        const achievement = document.createElement('li');
        achievement.innerHTML = achieved;

        achievement.classList.add('hero-achievement-level');

        heroAchievements.appendChild(achievement);
    })
}

firstButton.addEventListener('click', () => {
    plus(1 * power);
    showPoints(points, 'box');
})
secondButton.addEventListener('click', () => {
    plus(99999999 * power);
    showPoints(points, 'box');
})

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

for (const hero in heroesList) {
    if (Object.hasOwnProperty.call(heroesList, hero)) {

        const heroId = heroesList[hero].dataset.heroes;

        syncHeroCard(heroId);

        const heroName = document.querySelector(`[data-heroes-name="${heroId}"]`);
        const heroCost = document.querySelector(`[data-heroes-cost="${heroId}"]`);
        const heroLevel = document.querySelector(`[data-heroes-level="${heroId}"]`);
        const heroCardThumb = document.querySelector(`[data-heroes-card-thumb="${heroId}"]`);
        const heroCardName = document.querySelector(`[data-heroes-card-name="${heroId}"]`);
        const heroCardHp = document.querySelector(`[data-heroes-card-hp="${heroId}"]`);
        const heroCardTotalHp = document.querySelector(`[data-heroes-card-total-hp="${heroId}"]`);
        const heroCardHpBar = document.querySelector(`[data-heroes-card-hp-bar="${heroId}"]`);
        const heroCardAtk = document.querySelector(`[data-heroes-card-atk="${heroId}"]`);
        const heroCardDef = document.querySelector(`[data-heroes-card-def="${heroId}"]`);

        heroName.innerText = heroes[heroId].name;
        heroCardName.innerText = heroes[heroId].name;
        heroCardAtk.innerText = heroes[heroId].atk;
        heroCardDef.innerText = heroes[heroId].def;

        heroCardHp.innerText = heroes[heroId].hp;
        heroCardTotalHp.innerText = heroes[heroId].totalHp;

        heroCardHpBar.value = heroes[heroId].hp;
        heroCardHpBar.max = heroes[heroId].totalHp;
        heroCardHpBar.innerText = heroes[heroId].hp;

        heroCardThumb.src = heroes[heroId].thumbnail;

        heroes[heroId].update(heroLevel, heroCost);
        if (heroes[heroId].level > 0) {
            const heroCard = document.querySelector(`[data-hero-card="${heroId}"]`);
            heroCard.classList.remove('hide');
            heroCard.classList.add('card', 'hero-card-border')

        }
        achievementsLoop();

        heroesList[hero].addEventListener('click', () => {
            if (heroes[heroId].canExist(heroes[heroes[heroId].getRequirement()])) {
                let up = powerUp(heroId, heroes, points, power, notEnoughCash, volume);
                achievementsLoop();
                if (heroes[heroId].level > 0) {
                    const heroCard = document.querySelector(`[data-hero-card="${heroId}"]`);
                    heroCard.classList.remove('hide');
                    heroCard.classList.add('card', 'hero-card-border')
                }
                [power, points] = up;

                saveHeroes(heroId);
                savePoints();
            }
        })
        heroesList[hero].addEventListener('mouseenter', () => {
            tooltipList();
        })
        heroesList[hero].addEventListener('mouseleave', () => {
            tooltipDestroy();
        })
    }
}

function plus(value) {
    points += value;
}

const closeButtons = document.querySelectorAll('.settings-close-button');

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const menu = button.parentElement.parentElement.dataset.content
        hideItem(menu);
    });
});

const closeMenuButtons = document.querySelectorAll('[data-close-button]');

closeMenuButtons.forEach(button => {
    button.addEventListener('click', () => {
        const content = button.dataset.closeButton;
        const menuToClose = document.querySelector(`[data-content="${content}"]`);
        menuToClose.classList.toggle('show');
        menuToClose.classList.toggle(`${content}-md`);
    });
});

let currentTarget = '';

targets.forEach(target => {
    target.addEventListener('click', () => {
        target.classList.toggle('target');

        currentTarget = target.dataset.enemieTarget;

        let filteredTargets = [...targets].filter((t) => t.classList.contains('target') && t != target);
        filteredTargets.forEach(filteredTarget => {
            filteredTarget.classList.toggle('target');
        })
    })
})


const battleFeed = document.getElementById('battle-feed');
const attackButton = document.querySelectorAll("[data-button-attack]");

const battleFeedCloseButton = document.getElementById('battle-feed-close-button');
battleFeedCloseButton.addEventListener('click', () => {
    battleFeed.querySelectorAll('p').forEach(n => n.remove());
    battleFeed.close();
});

attackButton.forEach(button => {
    button.addEventListener('click', () => {
        battleFeed.showModal()
        let attacker = button.dataset.buttonAttack
        let defender = currentTarget

        if (heroes[attacker].hp > 0) {
            fight(heroes[attacker], enemies[defender], battleFeed);
            resetRound();
            saveHeroes(attacker);
            saveEnemies(defender);
        }

        syncHeroCard(attacker);
        syncEnemieCard(defender);
    })
})


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

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

const tooltipList = () => [...tooltipTriggerList].map(tooltipTriggerEl => {
    const hero = tooltipTriggerEl.dataset.heroes;

    new bootstrap.Tooltip(tooltipTriggerEl)
    tooltipTriggerEl.setAttribute('data-bs-title',
        `<h3>${heroes[hero].name}</h3>
    <p>Increases gain points in: ${heroes[hero].given_power}`
    );
    bootstrap.Tooltip.getOrCreateInstance(tooltipTriggerEl).dispose();
    new bootstrap.Tooltip(tooltipTriggerEl);
})

const tooltipDestroy = () => {
    [...tooltipTriggerList].map(tooltipTriggerEl => {
        const tooltip = bootstrap.Tooltip.getOrCreateInstance(tooltipTriggerEl).dispose();
    })
}


function achievementsLoop() {
    for (const hero in heroes) {
        for (const achievement in achievements) {

            for (let level in achievements[achievement]) {
                if (heroes[hero].level >= level && !achievements[achievement][level].getAchieved(heroes[hero].name)) {

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

clearLocalStorageButton.addEventListener ('click', () => {
    const clearLocalStorageMessage = document.getElementById('limpaCacheMessage');
    localStorage.clear();
    clearLocalStorageMessage.classList.remove('hide');

    return new Promise(resolve => {
        setTimeout (() => {
            resolve(
                clearLocalStorageMessage.classList.add('hide'),
                location.reload()
            );
        }, 3000);
    })
})

function pointsLoop() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(plus(power), showPoints(NumberUnitFormat(points), 'box', 'clicks'));
        }, timestamp);
    });
}

async function gameLoop() {
    const game = await pointsLoop();
    document.title = `Idle - ${NumberUnitFormat(points)}`
    window.requestAnimationFrame(gameLoop)
}
window.requestAnimationFrame(gameLoop);