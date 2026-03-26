import os
import re

directory = r"c:\Users\devdo\.vscode\Projects_new\CarrerForge-AI-FS-UI\frontend\src"

rollback = {
    # Backgrounds
    r"dark:bg-violet-950": "dark:bg-slate-950",
    r"dark:bg-violet-900": "dark:bg-slate-900",
    r"dark:bg-violet-800": "dark:bg-slate-800",
    r"bg-violet-950": "bg-slate-950",
    r"bg-violet-900": "bg-slate-900",
    
    # Borders
    r"dark:border-violet-800": "dark:border-slate-800",
    r"border-violet-800": "border-slate-800",
    
    # Accents 
    r"dark:bg-violet-500": "dark:bg-teal-500",
    r"bg-violet-500": "bg-teal-500",
    r"dark:text-violet-500": "dark:text-teal-400",
    r"text-violet-500": "text-teal-500",
    r"dark:hover:bg-violet-400": "dark:hover:bg-teal-400",
    r"dark:hover:bg-violet-500": "dark:hover:bg-teal-500",
    r"dark:hover:bg-violet-800": "dark:hover:bg-slate-800",
    r"dark:border-violet-500/30": "dark:border-teal-500/30",
    r"dark:bg-violet-500/10": "dark:bg-teal-500/10",
    
    # Texts
    r"dark:text-violet-300": "dark:text-slate-400",
    r"dark:text-violet-400": "dark:text-slate-500",
    r"dark:text-violet-200": "dark:text-slate-300",
    r"dark:text-violet-100": "dark:text-slate-200",
    r"dark:hover:text-violet-200": "dark:hover:text-slate-300",
    
    # Edge Cases
    r"bg-violet-900 border-violet-800": "bg-slate-900 border-slate-800",
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for pattern, replacement in rollback.items():
        content = re.sub(pattern, replacement, content)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Rolled back theme logic in {os.path.basename(filepath)}")

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.jsx'):
            process_file(os.path.join(root, file))
