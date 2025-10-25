from PIL import Image, ImageDraw, ImageFont
import os

# Create a 32x32 image with dark blue background
img = Image.new('RGBA', (32, 32), color='#1e293b')
draw = ImageDraw.Draw(img)

# Draw a blue circle
draw.ellipse([6, 6, 26, 26], fill='#3b82f6')

# Draw a smaller dark circle in the center to make it look like a gear
draw.ellipse([12, 12, 20, 20], fill='#1e293b')

# Save as PNG
script_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(script_dir, '..', 'src', 'app', 'icon.png')
img.save(output_path, 'PNG')
print(f"Favicon created at {output_path}")
