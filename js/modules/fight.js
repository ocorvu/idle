let round = 1;
let miss = [];
let deadCharacterName;
let deadCharacterRespawn;

function resetRound() {
    round = 1;
}

function deadCharacter() {
    return [deadCharacterName, deadCharacterRespawn];
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
        feed.log(`Round: ${round}`, ['round']);
        
        if (hit) {
            if (damage > defender.hp) {
                defender.hp = 0;
                defender.die();

                deadCharacterName = defender.name.toLowerCase();
                deadCharacterRespawn = 3

                feed.successfulAttack(attacker, defender, damage);
                feed.showHp(attacker, defender);
                feed.log(`${defender.name} morreu!`);
                break
            }

            feed.successfulAttack(attacker, defender, damage);

            defender.hp -= damage;
            miss = [];

            feed.showHp(attacker, defender);
            feed.log(`Fim do Round ${round}`, ['round'])            
        } else {
            feed.missedAttack(attacker, defender);

            miss.push(attacker.name);

            if (miss.length >= 2) {
                   feed.log(`Fim do round ${round}`, ['round'])
                   round += 1;
                   miss = [];
                   continue;
            }

            fight(defender, attacker, feed)
        }
        round += 1;
    }
}


export {fight, resetRound, deadCharacter}