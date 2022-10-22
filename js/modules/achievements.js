class Achievement {
    constructor(name, message) {
        this.name = name
        this.message = message
        this.achieved = []
    }
    getAchieved(hero) {
        return this.achieved.includes(hero)
    }
    setAchieved(hero) {
        this.achieved.push(hero)
    }
}

export {Achievement}