from ctypes import cast
import json
from random import randint

class Race:
    """
    Um Personagem com: Nome, HP, Armour, Level e Power.
    """
    __SKILLS = '../assets/skills.json'
    __ITEMS = '../assets/items.json'

    def __load_skills():
        with open(__class__.__SKILLS, 'r+', encoding='utf8') as skills_json:
            skills = json.load(skills_json)
            skills_json.close
            return skills
    
    def __load_items():
        with open(__class__.__ITEMS, 'r+', encoding='utf8') as items_json:
            items = json.load(items_json)
            return items

    def __init__(self, race: str, hp: int, power: int = 1, strength: int = 10, dexterity: int = 10, constitution: int = 10, inteligence: int = 10, charisma: int = 10, luck: int = 10, size: int = 1):#alguns atributos como hp e power serão predefinidos de acordo com a classe, raça e level.
        self.race = race
        self.power = power
        self.max_hp = hp
        self.hp = hp
        self.attributes = {
            "strength": strength,
            "dexterity": dexterity,
            "constitution": constitution,
            "intelligence": inteligence,
            "charisma": charisma,
            "luck": luck,
            "size": size
        }
        self.skills = __class__.__load_skills()

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
    
    def regen (self, flat: int = 0, percent = 1.1):
        self.hp = flat + self.hp * percent

        if self.hp > self.max_hp:
            self.hp = self.max_hp

    def learn(self, skill: str):
        #puxa da arvore de skill para ser uma skill ativa ou upa, caso ja tenha
        if skill in self.skills:
            if self.skills[skill]['level'] < 5: # 5 seria level max aqui
                if self.skills[skill]['requirements'] in self.skills and self.skills[self.skills[skill]['requirements']]['level'] <= 0:
                    print(self.skills[skill]['requirements'], 'deve ser aprendido antes')
                else:
                    self.skills[skill]['level'] += 1
                    print ('skill upada para o level', self.skills[skill]['level'])
            else:
                print(f'{skill} esta no level maximo')
        else:
            print(f'você não pode aprender {skill}')
    
    def cast(self, skill: str):

        if self.skills[skill]['level'] > 0:
            damage = self.__skill_damage(skill)   

            return damage  
        else:
            return (f"{self.skills[skill]['name']} não foi aprendida ainda")

    def __skill_damage(self, skill):
        skill = self.skills[skill]
        skill_scale = skill["scale"]
        damage = skill['power'] + skill["level"] * skill_scale["level"]

        for attribute in self.attributes:
            damage += self.attributes[attribute] * skill_scale[attribute]

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
    
    def choose_skill(self):
        skill = input('escolha uma ação: ')
        self.cast(skill)


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
    
    


'''A DEFINIR: CURVA DE NIVEL, ESCALONAMENTO DAS HABILIDADES (COM O level DA SKILL E COM OS ATRIBUTOS ETC)'''




ceta = Warrior('ganse')
