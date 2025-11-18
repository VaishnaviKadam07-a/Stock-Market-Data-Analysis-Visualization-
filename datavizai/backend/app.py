from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import numpy as np
from sklearn.linear_model import LinearRegression
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from textblob import TextBlob
import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

app = Flask(__name__)
CORS(app)  # allow React frontend

# ---------- Database Connection ----------
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",       # your MySQL username
        password="root",   # your MySQL password
        database="finance_db"
    )

# ---------- Helper: Sentiment Analysis ----------
def sentiment_analysis(text):
    polarity = TextBlob(text).sentiment.polarity
    if polarity > 0.1:
        return "Positive"
    elif polarity < -0.1:
        return "Negative"
    else:
        return "Neutral"

# ---------- API: Get All Stocks (with company name) ----------
@app.route("/get_stocks", methods=["GET"])
def get_stocks():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT s.company_id, c.name AS company, c.city, s.date,
               s.open_price, s.close_price, s.volume
        FROM stocks s
        JOIN companies c ON s.company_id = c.company_id
        ORDER BY s.date
    """
    cursor.execute(query)
    data = cursor.fetchall()
    conn.close()
    return jsonify(data)

# ---------- API: Get Stocks by Company ----------
@app.route("/company/<name>", methods=["GET"])
def get_company(name):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT s.date, s.close_price AS price
        FROM stocks s
        JOIN companies c ON s.company_id = c.company_id
        WHERE c.name = %s
        ORDER BY s.date
    """
    cursor.execute(query, (name,))
    data = cursor.fetchall()
    conn.close()
    return jsonify(data)

# ---------- API: Predict Next Price (LSTM + Sentiment) ----------
@app.route("/predict/<name>", methods=["GET"])
def predict(name):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        SELECT s.close_price
        FROM stocks s
        JOIN companies c ON s.company_id = c.company_id
        WHERE c.name = %s
        ORDER BY s.date
    """
    cursor.execute(query, (name,))
    prices = [row[0] for row in cursor.fetchall()]
    conn.close()

    if len(prices) < 5:
        return jsonify({"error": "Not enough data to predict"})

    # Prepare data for LSTM
    prices = np.array(prices)
    X, y = [], []
    for i in range(len(prices)-3):
        X.append(prices[i:i+3])
        y.append(prices[i+3])
    X = np.array(X).reshape(-1, 3, 1)
    y = np.array(y)

    # Build LSTM model
    model = Sequential()
    model.add(LSTM(50, input_shape=(3,1)))
    model.add(Dense(1))
    model.compile(optimizer="adam", loss="mse")
    model.fit(X, y, epochs=50, verbose=0)

    # Prediction
    pred = model.predict(X[-1].reshape(1,3,1))[0][0]
    predicted_price = round(float(pred), 2)

    # Sentiment (placeholder text)
    company_news = f"{name} shows strong growth and stable market trend."
    sentiment = sentiment_analysis(company_news)

    # Recommendation
    if sentiment == "Positive" and predicted_price > prices[-1]:
        recommendation = "Buy"
    elif sentiment == "Negative" and predicted_price < prices[-1]:
        recommendation = "Sell"
    else:
        recommendation = "Hold"

    return jsonify({
        "company": name,
        "latest_price": prices[-1],
        "predicted_price": predicted_price,
        "sentiment": sentiment,
        "recommendation": recommendation
    })

# ---------- Chatbot API ----------
companies_info = {
    "Tata Motors": "Tata Motors is a leading automotive manufacturer in India, innovating mobility for a sustainable future.",
    "Infosys": "Infosys is a global leader in technology services and consulting, transforming enterprises with innovation.",
    "Reliance": "Reliance Industries is a conglomerate focusing on energy, retail, and digital services, shaping India’s economy.",
    "Mahindra": "Mahindra Group operates in automotive, farm equipment, and IT sectors, promoting sustainable growth.",
    "Wipro": "Wipro is a multinational corporation providing IT, consulting, and business process services."
}

@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.json
    question = data.get("question", "").lower()

    for company, info in companies_info.items():
        if company.lower() in question:
            return jsonify({"answer": info})

    if "stock" in question:
        return jsonify({"answer": "You can check stock data and predictions using our analytics feature."})

    return jsonify({"answer": "Sorry, I can provide info about Tata Motors, Infosys, Reliance, Mahindra, and Wipro for now."})

# ---------- API: Get All Users ----------
@app.route("/users", methods=["GET"])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users ORDER BY user_id")
    data = cursor.fetchall()
    conn.close()
    return jsonify(data)

# ---------- API: Get All Transactions ----------
@app.route("/transactions", methods=["GET"])
def get_transactions():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT t.txn_id, u.name as user_name, c.name as company, t.quantity, t.price, t.date
        FROM transactions t
        JOIN users u ON t.user_id = u.user_id
        JOIN companies c ON t.company_id = c.company_id
        ORDER BY t.date DESC
    """)
    data = cursor.fetchall()
    conn.close()
    return jsonify(data)

# ---------- API: Get Portfolio for Specific User ----------
@app.route("/portfolio/<int:user_id>", methods=["GET"])
def get_portfolio(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT c.name as company, SUM(t.quantity) as total_shares, AVG(t.price) as avg_price
        FROM transactions t
        JOIN companies c ON t.company_id = c.company_id
        WHERE t.user_id = %s
        GROUP BY c.name
    """, (user_id,))
    data = cursor.fetchall()
    conn.close()
    return jsonify(data)

# ---------- Run Server ----------
if __name__ == "__main__":
    app.run(debug=True)
