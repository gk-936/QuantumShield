import re

with open(r'g:\CYS\4\pnb\QuantumShield\frontend\src\pages\PQCSelector.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace ALGO_COLORS map and basic hexes
colors = {
    '#00d4ff': '#0284c7',  # light blue -> blue 600
    '#a855f7': '#9333ea',  # purple -> purple 600
    '#22c55e': '#16a34a',  # green -> green 600
    '#f59e0b': '#d97706',  # amber -> amber 600
    '#ef4444': '#dc2626',  # red -> red 600
    '#ec4899': '#db2777'   # pink -> pink 600
}
for old, new in colors.items():
    content = content.replace(old, new)

# Replace RGBA colors for active states to match the new darker hexes
content = re.sub(r'rgba\(0,\s*212,\s*255,\s*([^)]+)\)', r'rgba(2,132,199,\1)', content)
content = re.sub(r'rgba\(168,\s*85,\s*247,\s*([^)]+)\)', r'rgba(147,51,234,\1)', content)
content = re.sub(r'rgba\(34,\s*197,\s*94,\s*([^)]+)\)', r'rgba(22,163,74,\1)', content)
content = re.sub(r'rgba\(245,\s*158,\s*11,\s*([^)]+)\)', r'rgba(217,119,6,\1)', content)
content = re.sub(r'rgba\(239,\s*68,\s*68,\s*([^)]+)\)', r'rgba(220,38,38,\1)', content)

# Replace white text with dark text
content = content.replace("color: '#fff'", "color: 'var(--text-main)'")
content = content.replace('fill="#fff"', 'fill="var(--text-main)"')
content = content.replace('fill="rgba(255,255,255,0.6)"', 'fill="var(--text-dim)"')

# Replace white-based translucency (dark mode) with black-based translucency (light mode)
# E.g., background: rgba(255,255,255,0.03) -> rgba(0,0,0,0.03)
# E.g., color: rgba(255,255,255,0.5) -> var(--text-dim)
def rgba_white_replacer(match):
    alpha = float(f"0.{match.group(1)}")
    if alpha > 0.4:
        # High opacity white -> text-dim
        return "var(--text-dim)"
    else:
        # Low opacity white (backgrounds/borders) -> black
        return f"rgba(0,0,0,0.{match.group(1)})"

content = re.sub(r'rgba\(255,\s*255,\s*255,\s*0\.([0-9]+)\)', r'rgba(0,0,0,0.\1)', content)

# Fix some specific weird contrast areas
content = content.replace("color: 'rgba(0,0,0,0.5)'", "color: 'var(--text-dim)'")
content = content.replace("color: 'rgba(0,0,0,0.6)'", "color: 'var(--text-dim)'")
content = content.replace("color: 'rgba(0,0,0,0.7)'", "color: 'var(--text-dim)'")
content = content.replace("color: 'rgba(0,0,0,0.8)'", "color: 'var(--text-main)'")

# The button text for "RUN ML SELECTOR" was white, let's keep it white since background is still a vibrant gradient
content = content.replace("background: 'linear-gradient(135deg, #0284c7, #9333ea)', color: 'var(--text-main)'", 
                          "background: 'linear-gradient(135deg, #0284c7, #9333ea)', color: '#fff'")

with open(r'g:\CYS\4\pnb\QuantumShield\frontend\src\pages\PQCSelector.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete.")
