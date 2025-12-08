from flask import Flask, render_template, request, jsonify
import json, os
from datetime import datetime


app = Flask(__name__)

# ---------- Helper Safe Load ----------
def safe_load(filename):
    if not os.path.exists(filename):
        return {"scores": [], "favorites": []} if filename == "data.json" else {"reflections": []}
    with open(filename, "r") as f:
        return json.load(f)

def safe_save(filename, data):
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)


# ---------- HOME ----------
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/journal")
def journal():
    return render_template("journal.html")


# ---------- ZENSNAKE GAME ----------
@app.route("/zensnake")
def zensnake():
    return render_template("zensnake.html")


@app.route('/save', methods=['POST'])
def save_score():
    data = safe_load("backend/data.json")
    score = request.json.get("score")

    data["scores"].append(score)
    safe_save("backend/data.json", data)

    return jsonify({"message": "Score saved!"})


@app.route('/favorite', methods=['POST'])
def favorite_quote():
    data = safe_load("backend/data.json")
    quote = request.json.get("quote")

    data["favorites"].append(quote)
    safe_save("backend/data.json", data)

    return jsonify({"message": "Quote saved!"})


# ---------- REFLECTION ENTRY ----------
@app.route("/reflection")
def reflection_page():
    return render_template("reflection.html")

@app.route('/save_reflection', methods=['POST'])
def save_reflection():
    # Load existing reflections
    with open('backend/reflections.json', 'r') as f:
        data = json.load(f)

    # Get text from request
    text = request.json.get('text')
    name = request.json.get('name')

    # Create new reflection with date
    new_reflection = {
        "text": text,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "name": name
    }

    # Append and save
    data['reflections'].append(new_reflection)
    with open('backend/reflections.json', 'w') as f:
        json.dump(data, f, indent=2)

    return jsonify({"message": "Reflection saved!", "reflection": new_reflection})

# ---------- VIEW ALL REFLECTIONS ----------
@app.route("/reflections")
def view_reflections():
    data = safe_load("backend/reflections.json")
    return render_template("reflections.html", reflections=data["reflections"])

@app.route("/projects")
def view_projects():
    return render_template("projects.html")

@app.route("/about")
def about():
    return render_template("about.html")


# ---------- RUN ----------
if __name__ == "__main__":
    app.run(debug=True)
