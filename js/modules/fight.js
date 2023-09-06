

let round = 1;
let miss = [];

function showHp(...characters) {
    characters.forEach(character => {
        console.log(character.name, 'hp:', character.hp)
    });
}

function successfulAttack(attacker, defender, damage) {
    console.log(attacker.name, 'ataca', defender.name, 'e causa', damage, 'de dano.');
}

function missedAttack(attacker, defender) {
    console.log(attacker.name, ' tenta atacar', defender.name , 'e erra!')
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