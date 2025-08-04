from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from joblib import dump
import pandas as pd


dados = pd.read_csv("exames_completos.xlxs")


x = dados.drop("diagnostico", axis=1)
y = dados[["diagnostico"]]

modelo = DecisionTreeClassifier()
modelo.fit(x, y)


dump(modelo, "modelo_medico.joblib")
print("✅ Modelo treinado e salvo como 'modelo_medico.joblib'")

