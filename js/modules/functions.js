import { ten } from './buy.js';
import { newActivity } from './feed.js'

async function requestData(path) {

    const res = await fetch(path);

    const data = await res.json();

    return data;
}

function toggleElementsClass(elementList, cssClass) {

    elementList.forEach(el => {
        el.addEventListener('click', () => {
            el.classList.add(cssClass);
            let filteredElements = [...elementList].filter((e) => e.classList.contains(cssClass) && e != el);
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

function canBuy(cost, points) {
    return points >= cost;
}

function syncHeroUprades(heroes, hero, option) {

    const heroName = document.querySelector(`[data-heroes-name="${hero}"]`);
    const heroCost = document.querySelector(`[data-heroes-cost="${hero}"]`);
    const heroLevel = document.querySelector(`[data-heroes-level="${hero}"]`);

    heroName.innerText = heroes[hero].name;
    let cost = ten(heroes[hero], option);

    heroes[hero].update(heroLevel, heroCost, cost);
}

function powerUp(hero, points, power, buyOption) {

    let activity;
    const feed = document.getElementById('feed');

    [points, activity] = hero.levelUp(points, buyOption);

    power = hero.powerUp(power);

    newActivity(feed, activity);

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

export { inactiveButton, activeButton, enableItem, disableItem, showItem, hideItem, powerUp, showPoints, NumberUnitFormat, requestData, getDataAttribute, hasCssClass, toggleElementsClass, syncHeroUprades, canBuy, playSound }