

let round = 1;
let miss = [];

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

function fight(attacker, defender) {
    var probability = function(n) {
        return !!n && Math.random() <= n;
    };

    const damage = attacker.atk * 1.5 - defender.def;

    while (defender.hp > 0 && attacker.hp && round < 6) {
        const hit = probability(0.7);
        console.log(`----Round: ${round}----`);

        if (hit) {
            if (damage > defender.hp) {
                defender.hp = 0;
                round = 1;
    
                showHp(attacker, defender);
    
                break
            }
            successfulAttack(attacker, defender, damage);

            defender.hp -= damage;
            miss = [];

            showHp(attacker, defender);
            
        } else {
            missedAttack(attacker, defender);

            miss.push(attacker.name);

            console.log("Quem já errou nesse round?", miss);

            if (miss.length >= 2) {
                   console.log(`----Termina o round ${round}----`)
                   round +=1;
                   miss = [];
                   continue;
            }

            fight(defender, attacker)
        }
        round += 1;
    }
}


export {round, miss, fight}