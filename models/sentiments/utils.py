import numpy as np
from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer
import tensorflow as tf
import os

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

def predict_sentiment(text_column):
    model = tf.keras.models.load_model(os.path.join(ROOT_DIR, "CNN_model"))

    tokenizer = Tokenizer(num_words=1000, oov_token="<OOV>")
    tokenizer.fit_on_texts(text_column)

    # Tokenize and pad the text column
    text_sequences = tokenizer.texts_to_sequences(text_column)
    text_padded = tf.keras.utils.pad_sequences(text_sequences, maxlen=100, truncating="post", padding="post")

    # Make predictions using the trained model
    predictions = model.predict(text_padded)

    # Decode the predictions to get the corresponding sentiment
    predicted_sentiments = np.argmax(predictions, axis=1)

    # Map numeric sentiment labels to human-readable labels
    sentiment_mapping = {0: "Negative", 1: "Neutral", 2: "Positive"}
    
    # Convert numeric predictions to human-readable labels
    predicted_labels = [sentiment_mapping[p] for p in predicted_sentiments]

    return predicted_labels

# Example usage:
# Assuming you have a DataFrame 'df' with a column named 'text_column'

# # Now, df['predicted_sentiment'] contains the predicted sentiments for each text in the 'text_column'
if __name__ == "__main__":
    # Test the function
    # Load the test data
    import pandas as pd
    df = pd.read_csv(os.path.join(ROOT_DIR, "senti.csv"))

    # Predict the sentiment labels
    predicted_labels = predict_sentiment(df["text"])
    # Display the predicted sentiment labels
    print(predicted_labels)