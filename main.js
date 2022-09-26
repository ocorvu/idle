const firstButton = document.getElementById('first');
const secondButton = document.getElementById('second');
const menuItems = document.querySelectorAll('[data-button]')
const volume = document.getElementById('volumeID');
var power = 1;
var count = 0;
var time = 1;
var timestamp = 1000;
let cost = 1

console.log(firstButton)
function plus(value, ...params) {
    count += value;
    params.forEach (el => {
        let element = document.getElementById(el);
        element.innerText = count;
    })
}

function powerUp(value) {
    if (count >= 10*cost){
        power +=value;
        count -= 10*cost 
        cost += 1  
        upgrade1=document.getElementById('upgrade1')
        upgrade1.innerText = 'Power UP cost: ' + cost*10     
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