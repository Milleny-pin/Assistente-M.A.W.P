from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from joblib import dump
import pandas as pd


# Ler os dados
dados = pd.read_csv("exames.csv")

# Separar dados entre o que ele vai aprender e o que ele vai prever
x = dados.drop("diagnostico", axis=1)
y = dados[["diagnostico"]]

# Treinar o modelo
modelo = DecisionTreeClassifier()
modelo.fit(x, y)

# Salvar o modelo
dump(modelo, "modelo_medico.joblib")

