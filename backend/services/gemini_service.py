import google.generativeai as genai
import os
import json
import time

def analyze_grievance(content, file_path=None):
    """
    Analyzes grievance content/file using Google Gemini 1.5 Flash.
    Returns a dictionary with 'grievance_summary', 'category', 'priority', 'department'.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    
    # 1. Check API Key
    if not api_key:
        print("DEBUG: GEMINI_API_KEY not found in environment.")
        return get_mock_response(content, "Missing API Key")

    try:
        genai.configure(api_key=api_key)
        
        # 2. Prepare Model and Input
        # Switching to gemini-flash-latest to potentially bypass quota/availability issues with specific versions.
        model = genai.GenerativeModel("models/gemini-flash-latest")

        
        input_data = []
        prompt = """
        Analyze this grievance (text or attached file) and output valid JSON.
        Required JSON keys:
        - grievance_summary: One sentence summary (max 20 words).
        - category: Short descriptive title (e.g. "Water Problem", "Pension Issue").
        - priority: "Low", "Medium", or "High".
        - department: Name of the likely department.
        
        If the file is illegible, use "Needs Review" for fields.
        """
        
        if content:
            prompt += f"\nUser description: {content}"
            
        input_data.append(prompt)

        # 3. Handle File Upload
        if file_path:
            try:
                print(f"DEBUG: Uploading file: {file_path}")
                uploaded_file = genai.upload_file(file_path)
                print(f"DEBUG: File uploaded successfully: {uploaded_file.uri}")
                input_data.append(uploaded_file)
            except Exception as e:
                print(f"DEBUG: File upload failed: {e}")
                input_data.append(f"\n[Error: Could not process attached file: {str(e)}]")
                raise e # Re-raise to trigger fallback logic if file is critical, or just continue? 
                        # Let's catch outer loop. Actually, better to log and try text-only if file fails?
                        # No, if file upload fails (network/key), likely generation will too.

        # 4. Generate Content
        print("DEBUG: Generating content with gemini-1.5-flash...")
        response = model.generate_content(input_data)
        
        text = response.text.strip()
        print(f"DEBUG: Response text: {text}")
        
        # 5. Parse JSON
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
            
        data = json.loads(text)
        
        # 6. Normalize Keys
        # The prompt asks for 'grievance_summary', but we handle 'summary' just in case.
        if 'summary' in data and 'grievance_summary' not in data:
            data['grievance_summary'] = data['summary']
            
        # Ensure fallback defaults for missing keys
        return {
            "grievance_summary": data.get("grievance_summary", "No summary provided"),
            "category": data.get("category", "General"),
            "priority": data.get("priority", "Medium"),
            "department": data.get("department", "Admin")
        }

    except Exception as e:
        print(f"DEBUG: Gemini Service Error: {e}")
        # Log error to file for user inspection
        try:
            with open("gemini_error.log", "a") as f:
                f.write(f"[{time.ctime()}] ERROR: {str(e)}\n")
        except:
            pass
            
        return get_mock_response(content, f"AI Error: {str(e)}")

def get_mock_response(content, reason):
    """Returns a safe fallback response."""
    preview = content[:50] + "..." if content else "Document"
    return {
        "grievance_summary": f"Could not analyze: {reason}. Content: {preview}",
        "category": "Processing Error",
        "priority": "Medium",
        "department": "Admin"
    }
