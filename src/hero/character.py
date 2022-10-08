from random import randint


class Race:
    """
    Um Personagem com: Nome, HP, Armour, Level e Power.
    """

    def __init__(self, race: str, hp: int, power: int = 1):#alguns atributos como hp e power serão predefinidos de acordo com a classe, raça e lvl.
        self.race = race
        self.power = power
        self.max_hp = hp
        self.hp = hp
        self.skills = {
    "warrior": {
        "porretada": {
            "nome": "porretada",
            "imagem": "assets\\imagens\\vampiro.png",
            "power": 10,
            "tipo": "fogo",
            "lvl": 0

        },
        "paulada": {
            "nome": "paulada",
            "imagem": "assets\\imagens\\vampiro.png",
            "power": 20,
            "tipo": "fogo",
            "lvl": 0
        }

    }
}

    def __str__(self) -> str:
        return f'{self.race} -  {self.hp} HP - {self.power} Power'
    
    def set_size(self,size):
        match size:
            case 0:
                return 'tiny'
            case 1:
                return 'small'
            case 2:
                return 'normal'
            case 3:
                return 'large'
            case 4:
                return 'huge'
            case _:
                return 'marcelo'
    
    def regen (self, flat: int = 0, percent = 0.1):
        self.hp = self.hp + flat + self.hp*percent
        if self.hp > self.max_hp:
            self.hp = self.max_hp

    def learn(self, new_skill):
        self.skills.append(new_skill)
    
    def cast(self, skill: str):
        skill = self.skills[skill]
        damage = skill["power"]
        return damage  

    def atack(self, critChance = 0, critMult = 1):#crit chance e mult serao buildados junto a classe, sendo dispensado a parametrização.
        power = self.power
        isCrit = critChance - randint(0,100)
        if isCrit >= 0:
            isCrit = 1
        else:
            isCrit = 0
        damage = power + power*isCrit*critMult
        return damage

class Humano(Race):
    def __init__(self, name, hp: int, power: int = 1, size: int = 1, race: str = 'Humano'):
        super().__init__(race, hp, power)
        self.size = self.set_size(size)
        self.name = name
    def __str__(self) -> str:
        return f'{self.name} -  {self.hp} HP - {self.power} Power - {self.size} Size - Race: {self.race}'
    


class Warrior(Humano):
    
    def __init__(self, name, hp: int, power: int = 1, size: int = 1, race: str = 'Humano'):
        super().__init__(name, hp, power, size, race)
        self.skills = self.skills['warrior']
    
    def __str__(self) -> str:
        return f'{self.skills}'

    def regen(self, flat: int = 0, percent=0.3):
        return super().regen(flat, percent)

ganseta = Warrior('ceta',10)
print(ganseta.cast('paulada'))