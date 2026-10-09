import re

with open('/Users/kishorep/.gemini/antigravity/brain/8285d647-bc1e-4d5b-929f-2ec4217625ec/.system_generated/steps/3/content.md', 'r') as f:
    content = f.read()

# clean line numbers
lines = []
for line in content.split('\n'):
    if re.match(r'^\d+: ', line):
        lines.append(line.split(': ', 1)[1])
    else:
        lines.append(line)
html = '\n'.join(lines)

def get_text(tag):
    pattern = f"<{tag}[^>]*>(.*?)</{tag}>"
    matches = re.finditer(pattern, html, re.IGNORECASE | re.DOTALL)
    for m in matches:
        text = re.sub(r'<[^>]+>', '', m.group(1))
        text = re.sub(r'\s+', ' ', text).strip()
        if text:
            print(f"[{tag}] {text}")

print("=== HEADINGS ===")
for t in ['h1', 'h2', 'h3', 'h4']: get_text(t)
print("=== PARAGRAPHS ===")
get_text('p')
print("=== LIST ITEMS ===")
get_text('li')
