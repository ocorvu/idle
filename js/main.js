import { Hero }  from './modules/hero.js';
import { Achievement } from './modules/achievements.js';
import {inactiveButton, activeButton, enableItem, 
        disableItem, showItem, hideItem, powerUp, 
        showPoints} from './modules/functions.js';

const firstButton = document.getElementById('first');
const secondButton = document.getElementById('second');
const menuItems = document.querySelectorAll('[data-button]');
const notEnoughCash = new Audio('sounds/not-enough-cash.mp3');
const musicButtons = document.querySelectorAll('[data-music]');
const heroesList = document.querySelectorAll('[data-heroes]');
const achievementList = document.querySelectorAll("[data-achievement='list']");
const heroes = {};
const achievements = {level: {}};

let volume = document.getElementById('volume');
let power = 1;
let points = 1;
let timestamp = 1000;

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
        
        heroName.innerText = heroes[heroId].name;
        
        heroes[heroId].update(heroLevel, heroCost);

        heroesList[hero].addEventListener('click', () => {
            if(heroes[heroId].canExist(heroes[heroes[heroId].getRequirement()])) {
                power = powerUp(heroId, heroes, points, power, notEnoughCash, volume);
                achievementsLoop();
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
        const menu = button.parentElement.parentElement
        hideItem(menu);
    });
});

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const value = item.dataset.button;
        showItem(value);
    });
});

musicButtons.forEach(button => {
    button.addEventListener('click', ()=> {
        const value = button.dataset.music;
        inactiveButton(volume);
        activeButton(value);
        
        if (value == 'off') {
            disableItem(volume);
        } else {
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
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `   <div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <h4>${title}</h4>`,
        `   <div>${hero} ${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');
    
    alertPlaceholder.append(wrapper);
}

function achievementsLoop() {
    for (const hero in heroes) {
        for (const achievement in achievements) {

            for (let level in achievements[achievement]) {
                if (heroes[hero].level >= level && !achievements[achievement][level].getAchieved(heroes[hero].name)) {
                    
                    heroes[hero].gainAchievement(achievements[achievement][level].name);
                    achievements[achievement][level].setAchieved(heroes[hero].name);
    
                    addAchiement(hero, level);
                    
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

function pointsLoop() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(plus(power), showPoints(points, 'box', 'clicks'));
        }, timestamp);
    });
}

async function gameLoop() {
    const game = await pointsLoop();
    window.requestAnimationFrame(gameLoop)
}
window.requestAnimationFrame(gameLoop);