import json
import os

def generate_sql():
    with open('local_data_dump.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    sql_lines = []
    
    # Disable foreign key checks for the session if possible (or just insert in order)
    # Postgre SQL order: Company -> ProjectHistory, Assessment
    
    # 1. Company
    companies = data.get('Company', [])
    for c in companies:
        # Use INSERT ... ON CONFLICT (businessNumber) DO UPDATE
        cols = []
        vals = []
        updates = []
        for k, v in c.items():
            cols.append(f'"{k}"')
            if v is None:
                val = 'NULL'
            elif isinstance(v, str):
                # Escape single quotes
                escaped = v.replace("'", "''")
                val = f"'{escaped}'"
            else:
                val = str(v)
            vals.append(val)
            if k != 'id' and k != 'businessNumber':
                updates.append(f'"{k}" = EXCLUDED."{k}"')
        
        sql = f'INSERT INTO "Company" ({", ".join(cols)}) VALUES ({", ".join(vals)})'
        sql += f' ON CONFLICT ("businessNumber") DO UPDATE SET {", ".join(updates)};'
        sql_lines.append(sql)

    # 2. ProjectHistory
    projects = data.get('ProjectHistory', [])
    for p in projects:
        cols = []
        vals = []
        for k, v in p.items():
            cols.append(f'"{k}"')
            if v is None:
                val = 'NULL'
            elif isinstance(v, str):
                escaped = v.replace("'", "''")
                val = f"'{escaped}'"
            else:
                val = str(v)
            vals.append(val)
        
        sql = f'INSERT INTO "ProjectHistory" ({", ".join(cols)}) VALUES ({", ".join(vals)})'
        sql += f' ON CONFLICT ("id") DO UPDATE SET ' + ", ".join([f'"{k}" = EXCLUDED."{k}"' for k in p.keys() if k != 'id']) + ';'
        sql_lines.append(sql)

    # 3. Assessment
    assessments = data.get('Assessment', [])
    for a in assessments:
        cols = []
        vals = []
        for k, v in a.items():
            cols.append(f'"{k}"')
            if v is None:
                val = 'NULL'
            elif isinstance(v, str):
                escaped = v.replace("'", "''")
                val = f"'{escaped}'"
            else:
                val = str(v)
            vals.append(val)
        
        sql = f'INSERT INTO "Assessment" ({", ".join(cols)}) VALUES ({", ".join(vals)})'
        sql += f' ON CONFLICT ("id") DO UPDATE SET ' + ", ".join([f'"{k}" = EXCLUDED."{k}"' for k in a.keys() if k != 'id']) + ';'
        sql_lines.append(sql)

    with open('migration_data.sql', 'w', encoding='utf-8') as f:
        f.write("\n".join(sql_lines))
    
    print(f"SQL migration file generated: migration_data.sql ({len(sql_lines)} statements)")

if __name__ == "__main__":
    generate_sql()
