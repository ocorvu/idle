const firstButton = document.getElementById('first');
const secondButton = document.getElementById('second');
const menuItems = document.querySelectorAll('[data-button]')
const notEnoughCash = new Audio('sounds/not-enough-cash.mp3');
const musicButtons = document.querySelectorAll('[data-music]');
const heroesList = document.querySelectorAll('[data-heroes]')

const heroes = {
    "hero1":
    {
        "name": 'Meuso',
        "power": 3,
        "given_power": 0,
        "level": 0,
        "base_cost": 10,
        "cost_increase": 1.2,
        "achievements" : 0,
    },
    "hero2":
    {
        "name": 'Rebento',
        "power": 10,
        "given_power": 0,
        "level": 0,
        "base_cost": 200,
        "cost_increase": 5,
        "achievements" : 0,
    },
    "hero3":
    {
        "name": 'Kaom',
        "power": 7,
        "given_power": 0,
        "level": 0,
        "base_cost": 150,
        "cost_increase": 2,
        "achievements" : 0,
    },
    "hero4":
    {
        "name": 'Brine King',
        "power": 6,
        "given_power": 0,
        "level": 0,
        "base_cost": 100,
        "cost_increase": 2,
        "achievements" : 0,
    }
};

const achievements = {
    '10': {
        'name': 'Reachs 10',
        'message': 'reachs level 10!',
        'achieved': [],
    },
    '20': {
        'name': 'Reachs 20',
        'message': 'reachs level 20!',
        'achieved': [],
    },
    '30': {
        'name': 'Reachs 30',
        'message': 'reachs level 30!',
        'achieved': [],
    },
};

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
        heroCost.innerText = heroes[heroId].base_cost
        heroLevel.innerText = heroes[heroId].level
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

        hero.level += 1;
        power += hero.power;
        points -= hero.base_cost;
        hero.given_power += hero.power;
        hero.base_cost = Math.floor(hero.base_cost * hero.cost_increase);
        heroLevel.innerText = hero.level;
        heroCost.innerText = hero.base_cost;

    } else {
        notEnoughCash.volume = volume.value;
        notEnoughCash.play();
    }
}

function hideItem(e) {
    const item = document.querySelector(`[data-content="${e}"]`);
    item.classList.add('hide')
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

function achievementsLoop() {
    for (const hero in heroes) {
        for (const achievement in achievements) {
    
            if (heroes[hero].level == achievement && !achievements[achievement].achieved.includes(heroes[hero].name)) {
                achievements[achievement].achieved.push(heroes[hero].name)
                heroes[hero].achievements += 1;
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

const alertTrigger = document.getElementById('liveAlertBtn')

if (alertTrigger) {
  alertTrigger.addEventListener('click', () => {
    alert('Nice, you triggered this alert message!', 'success')
  })
}
