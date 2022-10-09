from random import randint
def fight(hero, target):
    """
    O combate ocorre sempre entre dois personagens.
    Será encerrado quando o número máximo de rodadas
    for atingido ou algum personagem morrer. 
    Ao final, se o personagem for um herói, o vencedor
    receberá experiência, podem assim subir de nível
    e terá uma chance de encontrar items.
    """
    while hero.hp > 0 and target.hp > 0:
        damage = hero.atack() - target.armour
        if damage <= 0:
            damage = 1
        target.hp -= damage
        print (hero.name,'dealt ',damage,'to ',target.name,)
        damage = target.atack() - hero.armour
        if damage <= 0:
            damage = 1
        hero.hp -= damage
        print (target.name,'dealt ',damage,'to ',hero.name,)
    if hero.hp <= 0:
        print(hero.name,'died')
    if target.hp <= 0:
        print(target.name,'died')
    
