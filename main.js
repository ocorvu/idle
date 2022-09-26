const firstButton = document.getElementById('first');
const secondButton = document.getElementById('second');
const clicks = document.getElementById('clicks');
const menuItems = document.querySelectorAll('[data-button]')
const volume = document.getElementById('volumeID');
var count = 1;
var time = 1;
var timestamp = 1000;

function plus(value, ...params) {
    count += value;
    params.forEach (el => {
        let element = document.getElementById(el);
        element.innerText = count;
        clicks.innerText = ' ' + count;
    })
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
        resolve(plus(1, 'box'));
      }, timestamp);
    });
  }
  
  async function asyncCall() {
    const result = await resolveAfter2Seconds();
    window.requestAnimationFrame(asyncCall)
  }


  
window.requestAnimationFrame(asyncCall)