function ten(hero, option) {
    return (hero.base_cost * ((hero.cost_increase ** option) - 1)) / (hero.cost_increase - 1);
}

export { ten }