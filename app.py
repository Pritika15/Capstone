import json

from flask import Flask, request, make_response, session
import bcrypt
from sqlalchemy.exc import IntegrityError
from config import app, db
from database.models import User
import pandas as pd
import time
import nltk
from nltk.corpus import stopwords
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

state_dict = {}
prev_history = []

# route for sign up
@app.route("/")
def index():
    return make_response("This is Production Server")


@app.route('/signup', methods=["POST"])
def signup():
    if request.method == "POST":
        rq = request.get_json()
        username = rq['username']
        password = rq['password']

        # password hashing/salting using bcrypt
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        new_user = User(
            username=username,
            password=hashed_password.decode('utf-8'),
        )
        if new_user:
            try:

                db.session.add(new_user)
                db.session.commit()
                session['user_id'] = new_user.id
                print(new_user.__dict__)
                return make_response(new_user.to_dict(), 201)
            except IntegrityError:
                return {'errors': ['Username already exists. Please try again with different username.']}, 401
        else:
            return {'errors': ['Invalid username or password. Please try again.']}, 401


# route for login
@app.route('/login', methods=["POST"])
def login():
    if request.method == "POST":
        rq = request.get_json()
        # find the user with the corresponding username
        user = User.query.filter(User.username.like(f"%{rq['username']}%")).first()

        # check the password with the hashed password in our database
        if user and bcrypt.checkpw(rq['password'].encode('utf-8'), user.password.encode('utf-8')):
            session['user_id'] = user.id
            return make_response(user.to_dict(), 200)
        else:
            return {'errors': ['Invalid username or password. Please try again.']}, 401


# route for logout
@app.route('/logout', methods=["DELETE"])
def logout():
    if request.method == "DELETE":
        session['user_id'] = None
        response = make_response('', 204)
        return response


# route for authorization
@app.route('/authorize')
def authorize():
    user_id = session.get('user_id')
    if not user_id:
        return {'errors': 'You must be logged in to do that. Please log in or sign up.'}, 401
    else:
        user = User.query.filter(User.id == user_id).first()
        if user:
            return make_response(user.to_dict(), 200)


@app.route("/csv_analysis", methods=['POST'])
def csv_analysis():
    if request.method == 'POST':
        f = request.files['file']
        f.save("client_files/" + f.filename)

        df = pd.read_csv("client_files/" + f.filename)
        print(df.columns)
        print(type(df.columns))

        return make_response(json.dumps({
            "filename": f.filename,
            "columns": df.columns.tolist()
        }), 200)
    else:
        return {'error': "Error with Server"}

@app.route("/single_tweet", methods=['POST'])
def single_tweet():
    if request.method == "POST":
        rq = request.get_json()

        from models.topic.utils import transform_topics
        from models.sentiments.utils import predict_sentiment
        df = pd.DataFrame({"text": [rq['tweet']]})
        print(df["text"])
        transformed = transform_topics(df['text'])
        print(transformed)

        return make_response(json.dumps({
            "message": "Your topic is: " + transformed[0]
        }), 200)

@app.route("/select_column", methods=['POST'])
def column_selected():
    if request.method == "POST":
        rq = request.get_json()
        #  operation

        return make_response("Selected Column is " + rq['column'])

        # find the user with the corresponding username

@app.route("/preprocess", methods=['POST'])
def csv_preprocess():
    if request.method == 'POST':
        rq = request.get_json()
        print(rq)
        if ("filename" in rq):
            df = pd.read_csv("client_files/" + rq['filename'])
            state_dict[rq['filename']] = df
            print("File Name Loaded: " + rq['filename'])
        else:
            print("File Name Not Found")
            return make_response(json.dumps({
                "data": "file name not found"
            }), 708)

        return make_response(json.dumps({
            "data": "ok"
        }), 200)
    else:
        return {'error': "Error with Server"}

@app.route("/topic_analysis", methods=['POST'])
def topic_analyze():
    rq = request.get_json()
    from models.topic.utils import transform_topics

    if ("filename" not in rq):
        print("Topic Analysis: File Name Not Found")
        return make_response(json.dumps({
            "data": "file name not found"
        }), 708)

    df = state_dict[rq['filename']]
    transformed = transform_topics(df[rq['selectedColumn']])
    df['topic'] = transformed
    df.to_csv("client_files/" + rq['filename']+"_topic.csv", index=False)
    
    state_dict[rq['filename']] = df

    print("Topic Analysis Completed")
    return make_response(json.dumps({
        "data": "ok"
    }), 200)

