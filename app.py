from flask import Flask, render_template, request, jsonify
import json, os
from datetime import datetime

app = Flask(__name__)

# ------------------------------------
# PATHS
# ------------------------------------
REFLECTIONS_FILE = os.path.join("backend", "reflections.json")
GAME_DATA_FILE = os.path.join("backend", "data.json")

# ------------------------------------
# FOLDER SAFETY HELPER
# ------------------------------------
def ensure_folder(path):
    folder = os.path.dirname(path)
    if not os.path.exists(folder):
        os.makedirs(folder)

# ------------------------------------
# SAFE LOAD / SAVE HELPERS
# ------------------------------------
def safe_load_json(path, default):
    ensure_folder(path)
    if not os.path.exists(path):
        safe_save_json(path, default)
        return default
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return default

def safe_save_json(path, data):
    ensure_folder(path)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

# ------------------------------------
# ROUTES: BASIC PAGES
# ------------------------------------
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/journal")
def journal():
    return render_template("journal.html")

@app.route("/zensnake")
def zensnake():
    return render_template("zensnake.html")

@app.route("/projects")
def view_projects():
    return render_template("projects.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/reflection")
def reflection_page():
    return render_template("reflection.html")

@app.route("/reflections")
def view_reflections():
    data = safe_load_json(REFLECTIONS_FILE, {"reflections": []})
    return render_template("reflections.html", reflections=data["reflections"])

# ------------------------------------
# ZEN SNAKE GAME API
# ------------------------------------
@app.route('/save', methods=['POST'])
def save_score():
    data = safe_load_json(GAME_DATA_FILE, {"scores": [], "favorites": []})
    score = request.json.get("score")
    data["scores"].append(score)
    safe_save_json(GAME_DATA_FILE, data)
    return jsonify({"message": "Score saved!"})

@app.route('/favorite', methods=['POST'])
def favorite_quote():
    data = safe_load_json(GAME_DATA_FILE, {"scores": [], "favorites": []})
    quote = request.json.get("quote")
    data["favorites"].append(quote)
    safe_save_json(GAME_DATA_FILE, data)
    return jsonify({"message": "Quote saved!"})

# ------------------------------------
# REFLECTION API (PWA FRIENDLY)
# ------------------------------------
@app.route("/api/reflections")
def api_get_reflections():
    data = safe_load_json(REFLECTIONS_FILE, {"reflections": []})
    return jsonify(data["reflections"])

@app.route("/api/add_reflection", methods=['POST'])
def api_add_reflection():
    data = safe_load_json(REFLECTIONS_FILE, {"reflections": []})
    text = request.json.get('text', '').strip()
    name = request.json.get('name', '').strip()
    if not text:
        return jsonify({"error": "Reflection text cannot be empty."}), 400
    new_reflection = {
        "text": text,
        "name": name if name else "Anonymous",
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    data["reflections"].append(new_reflection)
    safe_save_json(REFLECTIONS_FILE, data)
    return jsonify({"message": "Reflection saved!", "entry": new_reflection})

# ------------------------------------
# SERVICE WORKER ROUTE
# ------------------------------------
@app.route("/sw.js")
def sw():
    return app.send_static_file("js/sw.js")

# ------------------------------------
# RUN APP
# ------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
