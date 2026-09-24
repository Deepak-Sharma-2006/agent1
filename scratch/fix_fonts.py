with open('scratch/build_slide5_slide6.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('font-size:9.5px;', 'font-size:10.5px;')
code = code.replace('font-size:9px;', 'font-size:10.5px;')
code = code.replace('font-size="9"', 'font-size="11"')
code = code.replace('width: 66px;\n      height: 66px;', 'width: 76px;\n      height: 72px;')

with open('scratch/build_slide5_slide6.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("build_slide5_slide6.py sanitized successfully.")
