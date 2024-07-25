import { buy } from './buy.js';
import { newActivity } from './feed.js'

async function requestData(path) {
    const res = await fetch(path);
    const data = await res.json();
    return data;
}

const alert = (title, hero, message, type) => {
    const alertPlaceholder = document.getElementById('alertPlaceHolder');
    const notification = document.createElement('article');
    notification.classList.add('alertBox');

    notification.innerHTML = [
        '<section class="alertBody" class="alertTile">',
        `<h4 class="alertTitle">${title}</h4>`,
        `<p>${hero} ${message}</p>`,
        '</section>',
        '<button type="button" id="closeAlert" class="close">X</button>',
    ].join('');

    alertPlaceholder.append(notification);
    const alertCloseButton = document.getElementById('closeAlert');

    alertCloseButton.addEventListener('click', () => {
        notification.remove();
    });

    return new Promise(resolve => (
        setTimeout(() => {
            resolve(notification.remove());
        }, 5000)
    ));
}

function addAchiement(heroName, achieved) {
    const hero = document.querySelector(`[data-achievement-hero-list='${heroName}'`);
    const achievement = document.createElement('li');

    achievement.innerHTML = achieved;

    achievement.classList.add('hero-achievement-level');

    hero.appendChild(achievement);
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

function buyOption (options) { 
    return getDataAttribute(hasCssClass(options, 'active'), 'buyOption');
}

function syncHeroCard(heroes, hero) {
    const heroCardThumb = document.querySelector(`[data-character-card-thumb="${hero}"]`);
    const heroCardName = document.querySelector(`[data-character-card-name="${hero}"]`);
    const heroCardHp = document.querySelector(`[data-character-card-hp="${hero}"]`);
    const heroCardTotalHp = document.querySelector(`[data-character-card-total-hp="${hero}"]`);
    const heroCardHpBar = document.querySelector(`[data-character-card-hp-bar="${hero}"]`);
    const heroCardAtk = document.querySelector(`[data-character-card-atk="${hero}"]`);
    const heroCardDef = document.querySelector(`[data-character-card-def="${hero}"]`);

    heroCardName.innerText = heroes[hero].name;
    heroCardAtk.innerText = heroes[hero].atk;
    heroCardDef.innerText = heroes[hero].def;

    heroCardHp.innerText = heroes[hero].hp;
    heroCardTotalHp.innerText = heroes[hero].totalHp;

    heroCardHpBar.value = heroes[hero].hp;
    heroCardHpBar.max = heroes[hero].totalHp;
    heroCardHpBar.innerText = heroes[hero].hp;

    heroCardThumb.src = heroes[hero].thumbnail;
}

function syncHeroUprades(heroes, hero, option, points) {

    let [cost, level] = buy(heroes[hero], option, points);

    const heroName = document.querySelector(`[data-heroes-name="${hero}"]`);
    const heroCost = document.querySelector(`[data-heroes-cost="${hero}"]`);
    const heroLevel = document.querySelector(`[data-heroes-level="${hero}"]`);
    const heroLevelOption = document.querySelector(`[data-heroes-level-option="${hero}"]`);
    
    heroLevelOption.classList.add('hide')
    heroName.innerText = heroes[hero].name;
    if (option == 'max'){
        heroLevelOption.innerText = level;
        heroLevelOption.classList.toggle('hide')
    }

    heroes[hero].update(heroLevel, heroCost, cost);
}

function syncEnemieCard(enemies, enemie) {
    const enemieCardThumb = document.querySelector(`[data-character-card-thumb="${enemie}"]`);
    const enemieCardName = document.querySelector(`[data-character-card-name="${enemie}"]`);
    const enemieCardHp = document.querySelector(`[data-character-card-hp="${enemie}"]`);
    const enemieCardTotalHp = document.querySelector(`[data-character-card-total-hp="${enemie}"]`);
    const enemieCardHpBar = document.querySelector(`[data-character-card-hp-bar="${enemie}"]`);
    const enemieCardAtk = document.querySelector(`[data-character-card-atk="${enemie}"]`);
    const enemieCardDef = document.querySelector(`[data-character-card-def="${enemie}"]`);

    enemieCardName.innerText = enemies[enemie].name;
    enemieCardAtk.innerText = enemies[enemie].atk;
    enemieCardDef.innerText = enemies[enemie].def;

    enemieCardHp.innerText = enemies[enemie].hp;
    enemieCardTotalHp.innerText = enemies[enemie].totalHp;

    enemieCardHpBar.value = enemies[enemie].hp;
    enemieCardHpBar.max = enemies[enemie].totalHp;
    enemieCardHpBar.innerText = enemies[enemie].hp;

    enemieCardThumb.src = enemies[enemie].thumbnail;
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

export { inactiveButton, activeButton, enableItem, disableItem, showItem, hideItem, powerUp, showPoints, NumberUnitFormat, requestData, getDataAttribute, hasCssClass, toggleElementsClass, syncHeroUprades, canBuy, playSound, syncHeroCard, buyOption, syncEnemieCard, alert, addAchiement }