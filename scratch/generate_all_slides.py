import os
import re

def build_slides():
    print("Building full championship slides for BHEDAK and CHAKRA...")

    # Load existing Slide 2 and Slide 3 from bhedak
    with open('scripts/engine/generate_bhedak_slides.mjs', 'r', encoding='utf-8') as f:
        bhedak_old = f.read()

    # Load existing Slide 2 and Slide 3 from chakra
    with open('scripts/engine/generate_chakra_slides.mjs', 'r', encoding='utf-8') as f:
        chakra_old = f.read()

    # Extract Slide 2
    def extract_case(content, case_num, next_case_num):
        start = content.find(f'case {case_num}:')
        end = content.find(f'case {next_case_num}:') if next_case_num else content.rfind('default:')
        if end == -1 and not next_case_num:
            end = content.rfind('}')
        return content[start:end]

    bhedak_slide_2 = extract_case(bhedak_old, 2, 3)
    chakra_slide_2 = extract_case(chakra_old, 2, 3)

    bhedak_slide_3_raw = extract_case(bhedak_old, 3, 4)
    chakra_slide_3_raw = extract_case(chakra_old, 3, 4)

    # In Slide 3, replace the old footer with the solid blue footer bar
    # And adjust container padding to ensure 42px clearance
    def fix_slide_3(raw_slide_3, project_name):
        # replace container padding
        s3 = raw_slide_3.replace('padding: 16px 36px 18px 36px;', 'padding: 14px 36px 42px 36px;')
        # regex replace footer
        footer_regex = r'<!-- Footer Bar -->\s*<div style=.*?</div>\s*</div>'
        new_footer = f"""<!-- Solid Blue Footer Bar -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:42px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px; z-index:100;">
      <div style="width:30px;"></div>
      <div style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">{project_name} - @SIH Idea Submission</div>
      <div style="font-size:22px; font-weight:900; color:#FFFFFF;">3</div>
    </div>"""
        s3_fixed = re.sub(footer_regex, new_footer, s3, flags=re.DOTALL)
        return s3_fixed

    bhedak_slide_3 = fix_slide_3(bhedak_slide_3_raw, 'BHEDAK')
    chakra_slide_3 = fix_slide_3(chakra_slide_3_raw, 'CHAKRA')

    print("Slide 2 & 3 prepped successfully.")

build_slides()
