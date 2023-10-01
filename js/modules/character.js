class Character {
    constructor(name, hp = 100, atk, def, thumbnail = '') {
        this.name = name;
        this.totalHp = hp;
        this.hp = hp;
        this.atk = atk;
        this.def = def;
        this.thumbnail = thumbnail;

    }
    self() {
        return {
            "name": this.name,
            "totalHp": this.hp,
            "hp": this.hp,
            "atk": this.atk,
            "def": this.def,
            "thumbnail": this.thumbnail,
        }
    }
}

export { Character }