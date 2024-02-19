let round = 1;
let miss = [];
let deadCharacterName;
let deadCharacterRespawn;

function resetRound() {
    round = 1;
}

function showHp(attacker, defender) {
    return `${attacker.name} hp: ${attacker.hp} | ${defender.name} hp: ${defender.hp} `;
}

function successfulAttack(attacker, defender, damage) {
    return `${attacker.name} ataca ${defender.name} e causa ${damage} de dano`;
}

function missedAttack(attacker, defender) {
    return `${attacker.name} tenta atacar ${defender.name} e erra!`;
}

function battleLog(message, feed) {
    const log = document.createElement('p');

    const footer = document.getElementById('battle-feed-close-button').parentNode;

    log.innerText= message;

    feed.insertBefore(log, footer);
}

function fight(attacker, defender, feed) {
    var probability = function(n) {
        return !!n && Math.random() <= n;
    };

    let damage = attacker.atk * 1.5 - defender.def;

    if (damage < 0) {
        damage = 0
    }

    while (!defender.is_dead() && !attacker.is_dead() && round < 6) {
        const hit = probability(0.7);
        battleLog(`----Round: ${round}----`, feed);
        
        if (hit) {
            if (damage > defender.hp) {
                defender.hp = 0;
                defender.die();

                deadCharacterName = defender.name.toLowerCase();
                deadCharacterRespawn = 3
                break
            }

            battleLog(successfulAttack(attacker, defender, damage), feed);

            defender.hp -= damage;
            miss = [];

            battleLog(showHp(attacker, defender), feed);
            
        } else {
            battleLog(missedAttack(attacker, defender), feed);

            miss.push(attacker.name);

            // battleLog(`"Quem já errou nesse round?", ${miss}`, feed);

            if (miss.length >= 2) {
                   battleLog(`----Termina o round ${round}----`, feed)
                   round += 1;
                   miss = [];
                   continue;
            }

            fight(defender, attacker, feed)
        }
        round += 1;
    }
}


export {fight, resetRound}