class Character {
    constructor(name, totalHp, hp, atk, def, thumbnail = '') {
        this.name = name;
        this.totalHp = totalHp;
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