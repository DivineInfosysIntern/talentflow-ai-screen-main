# backend/app.py

import os
import fitz  # PyMuPDF
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# --- 1. Configuration ---
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Configure File Uploads
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "TalentFlow AI Screening API is running 🚀"})


# --- 2. Helper Functions ---
def extract_text_from_pdf(file_path):
    """Extracts text content from a PDF file."""
    try:
        doc = fitz.open(file_path)
        text = "".join(page.get_text() for page in doc)
        return text
    except Exception as e:
        print(f"Error extracting text from {file_path}: {e}")
        return ""

def analyze_with_llm(jd_text, resume_text):
    """
    Uses the Gemini LLM to return a detailed analysis in JSON format.
    """
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # --- UPDATED PROMPT ---
    # This new prompt asks for a JSON object with a score and reasoning.
    prompt = f"""
    Analyze the following resume based on the provided job description.
    Your task is to provide a detailed analysis in JSON format.
    The JSON object must contain three keys:
    1. "classification": A single word, either "Relevant" or "Irrelevant".
    2. "score": An integer between 0 and 100 representing the compatibility percentage.
    3. "reasoning": An array of short strings (bullet points) explaining the score and classification. Provide 2-3 key reasons.

    Example Response:
    {{
      "classification": "Relevant",
      "score": 85,
      "reasoning": ["Strong experience with Python and Flask matches requirements.", "5+ years of experience aligns with the senior role.", "Degree in Computer Science is as specified."]
    }}

    ---
    Job Description:
    {jd_text}
    ---
    Resume:
    {resume_text}
    ---
    JSON Analysis:
    """
    
    try:
        response = model.generate_content(prompt)
        # Clean up the response to extract the JSON part
        json_text = response.text.strip().replace("```json", "").replace("```", "").strip()
        analysis_result = json.loads(json_text)
        return analysis_result
    except (json.JSONDecodeError, KeyError, Exception) as e:
        print(f"Error parsing LLM response or API error: {e}")
        # Return a default error structure if the LLM fails
        return {
            "classification": "Irrelevant",
            "score": 0,
            "reasoning": ["Failed to analyze the resume due to a processing error."]
        }

# --- 3. Main API Endpoint ---
@app.route('/api/screen', methods=['POST'])
def screen_resumes():
    if 'jd' not in request.files or 'resumes' not in request.files:
        return jsonify({"error": "Job description or resumes not provided"}), 400

    jd_file = request.files['jd']
    resume_files = request.files.getlist('resumes')

    jd_path = os.path.join(app.config['UPLOAD_FOLDER'], jd_file.filename)
    jd_file.save(jd_path)
    
    print("Files received. Starting detailed analysis...")

    jd_text = extract_text_from_pdf(jd_path)
    
    relevant_resumes = []
    irrelevant_resumes = []

    for resume_file in resume_files:
        resume_path = os.path.join(app.config['UPLOAD_FOLDER'], resume_file.filename)
        resume_file.save(resume_path)
        
        resume_text = extract_text_from_pdf(resume_path)
        
        analysis = analyze_with_llm(jd_text, resume_text)
        
        # --- UPDATED DATA STRUCTURE ---
        # We now include the full analysis object.
        result_data = {
            "name": resume_file.filename,
            "score": analysis.get("score", 0),
            "reasoning": analysis.get("reasoning", [])
        }
        
        print(f"Analyzing {resume_file.filename}... Score: {result_data['score']}%")

        if analysis.get("classification") == "Relevant":
            relevant_resumes.append(result_data)
        else:
            irrelevant_resumes.append(result_data)
            
        os.remove(resume_path)

    os.remove(jd_path)

    final_results = {
        "relevant": relevant_resumes,
        "irrelevant": irrelevant_resumes
    }
    
    print("Analysis complete. Sending detailed results to frontend.")
    return jsonify(final_results), 200

# --- 4. Start the Server ---
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 3001))  # Render will set $PORT
    app.run(host="0.0.0.0", port=port, debug=True)
