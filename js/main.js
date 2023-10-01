import { Hero }  from './modules/hero.js';
import { Achievement } from './modules/achievements.js';
import {inactiveButton, activeButton, enableItem, 
        disableItem, showItem, hideItem, powerUp, 
        showPoints, NumberUnitFormat} from './modules/functions.js';
import { newActivity } from './modules/feed.js';

import { fight } from './modules/fight.js'
// import { heroesLocal } from './modules/localStorage.js';

// import { heroesLocal } from './modules/localStorage.js';

let heroismo = '';

async function load() {
    let loadCharacters = await import('./modules/localStorage.js');
}

if(!localStorage.getItem('characters')) {
    load()
}

let characters = JSON.parse(localStorage.getItem('characters'));

const firstButton = document.getElementById('first');
const secondButton = document.getElementById('second');
const menuItems = document.querySelectorAll('[data-button]');
const notEnoughCash = new Audio('sounds/not-enough-cash.mp3');
const musicButtons = document.querySelectorAll('[data-music]');
const saveButton = document.getElementById('save');
const heroesList = document.querySelectorAll('[data-heroes]');
const achievementList = document.querySelectorAll("[data-achievement='list']");
const heroes = {};
const achievements = {level: {}};

let volume = document.getElementById('volume');
let power = 1;
let points = 1;
let timestamp = 1000;

if (localStorage.getItem('points')) {
    points = Number(localStorage.getItem('points'))
} else{
    points = 1
}

heroes['hero1'] = new Hero('Meuso', 3, 10, 1.22, '');
heroes['hero2'] = new Hero('Rebento', 10, 200, 3, 'hero1');
heroes['hero3'] = new Hero('Kaom', 7, 150, 1.65, 'hero2');
heroes['hero4'] = new Hero('Brine King', 6, 100, 1.7, 'hero3');
heroes['hero5'] = new Hero('Shadow', 10, 500, 1.3, 'hero4');

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
    plus(1*power);
    showPoints(points, 'box')
})
secondButton.addEventListener('click', () => {
    plus(99999999*power);
    showPoints(points, 'box')
})

function levelAchievements(first, last, step = 10) {
    for (let i = first; i <= last; i += step) {
        achievements['level'][`${i}`] = new Achievement(`Reaches ${i}`, `reaches level ${i}`);
    }
}

for (const hero in heroesList) {
    if (Object.hasOwnProperty.call(heroesList, hero)) {
        
        const heroId = heroesList[hero].dataset.heroes;
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

        heroesList[hero].addEventListener('click', () => {
            if(heroes[heroId].canExist(heroes[heroes[heroId].getRequirement()])) {
                let up = powerUp(heroId, heroes, points, power, notEnoughCash, volume);
                achievementsLoop();

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
    button.addEventListener('click', () =>{
        const menu = button.parentElement.parentElement.dataset.content
        hideItem(menu);
    });
});

const closeMenuButtons = document.querySelectorAll('[data-close-button]');

closeMenuButtons.forEach(button => {
    button.addEventListener('click', () => {
        const content = button.dataset.closeButton
        const menuToClose = document.querySelector(`[data-content="${content}"]`);
        menuToClose.classList.toggle('show')
        menuToClose.classList.toggle(`${content}-md`)
    });
});

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
    button.addEventListener('click', ()=> {
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

const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

const alert = (title, hero, message, type) => {
    const notification = document.createElement('div');
    notification.innerHTML = [
        `   <div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <h4>${title}</h4>`,
        `   <div>${hero} ${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');
    
    alertPlaceholder.append(notification);

    return new Promise(resolve => (
        setTimeout(() =>{
            resolve(notification.remove())
        }, 5000)
    ))
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
                    
                    alert(achievements[achievement][level].name, heroes[hero].name, achievements[achievement][level].message, 'success');
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