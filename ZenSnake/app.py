from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/save', methods=['POST'])
def save_score():
    data = json.load(open('data.json'))
    score = request.json.get('score')
    data['scores'].append(score)
    json.dump(data, open('data.json', 'w'))
    return jsonify({'message': 'Score saved!'})

@app.route('/favorite', methods=['POST'])
def favorite_quote():
    data = json.load(open('data.json'))
    quote = request.json.get('quote')
    data['favorites'].append(quote)
    json.dump(data, open('data.json', 'w'))
    return jsonify({'message': 'Quote saved!'})

if __name__ == '__main__':
    app.run(debug=True)
