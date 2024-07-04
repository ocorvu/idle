let maxCost = 0;

function numberOption(hero, option) {
    return (hero.base_cost * ((hero.cost_increase ** option) - 1)) / (hero.cost_increase - 1);
}
function max(hero, points, level) {
    if (numberOption(hero, level) >= points) {
        maxCost = 0;
        return level == 1 ? level : level - 1;
    }
    maxCost += numberOption(hero, level);
    level += 1;
    return max(hero, points, level);
}

function buy(hero, option, points) {
    switch (option) {
        case 'max':
            let newOption = max(hero, points, 1);
            return [numberOption(hero, newOption), newOption]
        default:
            return [numberOption(hero, option), option];
    }
}

export { buy }