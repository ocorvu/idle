const firstButton = document.getElementById('first');
const secondButton = document.getElementById('second');
const menuItems = document.querySelectorAll('[data-button]')
const volume = document.getElementById('volumeID');
let power = 1;
let count = 0;
let points = 0;
let time = 1;
let timestamp = 1000;
let cost = 10

console.log(firstButton)
function plus(value, ...params) {
    points += value;
    params.forEach (el => {
        let element = document.getElementById(el);
        element.innerText = points;
    })
}

const upgrade1 = document.querySelector(`[data-upgrade="upgrade1"]`)
let upgrade1Amount = document.querySelector(`[data-upgrade-amount="upgrade1"]`)
let upgrade1Increase = document.querySelector(`[data-upgrade-increase="upgrade1"]`)
let upgrade1Cost = document.querySelector(`[data-upgrade-cost="upgrade1"]`)

console.log(upgrade1Increase)
function powerUp(value) {
    if (points >= cost){
        power +=value;
        count += 1
        points -= cost 
        cost *= 10  
        upgrade1Amount.innerText = count
        upgrade1Increase.innerText = power
        upgrade1Cost.innerText = cost
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
}

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const value = item.dataset.button
        showItem(value)
    })
})

console.log('toli vai excluir')


const musicButtons = document.querySelectorAll('[data-music]');


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

function resolveAfter2Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(plus(power, 'box','clicks'));
      }, timestamp);
    });
  }
  
  async function asyncCall() {
    const result = await resolveAfter2Seconds();
    window.requestAnimationFrame(asyncCall)
  }


  
window.requestAnimationFrame(asyncCall)