class Hero{
    constructor(name, power, base_cost, cost_increase, require) {
        this.name = name;
        this.require = require;
        this.power = power
        this.given_power = 0
        this.level = 0
        this.max_level = 100
        this.base_cost = base_cost
        this.cost_increase = cost_increase
        this.achievements = []
    }
    greet() {
        return `Name: ${this.name} - Power: ${this.power} - Given Power: ${this.given_power} - Level: ${this.level} - Base cost: ${this.base_cost} - Cost increase: ${this.cost_increase} - Achievements: ${this.achievements}`
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
        if (this.level < this.max_level){
            this.level += 1;
            this.given_power += this.power;
            const date = new Date()
            const day = date.getDate()
            const month = date.getMonth() + 1
            const year = date.getFullYear()
            const hours = date.getHours()
            const minutes = date.getMinutes()
            const seconds = date.getSeconds()
            return `[${day}/${month}/${year} ${hours}:${minutes}:${seconds}] ${this.name} is now at level ${this.level}`
        } else {
            window.alert(`${this.name} is at Max Level (${this.max_level})`)
        }

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
    canExist(requirement) {
        if (this.name == 'Meuso') {
            return true
        }
        if (requirement.level >= 10) {
            console.log(this.name + ' is ready!')
            return true
        } else {
            window.alert(requirement.name + ' isnt level 10.')
        }
    }
    gainAchievement(achievement) {
        this.achievements.push(achievement);
    }
    getAchievements() {
        return this.achievements;
    }
    getRequirement() {
        return this.require
    }
}

export {Hero}