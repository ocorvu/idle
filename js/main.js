import { Hero }  from './modules/hero.js'
import { Achievement } from './modules/achievements.js'

const firstButton = document.getElementById('first')
const secondButton = document.getElementById('second')
const menuItems = document.querySelectorAll('[data-button]')
const notEnoughCash = new Audio('sounds/not-enough-cash.mp3');
const musicButtons = document.querySelectorAll('[data-music]');
const heroesList = document.querySelectorAll('[data-heroes]')
const achievementList = document.querySelectorAll("[data-achievement='list']")


function addAchiement(heroId, achieved) {
    achievementList.forEach(item => {
        const hero = document.querySelector(`[data-achievement-hero='${heroId}'`);
        const heroAchievements = hero.childNodes[3];
        const achievement = document.createElement('li')
        achievement.innerHTML = achieved

        achievement.classList.add('hero-cost-value')

        heroAchievements.appendChild(achievement)
    })
}

firstButton.addEventListener('click', () => {
    plus(1*power, 'box', 'clicks')
})
secondButton.addEventListener('click', () => {
    plus(99999999*power, 'box', 'clicks')
})
const heroes = {}

heroes['hero1'] = new Hero('Meuso', 3, 10, 1.22)
heroes['hero2'] = new Hero('Rebento', 10, 200, 3)
heroes['hero3'] = new Hero('Kaom', 7, 150, 1.65)
heroes['hero4'] = new Hero('Brine King', 6, 100, 1.7)
heroes['hero5'] = new Hero('Shadow', 10, 500, 1.3)

const achievements = {};
levelAchievements(10, 100)

function levelAchievements(first, last, step = 10) {
    for (let i = first; i <= last; i += step) {
        achievements[`${i}`] = new Achievement(`Reachs ${i}`, `reachs level ${i}`)
    }
}

function achievementsLoop() {
    for (const hero in heroes) {
        for (const achievement in achievements) {
            if (heroes[hero].level == achievement && !achievements[achievement].getAchieved(heroes[hero].name)) {
                
                heroes[hero].gainAchievement(achievements[achievement].name)
                achievements[achievement].setAchieved(heroes[hero].name)

                addAchiement(hero, achievements[achievement].name)
                
                alert(achievements[achievement].name, heroes[hero].name, achievements[achievement].message, 'success')
            }
        }
    }
    return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 200);
    });
}

async function asyncAchievement() {
    const result = await achievementsLoop()
    window.requestAnimationFrame(asyncAchievement)
}
window.requestAnimationFrame(asyncAchievement)

let volume = document.getElementById('volume');
let power = 1;
let points = 0;
let time = 1;
let timestamp = 1000;
 
for (const hero in heroesList) {
    if (Object.hasOwnProperty.call(heroesList, hero)) {
        
        const heroId = heroesList[hero].dataset.heroes;
        const heroName = document.querySelector(`[data-heroes-name="${heroId}"]`)
        const heroCost = document.querySelector(`[data-heroes-cost="${heroId}"]`)
        const heroLevel = document.querySelector(`[data-heroes-level="${heroId}"]`)

        heroName.innerText = heroes[heroId].name

        heroes[heroId].update(heroLevel, heroCost)

        heroesList[hero].addEventListener('click', () => {
            powerUp(heroId)
        })
        heroesList[hero].addEventListener('mouseenter', () => {
            tooltipList()
        })
        heroesList[hero].addEventListener('mouseleave', () => {
            tooltipDestroy()
        })
    }
}

function plus(value, ...params) {
    points += value;
    params.forEach (el => {
        let element = document.getElementById(el);
        element.innerText = points;
    })
}

function powerUp(e) {
    const hero = heroes[e]
    if (points >= hero.base_cost){
        const heroLevel = document.querySelector(`[data-heroes-level="${e}"]`);
        const heroCost = document.querySelector(`[data-heroes-cost="${e}"]`);

        points -= hero.base_cost
        hero.levelUp(power, points);
        power += hero.power
        hero.update(heroLevel, heroCost);

    } else {
        notEnoughCash.volume = volume.value;
        notEnoughCash.play();
    }
}

function hideItem(e) {
    e.classList.add('hide')
}

function showItem(e) {
    const item = document.querySelector(`[data-content="${e}"]`);
    item.classList.remove('hide')
}

function disableItem(e) {
    e.setAttribute('disabled', '')
}

function enableItem(e) {
    e.removeAttribute('disabled')
}

function activeButton(e) {
    const button = document.querySelector(`[data-music="${e}"]`)
    button.classList.add('active')
}

function inactiveButton() {
    musicButtons.forEach(button => button.classList.remove('active'))
    volume.value = 0
}

const closeButtons = document.querySelectorAll('.settings-close-button')

closeButtons.forEach(button => {
    button.addEventListener('click', () =>{
        const menu = button.parentElement.parentElement
        hideItem(menu)
    })
})

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const value = item.dataset.button
        showItem(value)
    })
})

musicButtons.forEach(button => {
    button.addEventListener('click', ()=> {
        const value = button.dataset.music
        inactiveButton()
        activeButton(value)

        if (value == 'off') {
            disableItem(volume)
        } else {
            enableItem(volume)
        }
    })
})

function gameLoop() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(plus(power, 'box','clicks'));
      }, timestamp);
    });
  }

async function asyncCall() {
    const result = await gameLoop();
    window.requestAnimationFrame(asyncCall)
}
window.requestAnimationFrame(asyncCall)


const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = () => [...tooltipTriggerList].map(tooltipTriggerEl => {
    const hero = tooltipTriggerEl.dataset.heroes

    new bootstrap.Tooltip(tooltipTriggerEl)
    tooltipTriggerEl.setAttribute('data-bs-title', 
    `<h3>${heroes[hero].name}</h3>
    <p>Increases gain points in: ${heroes[hero].given_power}`
    )
    bootstrap.Tooltip.getOrCreateInstance(tooltipTriggerEl).dispose()
    new bootstrap.Tooltip(tooltipTriggerEl)
})

const tooltipDestroy = () => {
    [...tooltipTriggerList].map(tooltipTriggerEl => {
        const tooltip = bootstrap.Tooltip.getOrCreateInstance(tooltipTriggerEl).dispose()
    })
}

const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

const alert = (title, hero, message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `   <div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <h4>${title}</h4>`,
    `   <div>${hero} ${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}
