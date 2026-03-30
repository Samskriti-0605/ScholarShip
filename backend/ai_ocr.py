import easyocr
import re
import difflib

# Initialize EasyOCR reader (English)
reader = easyocr.Reader(['en'])

def extract_text(image_path):
    # readtext with detail=0 returns only the text content as a list of strings
    results = reader.readtext(image_path, detail=0)
    return " ".join(results)

def calculate_fraud_score(extracted_text, student_data, doc_type):
    score = 0
    text_lower = extracted_text.lower()
    name_lower = student_data['name'].lower()
    
    name_found = False
    for word in name_lower.split():
        if word in text_lower:
            name_found = True
            break
            
    if not name_found:
        ratio = difflib.SequenceMatcher(None, name_lower, text_lower[:len(name_lower)*2]).ratio()
        if ratio < 0.3:
            score += 30
            
    numbers = set(re.findall(r'\d+', extracted_text))
    
    if doc_type == 'income':
        income_str = str(int(float(student_data['income'])))
        if income_str not in numbers:
            score += 40
            
        income_keywords = ['income', 'salary', 'revenue', 'tahsildar', 'rupees', 'certificate', 'annual']
        if not any(kw in text_lower for kw in income_keywords):
            score += 50
            
    elif doc_type in ['marksheet_10', 'marksheet_12']:
        marks_str = str(int(float(student_data['marks'])))
        if marks_str not in numbers:
            score += 30
            
        marks_keywords = ['marks', 'grade', 'percentage', 'university', 'board', 'school', 'report', 'cgpa', 'examination']
        if not any(kw in text_lower for kw in marks_keywords):
            score += 50
            
        if doc_type == 'marksheet_10' and not any(kw in text_lower for kw in ['10th', 'tenth', 'sslc', 'secondary', 'matriculation', 'cbse', 'icse']):
            score += 20
        if doc_type == 'marksheet_12' and not any(kw in text_lower for kw in ['12th', 'twelfth', 'hsc', 'senior', 'higher', 'puc', 'intermediate']):
            score += 20
            
    elif doc_type == 'first_graduate':
        fg_keywords = ['first', 'graduate', 'generation', 'degree', 'certificate', 'tahsildar', 'revenue', 'taluq']
        if sum(1 for kw in fg_keywords if kw in text_lower) < 2:
            score += 50
            
    elif doc_type == 'id':
        id_keywords = ['identity', 'card', 'aadhaar', 'pan', 'passport', 'voter', 'license', 'dob', 'birth']
        if not any(kw in text_lower for kw in id_keywords):
            score += 50
        
    category = "High Risk"
    if score <= 30:
        category = "Low Risk"
    elif score <= 70:
        category = "Medium Risk"
        
    return score, category

def analyze_document(file_path, student_data, doc_type):
    try:
        extracted_text = extract_text(file_path)
        if len(extracted_text.strip()) > 5:
            score, category = calculate_fraud_score(extracted_text, student_data, doc_type)
            return score, category
        else:
            return 80, "High Risk (Unreadable Document)"
    except Exception as e:
        raise RuntimeError(f"ACCURATE OCR ENGINE FAILED: Document Scanning encountered an error. Please ensure the file is a valid image (PNG/JPG). Error: {str(e)}")
