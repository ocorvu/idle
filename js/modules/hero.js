class Hero{
    constructor(name, power, base_cost, cost_increase) {
        this.name = name;
        this.power = power
        this.given_power = 0
        this.level = 0
        this.base_cost = base_cost
        this.cost_increase = cost_increase
        this.achievements = []
    }
    greet() {
        console.log(`Name: ${this.name} - Power: ${this.power} - Given Power: ${this.given_power} - Level: ${this.level} - Base cost: ${this.base_cost} - Cost increase: ${this.cost_increase} - Achievements: ${this.achievements}`)
    }
    self() {
       return {
        "name": this.name,
        "power": this.power,
        "given_power": this.given_power,
        "level": this.level,
        "base_cost": this.base_cost,
        "cost_increase": this.cost_increase,
        "achievements" : this.achievements,
        }
    }
    levelUp(){
        this.level += 1;
        this.given_power += this.power;

        if (this.level % 10 == 0){
            this.base_cost = Math.floor(this.base_cost * this.cost_increase) * (this.level / 10);
        } else {
            this.base_cost = Math.floor(this.base_cost * this.cost_increase);
        }
    }
    update(level, cost) {
        level.innerText = this.level,
        cost.innerText = this.base_cost
    }
    gainAchievement(achievement) {
        this.achievements.push(achievement);
    }
    getAchievements() {
        return this.achievements;
    }
}

export {Hero}