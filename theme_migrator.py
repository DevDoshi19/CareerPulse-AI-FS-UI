import os
import re

directory = r"c:\Users\devdo\.vscode\Projects_new\CarrerForge-AI-FS-UI\frontend\src"

replacements = {
    # Backgrounds
    r"dark:bg-slate-950": "dark:bg-violet-950",
    r"dark:bg-slate-900": "dark:bg-violet-900",
    r"dark:bg-slate-800": "dark:bg-violet-800",
    r"dark:bg-\[\#020617\]": "dark:bg-violet-950",
    r"dark:bg-\[\#111827\]": "dark:bg-violet-900",
    r"dark:bg-neutral-900": "dark:bg-violet-900",
    r"dark:bg-neutral-950": "dark:bg-violet-950",
    
    # Borders
    r"dark:border-slate-800": "dark:border-violet-800",
    r"dark:border-neutral-800": "dark:border-violet-800",
    r"dark:border-\[\#334155\]": "dark:border-violet-800",
    
    # Accents (Teal/Green -> Violet)
    r"dark:bg-teal-500": "dark:bg-violet-500",
    r"dark:bg-\[\#22C55E\]": "dark:bg-violet-500",
    r"dark:text-\[\#22C55E\]": "dark:text-violet-500",
    r"dark:hover:bg-teal-400": "dark:hover:bg-violet-400",
    r"dark:hover:bg-green-400": "dark:hover:bg-violet-400",
    r"dark:border-\[\#22C55E\]\/30": "dark:border-violet-500/30",
    
    # Texts
    r"dark:text-slate-400": "dark:text-violet-300",
    r"dark:text-\[\#94A3B8\]": "dark:text-violet-300",
    r"dark:text-slate-500": "dark:text-violet-400",
    r"dark:text-slate-300": "dark:text-violet-200",
    r"dark:text-\[\#CBD5E1\]": "dark:text-violet-200",
    r"dark:text-\[\#020617\]": "dark:text-white", # Used on accent buttons
    r"dark:text-slate-950": "dark:text-white",
    
    # UIComponents Card dark static override
    r"bg-teal-900 border-teal-800": "bg-violet-900 border-violet-800",
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {os.path.basename(filepath)}")

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.jsx'):
            process_file(os.path.join(root, file))
