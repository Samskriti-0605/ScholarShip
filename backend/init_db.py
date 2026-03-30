import sqlite3

def init_db():
    conn = sqlite3.connect('scholarship.db')
    cursor = conn.cursor()
    
    # Drop existing tables to recreate with new schema
    cursor.execute('DROP TABLE IF EXISTS Documents')
    cursor.execute('DROP TABLE IF EXISTS Applications')
    cursor.execute('DROP TABLE IF EXISTS Scholarships')
    cursor.execute('DROP TABLE IF EXISTS Students')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        income REAL DEFAULT 0,
        marks REAL DEFAULT 0,
        category TEXT DEFAULT 'N/A',
        course TEXT DEFAULT 'N/A',
        state TEXT DEFAULT 'N/A',
        role TEXT DEFAULT 'student',
        scholarship_status TEXT DEFAULT 'NONE',
        ai_trust_score INTEGER DEFAULT 100,
        mismatch_attempts INTEGER DEFAULT 0,
        has_ongoing_scholarship INTEGER DEFAULT NULL
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Scholarships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        eligibility_criteria TEXT,
        amount REAL NOT NULL
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        scholarship_id INTEGER NOT NULL,
        status TEXT DEFAULT 'PENDING',
        fraud_score INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE,
        FOREIGN KEY (scholarship_id) REFERENCES Scholarships(id) ON DELETE CASCADE
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        doc_type TEXT NOT NULL,
        file_path TEXT NOT NULL,
        is_locked INTEGER DEFAULT 0,
        FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE
    )
    ''')

    # Seed scholarships
    cursor.execute("INSERT INTO Scholarships (name, description, eligibility_criteria, amount) VALUES ('Merit Scholarship', 'For students with excellent marks.', 'Marks > 90', 50000.00)")
    cursor.execute("INSERT INTO Scholarships (name, description, eligibility_criteria, amount) VALUES ('Low Income Grant', 'For students from economically weaker sections.', 'Income < 100000', 30000.00)")
    cursor.execute("INSERT INTO Scholarships (name, description, eligibility_criteria, amount) VALUES ('General Scholarship', 'For general students pursuing higher education.', 'None', 15000.00)")
        
    conn.commit()
    conn.close()
    print("Database recreated and initialized successfully with Role support.")

if __name__ == '__main__':
    init_db()
