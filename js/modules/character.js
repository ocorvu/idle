class Character {
    constructor(name, totalHp, hp, atk, def, thumbnail = '') {
        this.name = name;
        this.totalHp = totalHp;
        this.hp = hp;
        this.atk = atk;
        this.def = def;
        this.thumbnail = thumbnail;
        this.dead = false;
        this.respawnCooldown = 3000;
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
    die() {
        this.dead = true;
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(
                    this.respawn()
                );
            }, 4000)
        })
    }
    is_dead() {
        return this.dead;
    }
    respawn() {
        this.dead = false;
        this.hp = this.totalHp;

        const heroCardHp = document.querySelector(`[data-hero-card-hp="${this.name.toLowerCase()}"]`);
        const heroCardTotalHp = document.querySelector(`[data-hero-card-total-hp="${this.name.toLowerCase()}"]`);
        const heroCardHpBar = document.querySelector(`[data-hero-card-hp-bar="${this.name.toLowerCase()}"]`);

        heroCardHp.innerText = this.hp;
        heroCardTotalHp.innerText = this.totalHp;

        heroCardHpBar.value = this.hp;
        heroCardHpBar.max = this.totalHp;
        heroCardHpBar.innerText = this.hp;
    }
}

export { Character }