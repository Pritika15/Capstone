import pandas as pd
import pickle, os
import matplotlib.pyplot as plt
from gemble.main import GembleModel

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

# Load the model using pickle
with open(os.path.join(ROOT_DIR, 'model.pkl'), 'rb') as f:
    my_model = pickle.load(f)

def transform_topics(df_col):
    # Make predictions using the loaded model
    predictions = my_model.transform(df_col)
    return predictions
