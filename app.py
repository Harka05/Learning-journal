from flask import Flask, render_template, jsonify, request
import json, os

app = Flask(__name__)

BASE = "backend"

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
    data = load_json("snake.json", {"highScore": 0, "games": []})

    if request.method == "POST":
        game = request.json
        data["games"].insert(0, game)

        if game["score"] > data["highScore"]:
            data["highScore"] = game["score"]

        save_json("snake.json", data)
        return jsonify({"status": "saved"})

    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
