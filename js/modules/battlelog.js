class BattleLog {
    constructor (attacker, defender, feed) {
        this.attacker = attacker;
        this.defender = defender;
        this.feed = feed;

        this.HEADER = document.getElementById('battle-feed-header');
        this.BODY = document.getElementById('battle-feed-body');
        this.FOOTER = document.getElementById('battle-feed-footer');
    }

    bodyElement(content, classes) {
        let activity = document.createElement('p');
        
        activity.classList.add(...classes);

        activity.innerText = content;

        this.BODY.append(activity);
    }
    title() {
        let title = document.createElement('h2');

        title.innerText = `${this.attacker.name} vs ${this.defender.name}`;
        
        this.HEADER.appendChild(title);
    }

    log(content, classes = []) {
        this.bodyElement(content, classes);
    }
    showHp(attacker, defender, classes = []) {
        let message = `${attacker.name} hp: ${attacker.hp} | ${defender.name} hp: ${defender.hp} `;

        this.bodyElement(message, classes);
    }

    successfulAttack(attacker, defender, damage, classes = []) {
        let message = `${attacker.name} ataca ${defender.name} e causa ${damage} de dano`;

        this.bodyElement(message, classes)
    }
    
    missedAttack(attacker, defender, classes = []) {
        let message = `${attacker.name} tenta atacar ${defender.name} e erra!`;
        
        this.bodyElement(message, classes);
    }
}

export {BattleLog}