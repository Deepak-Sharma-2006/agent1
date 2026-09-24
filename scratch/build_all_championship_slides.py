import os
import re

def get_slide_2_and_3(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find case 2
    c2_start = content.find('case 2:')
    c3_start = content.find('case 3:')
    c4_start = content.find('case 4:')

    slide_2 = content[c2_start:c3_start]
    slide_3 = content[c3_start:c4_start]

    return slide_2, slide_3

print("Testing helper...")
s2_b, s3_b = get_slide_2_and_3('scripts/engine/generate_bhedak_slides.mjs')
print("Slide 2 len:", len(s2_b), "Slide 3 len:", len(s3_b))
s2_c, s3_c = get_slide_2_and_3('scripts/engine/generate_chakra_slides.mjs')
print("Slide 2 chakra len:", len(s2_c), "Slide 3 chakra len:", len(s3_c))
