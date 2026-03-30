# AI-Powered Smart Scholarship Management System

This is a full-stack web application designed for processing student scholarship applications with an automated AI-based OCR verification step, Multi-level Approval (Admin -> Provider), and strict constraint enforcement.

## Prerequisites
- Python 3.8+
- Node.js & npm (v16+)
- MySQL Server
- [Tesseract OCR](https://github.com/UB-Mannheim/tesseract/wiki) (Required for Python `pytesseract`)

## Folder Structure
- `/backend`: Python Flask API and AI OCR logic.
- `/frontend`: React.js (Vite) frontend with Tailwind CSS.
- `schema.sql`: MySQL database schema.

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client.
2. Run the commands in `schema.sql` to create the `scholarship_db` database and all required tables.
3. Ensure your MySQL user has access to `scholarship_db`.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a Virtual Environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # On Windows
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. **Configuration**: Edit `app.py` to match your MySQL root password if it's not empty:
   ```python
   DB_PASSWORD = '' # Update this with your actual DB password if necessary
   ```
5. **Start the Flask Server**:
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install Node dependencies (if they aren't installed yet):
   ```bash
   npm install
   ```
3. **Start the React App**:
   ```bash
   npm run dev
   ```
4. Open the displayed local URL (typically `http://localhost:5173`) in your browser.

## Using the System

### Test Journey
1. **Register a Student**:
   - Go to the start page UI, select "Register" on the bottom text toggle.
   - Fill in dummy details (e.g., student_id "S101", Name "John Doe").
   - Login with the newly registered student ID and password.
2. **Apply & Upload**:
   - In the Student Dashboard, click "Get Recommendations" based on income & marks.
   - Click "Apply" for a scholarship.
   - Upload an image document (e.g., a dummy Income certificate image). Uploading triggers the OCR AI check on the backend.
3. **Admin Verification**:
   - Logout from student.
   - Login as explicit Admin (Select Admin role from radio buttons, ID: `admin`, Password: `admin123`).
   - You will see the student's application along with the AI-calculated Fraud Risk Score based on OCR mismatches.
   - Click "Approve & Forward" to send it to the Provider.
4. **Final Approval**:
   - Logout from Admin.
   - Login as explicit Provider (Select Provider role from radio buttons, ID: `provider`, Password: `prov123`).
   - You will see the pending forwarded application.
   - Click "Approve Fully" to finalize.
