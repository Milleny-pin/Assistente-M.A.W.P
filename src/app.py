import speech_recognition as sr
import pyttsx3
import datetime
import os
import google.generativeai as genai
from dotenv import load_dotenv
import webbrowser
import numpy as np
from fuzzywuzzy import fuzz
import threading
from flask import Flask, render_template, request, jsonify
from joblib import load

modelo_medico = load("modelo_medico.joblib")

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-1.5-flash')

app = Flask(__name__)

def ask_gemini(prompt_text):
    print('Luna: só um momento...')

    full_prompt = (
        "Você é uma assistente médica. Sua principal função é responder a perguntas e fornecer informações. "
        "Você NÃO TEM CAPACIDADE de interagir diretamente com o sistema operacional do usuário, como abrir ou fechar programas, "
        "manipular arquivos ou controlar o mouse/teclado. Se for solicitado a realizar uma ação no computador que você não pode fazer, "
        "explique educadamente sua limitação. Seja concisa e útil. \n\n" + prompt_text
    )
    response = gemini_model.generate_content(
        [{"role": "user", "parts": [full_prompt]}]
    )
    if response.parts:
        return response.text
    else:
        return 'Não consegui encontrar uma resposta para isso :('

@app.route('/', methods=['GET'])
def inicio():
    return render_template("index.html")

@app.route('/chat', methods=['POST'])
def chat_ia():
    data = request.get_json()
    pergunta = data.get("pergunta")
    resposta = ask_gemini(pergunta)
    return jsonify({"resposta": resposta})


@app.route('/prever', methods=['POST'])
def prever():
    dados = request.get_json()

    entrada = np.array([[ 
        dados['idade'],
        dados['colesterol'],
        dados['glicose'],
        dados['pressao'],
        dados['batimentos'],
        dados['hemoglobina'],
        dados['creatinina'],
        dados['plaquetas']
    ]])

    resultado = modelo_medico.predict(entrada)[0]

    return jsonify({"diagnostico": resultado})

if __name__ == '__main__':
    app.run(debug=True)

