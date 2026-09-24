import sys, re

sys.stdout.reconfigure(encoding='utf-8')

def inspect_file(filename, prefix):
    print(f"================ {filename} ================")
    with open(filename, 'r', encoding='utf-8') as f:
        text = f.read()

    for i in range(1, 7):
        c_start = text.find(f'case {i}:')
        c_end = text.find(f'case {i+1}:') if i < 6 else text.find('default:')
        chunk = text[c_start:c_end]
        print(f"\n--- Slide {i} ---")
        
        # Check header
        h_match = re.search(r'(<div style="display:flex;.*?height:\s*102px;.*?>)', chunk, re.DOTALL)
        if h_match:
            print("Header 102px: YES")
        else:
            print("Header 102px: NO")
            h_any = re.search(r'<!-- Header.*?-->', chunk)
            if h_any:
                print("Header comment:", h_any.group(0))

        # Check SIH logo
        if '${sihLogoB64}' in chunk:
            print("SIH logo top-right: YES")
        else:
            print("SIH logo top-right: NO")

        # Check footer
        f_match = re.search(r'position:\s*absolute;\s*bottom:\s*0;\s*left:\s*0;\s*right:\s*0;\s*height:\s*42px;\s*background:\s*#0D5CA8;', chunk)
        if f_match:
            print(f"Blue 42px footer: YES")
        else:
            print(f"Blue 42px footer: NO")

inspect_file('scripts/engine/generate_bhedak_slides.mjs', 'BHEDAK')
inspect_file('scripts/engine/generate_chakra_slides.mjs', 'CHAKRA')
