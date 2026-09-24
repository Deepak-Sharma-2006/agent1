import re

def update_slides():
    # 1. Update Bhedak
    with open('scripts/engine/generate_bhedak_slides.mjs', 'r', encoding='utf-8') as f:
        bhedak_code = f.read()

    # Uniform Slide 1 header
    s1_old_header = '''    <div class="header-bar">
      <div style="display:flex; align-items:center; gap:16px;">
        <img src="${ntroLogoB64}" style="height:55px; object-fit:contain;">
        <div>
          <div style="font-size:15px; font-weight:800; color:#0F172A; text-transform:uppercase;">Government of India | Prime Minister's Office</div>
          <div style="font-size:12px; font-weight:700; color:#1E3A8A;">National Technical Research Organisation (NTRO) • CITC Division</div>
        </div>
      </div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>'''
    
    s1_new_header = '''    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:20px; border-bottom:2px solid #E2E8F0; padding-bottom:8px;">
      <div style="display:flex; align-items:center; gap:18px;">
        <img src="${ntroLogoB64}" style="height:65px; object-fit:contain;">
        <div>
          <div style="font-size:17px; font-weight:800; color:#0F172A; text-transform:uppercase; letter-spacing:0.5px;">Government of India | Prime Minister's Office</div>
          <div style="font-size:14px; font-weight:700; color:#1E3A8A;">National Technical Research Organisation (NTRO) • CITC Division</div>
        </div>
      </div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>'''

    if s1_old_header in bhedak_code:
        bhedak_code = bhedak_code.replace(s1_old_header, s1_new_header)
        print("Updated Bhedak Slide 1 header to 102px")
    else:
        print("Bhedak Slide 1 header pattern not matched, checking regex...")

    # Uniform Slide 3 header
    s3_old_header = '''    <div style="display:flex; align-items:center; justify-content:space-between; height:78px; margin-bottom:10px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:5px 32px; font-size:26px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:46px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase;">TECHNICAL APPROACH</div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>'''

    s3_new_header = '''    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:12px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:6px 36px; font-size:28px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:52px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">TECHNICAL APPROACH</div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>'''

    if s3_old_header in bhedak_code:
        bhedak_code = bhedak_code.replace(s3_old_header, s3_new_header)
        print("Updated Bhedak Slide 3 header to 102px")

    with open('scripts/engine/generate_bhedak_slides.mjs', 'w', encoding='utf-8') as f:
        f.write(bhedak_code)

    # 2. Update Chakra
    with open('scripts/engine/generate_chakra_slides.mjs', 'r', encoding='utf-8') as f:
        chakra_code = f.read()

    s1_old_header_ch = '''    <div class="header-bar">
      <div style="display:flex; align-items:center; gap:16px;">
        <img src="${mhaLogoB64}" style="height:55px; object-fit:contain;">
        <div>
          <div style="font-size:15px; font-weight:800; color:#0F172A; text-transform:uppercase;">Government of India | Ministry of Home Affairs</div>
          <div style="font-size:12px; font-weight:700; color:#1E3A8A;">Indian Cyber Crime Coordination Centre (I4C) • CIS Division</div>
        </div>
      </div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>'''

    s1_new_header_ch = '''    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:20px; border-bottom:2px solid #E2E8F0; padding-bottom:8px;">
      <div style="display:flex; align-items:center; gap:18px;">
        <img src="${mhaLogoB64}" style="height:65px; object-fit:contain;">
        <div>
          <div style="font-size:17px; font-weight:800; color:#0F172A; text-transform:uppercase; letter-spacing:0.5px;">Government of India | Ministry of Home Affairs</div>
          <div style="font-size:14px; font-weight:700; color:#1E3A8A;">Indian Cyber Crime Coordination Centre (I4C) • CIS Division</div>
        </div>
      </div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>'''

    if s1_old_header_ch in chakra_code:
        chakra_code = chakra_code.replace(s1_old_header_ch, s1_new_header_ch)
        print("Updated Chakra Slide 1 header to 102px")

    if s3_old_header in chakra_code:
        chakra_code = chakra_code.replace(s3_old_header, s3_new_header)
        print("Updated Chakra Slide 3 header to 102px")

    with open('scripts/engine/generate_chakra_slides.mjs', 'w', encoding='utf-8') as f:
        f.write(chakra_code)

update_slides()
