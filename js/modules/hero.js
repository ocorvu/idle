import { Character } from "./character.js";

class Hero extends Character {
    _level;
    constructor(name, totalHp, hp, atk, def, thumbnail, level, power, given_power, base_cost, cost_increase, require) {
        super(name, totalHp, hp, atk, def, thumbnail);
        this.require = require;
        this.power = power;
        this.given_power = given_power;
        this._level = level;
        this.max_level = 100;
        this.base_cost = base_cost;
        this.cost_increase = cost_increase;
        this.achievements = [];
    }
    get level() {
        return this._level;
    }
    greet() {
        return `Name: ${this.name} - Power: ${this.power} - Given Power: ${this.given_power} - Level: ${this._level} - Base cost: ${this.base_cost} - Cost increase: ${this.cost_increase} - Achievements: ${this.achievements}`;
    }
    self() {
       return {
        "name": this.name,
        "power": this.power,
        "given_power": this.given_power,
        "level": this._level,
        "base_cost": this.base_cost,
        "cost_increase": this.cost_increase,
        "achievements" : this.achievements,
        };
    }
    levelUp(points, quantity){
        if (! this.isAtLevelMax()){
            this._level += Number(quantity);
            this.given_power += this.power;
            this.base_cost = Math.floor(this.base_cost * (this.cost_increase ** (quantity)));

            return `${this.name} is now at level ${this.level}`;
        }
            window.alert(`${this.name} is at Max Level (${this.max_level})`);
    }
    levelUpMessage() {
        return `${this.name} is now at level ${this._level}`;
    }
        cost.innerText = new Intl.NumberFormat("en-GB", {
            notation: "compact",
            compactDisplay: "short",
        }).format(this.base_cost);        
    }
    canExist(requirement) {
        if (this.name == 'Meuso') {
            return true;
        }
        if (requirement.level >= 10) {
            return true;
        }
            window.alert(requirement.name + ' isnt level 10.');
    }
        }
    isAtLevelMax() {
        return this._level >= this.max_level;
    }
    gainAchievement(achievement) {
        this.achievements.push(achievement);
    }
    getAchievements() {
        return this.achievements;
    }
    getRequirement() {
        return this.require;
    }
}

export {Hero}