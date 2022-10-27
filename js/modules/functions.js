
function showPoints(points, ...params) {
    params.forEach (el => {
        let element = document.getElementById(el);
        element.innerText = points;
    })
}

function powerUp(e, heroes, points, power, sound, volume) {
    const hero = heroes[e]
    if (points >= hero.base_cost){
        const heroLevel = document.querySelector(`[data-heroes-level="${e}"]`);
        const heroCost = document.querySelector(`[data-heroes-cost="${e}"]`);

        points -= hero.base_cost
        hero.levelUp(power, points);
        power += hero.power
        hero.update(heroLevel, heroCost);

    } else {
        playSound(sound, volume)
    }
}

function playSound(e, volume) {
    e.volume = volume.value;
    e.play();
}

function hideItem(e) {
    e.classList.add('hide');
}

function showItem(e) {
    const item = document.querySelector(`[data-content="${e}"]`);
    item.classList.remove('hide');
}

function disableItem(e) {
    e.setAttribute('disabled', '');
}

function enableItem(e) {
    e.removeAttribute('disabled');
}

function activeButton(e) {
    const button = document.querySelector(`[data-music="${e}"]`);
    button.classList.add('active');
}

function inactiveButton(volume) {
    musicButtons.forEach(button => button.classList.remove('active'));
    volume.value = 0;
}

export {inactiveButton, activeButton, enableItem, disableItem, showItem, hideItem, powerUp, showPoints}