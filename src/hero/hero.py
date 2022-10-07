from random import randint
class Hero:
    def __init__(self,name,race,classe,hp,armour, lvl = 1,power = 1):#alguns atributos como hp e power serão predefinidos de acordo com a classe, raça e lvl.
        self.name = name
        self.classe = classe
        self.raca = race
        self.level = lvl
        self.power = power
        self.hp = hp
        self.armour = armour
    def atack(self,critChance = 0,critMult = 1):#crit chance e mult serao buildados junto a classe, sendo dispensado a parametrização.
        power = self.power
        isCrit = critChance - randint(0,100)
        if isCrit >= 0:
            isCrit = 1
        else:
            isCrit = 0
        damage = power + power*isCrit*critMult
        return damage

class Enemy: # talvez seja interessante deixar o enemy na mesma classe do hero para terem os mesmos atributos
    def __init__(self,name,hp,armour,power):
        self.name = name
        self.hp = hp
        self.armour = armour
        self.power = power
    def atack(self):
        return self.power

def fight(hero,target):
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




#exemplo com diferentes crit chances
vayne = Hero('vayne','human','archer',100,5,1,5)

#lutando contra monstro
slime = Enemy('slime',100,1,5)
fight(vayne,slime)
