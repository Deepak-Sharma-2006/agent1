import re

with open('scripts/engine/generate_chakra_slides.mjs', 'r', encoding='utf-8') as f:
    code = f.read()

pattern = r'<div class="header-bar">[\s\S]*?<img src="\$\{sihLogoB64\}" style="height:98px; object-fit:contain;">\s*</div>'

new_block = '''<div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:20px; border-bottom:2px solid #E2E8F0; padding-bottom:8px;">
      <div style="display:flex; align-items:center; gap:18px;">
        <img src="${mhaLogoB64}" style="height:65px; object-fit:contain;">
        <div>
          <div style="font-size:17px; font-weight:800; color:#0F172A; text-transform:uppercase; letter-spacing:0.5px;">Government of India | Ministry of Home Affairs</div>
          <div style="font-size:14px; font-weight:700; color:#2563EB;">Indian Cyber Crime Coordination Centre (I4C) • CIS Division</div>
        </div>
      </div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>'''

code = re.sub(pattern, new_block, code, count=1)

with open('scripts/engine/generate_chakra_slides.mjs', 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully replaced Chakra Slide 1 header with uniform 102px container!")
