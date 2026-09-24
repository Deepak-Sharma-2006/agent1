import re

def verify_all_headers(filename):
    print("====================================")
    print("VERIFYING HEADERS IN:", filename)
    print("====================================")
    with open(filename, 'r', encoding='utf-8') as f:
        code = f.read()

    for slide_num in range(1, 7):
        case_match = re.search(rf'case {slide_num}:[\s\S]*?(?=case {slide_num+1}:|\n\s*default:)', code)
        if not case_match:
            print(f"ERROR: case {slide_num} not found!")
            continue
        case_text = case_match.group(0)
        
        # Find the header div that contains sihLogoB64
        # Look backwards from sihLogoB64 to find the enclosing or sibling flex container
        lines = case_text.split('\n')
        header_lines = []
        for i, l in enumerate(lines):
            if 'sihLogoB64' in l:
                # print 4 lines above and current line
                header_lines = lines[max(0, i-4):i+2]
                break
        
        snippet = '\n'.join(header_lines)
        has_102 = 'height:102px' in snippet or 'height: 102px' in snippet
        h_status = "102px OK" if has_102 else "CHECK HEIGHT"
        print(f"Slide {slide_num}: {h_status}\n{snippet}\n")

verify_all_headers('scripts/engine/generate_bhedak_slides.mjs')
verify_all_headers('scripts/engine/generate_chakra_slides.mjs')
