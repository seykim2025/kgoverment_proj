import sqlite3
import json

def extract_data():
    conn = sqlite3.connect('dev.db')
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]
    
    data = {}
    for table in tables:
        if table.startswith('sqlite_') or table.startswith('_prisma'):
            continue
            
        cursor.execute(f"SELECT * FROM {table}")
        cols = [d[0] for d in cursor.description]
        rows = cursor.fetchall()
        
        table_data = []
        for row in rows:
            table_data.append(dict(zip(cols, row)))
            
        data[table] = table_data
        
    with open('local_data_dump.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    conn.close()
    print("Data extraction complete: local_data_dump.json")

if __name__ == "__main__":
    extract_data()