@app.route("/sentiment_analysis", methods=['POST'])
def sentiment_analysis():
    rq = request.get_json()

    if ("filename" not in rq):
        print("Sentiment Analysis: File Name Not Found")
        return make_response(json.dumps({
            "data": "file name not found"
        }), 708)

    from models.sentiments.utils import predict_sentiment

    df = state_dict[rq['filename']]
    transformed = predict_sentiment(df[rq['selectedColumn']])
    df['sentiment'] = transformed
    df.to_csv("client_files/" + rq['filename']+"_sentiment.csv", index=False)

    return make_response(json.dumps({
        "data": "ok"
    }), 200)

@app.route("/summary", methods=['POST'])
def generate_summary():
    rq = request.get_json()

    if ("filename" not in rq):
        print("Summary: File Name Not Found")
        return make_response(json.dumps({
            "data": "file name not found"
        }), 708)

    df = state_dict[rq['filename']]
    # Calculate counts of each topic
    topic_counts = df['topic'].value_counts().to_dict()
    topic_counts = {word: count for word, count in topic_counts.items() if word.lower() not in stop_words}


    from collections import Counter
    # Top keyword
    words = ' '.join(df[rq["selectedColumn"]]).split()
    word_counts = Counter(words)
    top_n_words = word_counts.most_common(10)
    top_keywords_cnt = dict(top_n_words)

    words_to_count = ['Positive', 'Negative', 'Neural']

    sentiment_counts = df['sentiment'].value_counts().to_dict()
    sentiment_counts = {word: count for word, count in sentiment_counts.items() if word.lower() not in stop_words}

    def most_frequent_words_with_counts(text):
        words = text.split()
        word_counts = Counter(words)
        most_common_words = [word for word, count in word_counts.most_common()]
        counts = [count for word, count in word_counts.most_common()]
        return most_common_words, counts

    from nltk.tokenize import word_tokenize

    # Group by label and concatenate the texts within each group
    grouped_df = df.groupby('sentiment')
    # Get positive texts
    positive_texts = grouped_df.get_group('Positive')
    from collections import Counter
    # Top keyword
    words = ' '.join(positive_texts[rq["selectedColumn"]]).split()
    word_counts = Counter(words)
    top_n_words = word_counts.most_common(10)
    top_positive_keywords_cnt = dict(top_n_words)
    top_positive_keywords_cnt = {word: count for word, count in top_positive_keywords_cnt.items() if word.lower() not in stop_words}

    negative_texts = grouped_df.get_group('Negative')
    from collections import Counter
    # Top keyword
    words = ' '.join(negative_texts[rq["selectedColumn"]]).split()
    word_counts = Counter(words)
    top_n_words = word_counts.most_common(10)
    top_negative_words = dict(top_n_words)
    top_negative_words = {word: count for word, count in top_negative_words.items() if word.lower() not in stop_words}

    import time

    # Also store in history
    prev_history.append({
        "heading": rq['topic'],
        "timing": time.strftime('%X %x %Z'),
        "desc": str(topic_counts) + " " + str(top_keywords_cnt) + " " + str(sentiment_counts) + " " + str(top_positive_keywords_cnt) + " " + str(top_negative_words),
    })

    social_butterfly = [
        {
            "username": "anonymous",
            "profileName": "anonymous",
            "description": "I am a social butterfly",
            "time": 5
        }
    ]


    return make_response(json.dumps({
        "topic_counts": topic_counts,
        "top_keyword": top_keywords_cnt,
        "sentiment": sentiment_counts,
        "most_positive_words": top_positive_keywords_cnt,
        "most_negative_words": top_negative_words,
        "social_butterfly": social_butterfly
    }), 200)


# Finally history
@app.route("/history", methods=['GET'])
def history():
    return make_response(json.dumps(
        prev_history
    ), 200)

# run the server using this command: python app.py
if __name__ == '__main__':
    app.run(port=5000, debug=True)
