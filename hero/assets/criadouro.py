'''
definição das cartas: dicionario onde cada elemento podera ser chamado: {nome:tal, imagem:tal, atk:tal, defesa:tal, etc}
'''
from tkinter import *
from PIL import ImageTk, Image
from tkinter import filedialog
import json
from os import close

root = Tk()

def salvar_monstro(dados, arquivo = 'idle\hero\\assets\herois.json'): #apeans 'data.json' não estava funcionando aqui.
    with open(arquivo, 'r+', encoding='utf8') as file:
        dados_arquivo = json.load(file)
        chave = dados['nome_minusculo']
        dados.pop('nome_minusculo')
        dados_arquivo["monstros"][chave] = dados
        file.seek(0)
        json.dump(dados_arquivo, file, indent=4, ensure_ascii=False)
        file.close

def escolherPng():
    global caminho_imagem
    global label_dir
    imagem = filedialog.askopenfilename(
        title = 'selecione a imagem', 
        initialdir = 'assets\images',
        filetypes = [('arquivos png','*.png')]
    )
    pasta = imagem.find('/assets')
    caminho_imagem = imagem[pasta:]
    caminho_imagem = caminho_imagem.replace('/','',1)
    caminho_imagem = caminho_imagem.replace('/','\\')

    label_dir.destroy()
    label_dir = Label(root, text=caminho_imagem)
    label_dir.grid(column=2, row=0)

def criar_monstro():
    monstro = {}
    monstro['nome'] = str(nome_monstro.get())
    monstro['nome_minusculo'] = monstro['nome'].lower()
    monstro['imagem'] = str((caminho_imagem))
    monstro['poder'] = int(poder.get())
    monstro['defesa'] = int(defesa.get())
    monstro['hp'] = int(hp.get())
    
    salvar_monstro(monstro)

label_dir = Label ()

Label(root,text='Imagem (png) = ').grid(column=0, row=0)
Label(root,text='Nome (str) = ').grid(column=0, row=1)
Label(root,text='Poder (int) = ').grid(column=0, row=2)
Label(root,text='Defesa (int) = ').grid(column=0, row=3)
Label(root, text='HP (int) = ').grid(column=0, row=4)

botao_imagem = Button(root, text='Escolher arquivo...', command=escolherPng).grid(column=1, row=0)

nome_monstro = Entry(root)

poder = Entry(root,bg='#940c0c', fg='#ffffff')
poder.insert(END, '0')

defesa = Entry(root,bg='#543a0c', fg='#ffffff')
defesa.insert(END, '0')

hp = Entry(root)
hp.insert(END, '0')

nome_monstro.grid(column=1, row=1)
poder.grid(column=1, row=2)
defesa.grid(column=1, row=3)
hp.grid(column=1, row=4)

botao_criar = Button(root, width=40, text='Criar', command=criar_monstro).grid(column=0, row=5, columnspan=2)

root.mainloop()