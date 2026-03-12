import os
import re

dir_path = r"c:\work\WEBSITE - Atla Manpower"
files = [f for f in os.listdir(dir_path) if f.endswith('.html')]

for f in files:
    filepath = os.path.join(dir_path, f)
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    
    def replace_nav(match):
        start_tag = match.group(1)
        ul_content = match.group(2)
        end_tag = match.group(3)
        
        lis = re.findall(r'\s*<li.*?>.*?</li>', ul_content, re.DOTALL)
        
        about_idx = -1
        for i, li in enumerate(lis):
            if 'about.html' in li:
                about_idx = i
                break
        
        if about_idx != -1:
            about_li = lis.pop(about_idx)
            # Insert at second to last.
            lis.insert(len(lis) - 1, about_li)
            # Ensure proper spacing
            return start_tag + ''.join(lis) + '\n            ' + end_tag
        return match.group(0)

    new_content = re.sub(r'(<ul class="nav-links">)(.*?)(</ul>)', replace_nav, content, flags=re.DOTALL)
    
    # Also do it for footer-links if it exists there, but let's just stick to nav-links for now. The prompt says "header".
    
    with open(filepath, 'w', encoding='utf-8') as file:
        file.write(new_content)

print("Nav updated.")
