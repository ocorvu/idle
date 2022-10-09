from random import randint


class Race:
    """
    Um Personagem com: Nome, HP, Armour, Level e Power.
    """

    def __init__(self, race: str, hp: int, power: int = 1, strenght: int = 10, dexterity: int = 10, constitution: int = 10, inteligence: int = 10, charisma: int = 10, luck: int = 10, size: int = 1):#alguns atributos como hp e power serão predefinidos de acordo com a classe, raça e lvl.
        self.race = race
        self.power = power
        self.max_hp = hp
        self.hp = hp
        self.str = strenght
        self.dex = dexterity
        self.con = constitution
        self.int = inteligence
        self.cha = charisma
        self.luck = luck
        self.size = size
        self.skills = {
    "warrior": {
        "porretada": {
            "descricao": "uma espadada no inimigo que causa um dano de 10 + 5*lvl da skill + 1*str",
            "nome": "porretada",
            "imagem": "assets\\imagens\\vampiro.png",
            "power": 20,
            "tipo": "fogo",
            "lvl": 0,
            "scale lvl": 5,
            "scale str": 1,
            "scale dex": 0.5,
            "scale con": 0,
            "scale int": 0,
            "scale cha": 0,
            "scale luck": 0,
            "scale size": 5,
            "req": ""

        },
        "paulada": {
            "nome": "paulada",
            "imagem": "assets\\imagens\\vampiro.png",
            "power": 40,
            "tipo": "fogo",
            "lvl": 0,
            "scale lvl": 5,
            "scale str": 1,
            "scale dex": 0.5,
            "scale con": 0,
            "scale int": 0,
            "scale cha": 0,
            "scale luck": 0,
            "scale size": 5,
            "req": "porretada"
        },
        "escudo": {
            "nome": "paulada",
            "imagem": "assets\\imagens\\vampiro.png",
            "power": 30,
            "tipo": "fogo",
            "lvl": 0,
            "scale lvl": 5,
            "scale str": 1,
            "scale dex": 0.5,
            "scale con": 0,
            "scale int": 0,
            "scale cha": 0,
            "scale luck": 0,
            "scale size": 5,
            "req": ""
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

    def learn(self, skill: str):
        #puxa da arvore de skill para ser uma skill ativa ou upa, caso ja tenha
        if skill in self.skills:
            if self.skills[skill]['lvl'] < 5: # 5 seria lvl max aqui
                if self.skills[skill]['req'] in self.skills and self.skills[self.skills[skill]['req']]['lvl'] <= 0:
                    print(self.skills[skill]['req'], 'deve ser aprendido antes')
                else:
                    self.skills[skill]['lvl'] += 1
                    print ('skill upada para o lvl', self.skills[skill]['lvl'])
            else:
                print(f'{skill} esta no lvl maximo')
        else:
            print(f'você não pode aprender {skill}')


    
    def cast(self, skill: str):

        if self.skills[skill]['lvl'] > 0:
            skill = self.skills[f'{skill}']

            damage = skill["power"] + skill["lvl"] * skill["scale lvl"] + self.str * skill["scale str"] + self.dex * skill["scale dex"] + self.con * skill["scale con"] + self.int * skill["scale int"] + self.cha * skill["scale cha"] + self.luck * skill ["scale luck"] + self.size * skill["scale size"]

            return damage  
        else:
            return (f'{skill} não foi aprendida ainda')


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

    def __init__(self, name, hp: int, power: int = 1, size: int = 1, race: str = 'Humano', strenght: int = 10, dexterity: int = 10, constitution: int = 10, inteligence: int = 10, charisma: int = 10, luck: int = 10):
        super().__init__(race, hp, power, strenght, dexterity, constitution, inteligence, charisma, luck, size)
        self.size_str = self.set_size(size)
        self.name = name

    def __str__(self) -> str:
        return f'{self.name} -  {self.hp} HP - {self.power} Power - {self.size} Size - Race: {self.race}'    


class Warrior(Humano):
    
    def __init__(self, name, hp: int = 100, power: int = 1, size: int = 1, race: str = 'Humano', strenght: int = 10, dexterity: int = 10, constitution: int = 10, inteligence: int = 10, charisma: int = 10, luck: int = 10):
        super().__init__(name, hp, power, size, race, strenght, dexterity, constitution, inteligence, charisma, luck)
        self.skills = self.skills['warrior']

    def __str__(self) -> str:
        return f'{self.skills}'

    def regen(self, flat: int = 0, percent = 0.3):
        return super().regen(flat, percent)
    
    


'''A DEFINIR: CURVA DE NIVEL, ESCALONAMENTO DAS HABILIDADES (COM O LVL DA SKILL E COM OS ATRIBUTOS ETC)'''

ganseta = Warrior('ceta')
ganseta.learn('porretada')
print(ganseta.cast('porretada'))
ganseta.learn('porretada')
print(ganseta.cast('porretada'))
ganseta.learn('porretada')
print(ganseta.cast('porretada'))
ganseta.learn('porretada')
print(ganseta.cast('porretada'))
ganseta.learn('porretada')
print(ganseta.cast('porretada'))
ganseta.learn('porretada')
print(ganseta.cast('porretada'))
ganseta.learn('porretada')
print(ganseta.cast('porretada'))
ganseta.size += 1
print(ganseta.cast('porretada'))
ganseta.str += 20
print(ganseta.cast('porretada'))

