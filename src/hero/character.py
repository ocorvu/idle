from random import randint
class Character:
    """
    Um Personagem com: Nome, HP, Armour, Level e Power.
    """
    def __init__(self, name: str, hp: int, armour: int, lvl: int = 1, power: int = 1):#alguns atributos como hp e power serão predefinidos de acordo com a classe, raça e lvl.
        self.name = name
        self.level = lvl
        self.power = power
        self.hp = hp
        self.armour = armour

    def __str__(self) -> str:
        return f'{self.name} - LVL {self.level} -  {self.hp} HP - {self.power} Power - {self.armour} Armor'

    def atack(self, critChance = 0, critMult = 1):#crit chance e mult serao buildados junto a classe, sendo dispensado a parametrização.
        power = self.power
        isCrit = critChance - randint(0, 100)
        if isCrit >= 0:
            isCrit = 1
        else:
            isCrit = 0
        damage = power + power * isCrit * critMult
        return damage


class Role:
    def __init__(self, name) -> None:
        self.critMult = 1
        self.name = name

    def fireball(self):
        print('solto fogo')

    def __str__(self) -> str:
        return f'{self.name}'
class Hero(Character, Role):
    """Um Personagem com Classe e Raça"""
    def __init__(self, name: str, race: str, classe: Role, hp: int, armour: int, lvl: int = 1, power: int = 1):
        super().__init__(name, hp, armour, lvl, power)
        self.race = race
        self.classe = classe
    
    def __str__(self) -> str:
        return f'{self.name} - LVL {self.level} - {self.race} - {self.classe} -  {self.hp} HP - {self.power} Power - {self.armour} Armor'



def fight(hero: Character, target: Character):
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

vayne = Character('Shauna', 100, 2)
mage = Role('Mage')
shauna = Hero('Vayne', 'Humana', mage, 100, 2)

print(shauna)


