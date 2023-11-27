import { newActivity } from './feed.js'

async function requestData(path) {

    const res = await fetch(path);
  
    const data = await res.json();
  
    return data;
}

function toggleClass(element, cssClass) {

    element.forEach(el => {
        el.addEventListener('click', () => {
            el.classList.add(cssClass);

            let filteredElements = [...element].filter((e) => e.classList.contains(cssClass) && e != el);
            filteredElements.forEach(filteredElement => {
                filteredElement.classList.toggle(cssClass);
            });
        });
    });
}

function hasCssClass(elements, cssClass) {
    return [...elements].filter((button) => button.classList.contains(cssClass))[0];
}

function getDataAttribute(element, attribute) {
    return element.dataset[attribute];
}

function showPoints(points, ...params) {
    params.forEach(el => {
        let element = document.getElementById(el);
        element.innerText = points;
    })
}

function powerUp(e, heroes, points, power, sound, volume) {
    const hero = heroes[e]
    if (points >= hero.base_cost) {
        const heroLevel = document.querySelector(`[data-heroes-level="${e}"]`);
        const heroCost = document.querySelector(`[data-heroes-cost="${e}"]`);
        const feed = document.getElementById('feed');

        points -= hero.base_cost;
        const activity = hero.levelUp(power, points);
        power += hero.power;
        hero.update(heroLevel, heroCost);

        newActivity(feed, activity)
    } else {
        playSound(sound, volume);
    }

    return [power, points];
}

function playSound(e, volume) {
    e.volume = volume.value;
    e.play();
}

function hideItem(e) {
    const item = document.querySelector(`[data-content="${e}"]`);
    item.classList.add('hide');
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
    button.classList.add('settings-music-button-active');
}

function inactiveButton(e, volume) {
    const button = document.querySelector(`[data-music="${e}"]`);
    button.classList.remove('settings-music-button-active');
    volume.value = 0;
}

function NumberUnitFormat(number) {
    return new Intl.NumberFormat("en-GB", {
        notation: "compact",
        compactDisplay: "short",
    }).format(number);
}

export { inactiveButton, activeButton, enableItem, disableItem, showItem, hideItem, powerUp, showPoints, NumberUnitFormat, requestData, getDataAttribute, hasCssClass, toggleClass}