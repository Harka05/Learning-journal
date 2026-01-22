import requests
from flask import Flask, render_template, jsonify, request
import json, os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(BASE_DIR, "backend")


def load_json(file, default):
    path = os.path.join(BASE, file)
    if not os.path.exists(path):
        return default
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(file, data):
    path = os.path.join(BASE, file)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

SNAKE_FILE = os.path.join(BASE, "snake.json")

def load_snake_data():
    if not os.path.exists(SNAKE_FILE):
        return {"highScore": 0, "games": []}
    with open(SNAKE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_snake_data(data):
    with open(SNAKE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/api/about")
def about_api():
    return jsonify(load_json("about.json", {}))

@app.route("/api/journal")
def journal_api():
    return jsonify(load_json("journal.json", {"weeks": []}))

@app.route("/api/reflections")
def reflections_api():
    return jsonify(load_json("reflections.json", {"reflections": []})["reflections"])


@app.route("/snake")
def snake():
    return render_template("snake.html")
@app.route("/api/snake", methods=["GET", "POST"])
def snake_api():
    data = load_snake_data()

    if request.method == "POST":
        body = request.json
        score = body.get("score", 0)
        note = body.get("note", "")
        date = body.get("date")

        # Update games history
        data["games"].append({"score": score, "note": note, "date": date})

        # Update high score
        if score > data.get("highScore", 0):
            data["highScore"] = score

        save_snake_data(data)
        return jsonify({"status": "success"})

    return jsonify(data)

@app.route("/api/projects")
def projects_api():
    return jsonify(load_json("projects.json", []))


@app.route("/api/location")
def location_proxy():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}"
    r = requests.get(url, headers={"User-Agent": "HarkaApp/1.0"})
    return jsonify(r.json())

if __name__ == "__main__":
    app.run(debug=True)
