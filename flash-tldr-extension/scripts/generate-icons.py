#!/usr/bin/env python3
"""
Generate icons for FlashTL;DR extension
Creates PNG icons in different sizes with a lightning bolt design
"""

from PIL import Image, ImageDraw
import os

def create_lightning_icon(size):
    """Create a lightning bolt icon of the specified size"""
    # Create a new image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate positions based on size
    center = size // 2
    width = max(2, size // 6)  # Minimum width of 2 pixels
    
    # Lightning bolt points (simplified shape)
    points = [
        (center - width, size // 4),           # Top left
        (center + width, size // 4),           # Top right
        (center, size // 2),                   # Middle point
        (center - width//2, size * 3 // 4),    # Bottom left
        (center + width, size * 3 // 4)        # Bottom right
    ]
    
    # Draw lightning bolt with blue color
    draw.polygon(points, fill=(102, 126, 234, 255))  # Blue color
    
    return img

def main():
    """Generate all required icon sizes"""
    # Create icons directory if it doesn't exist
    os.makedirs('dist/icons', exist_ok=True)
    
    # Required icon sizes for Chrome extension
    sizes = [16, 32, 48, 128]
    
    print("⚡ Generating FlashTL;DR extension icons...")
    
    for size in sizes:
        try:
            # Create the icon
            icon = create_lightning_icon(size)
            
            # Save the icon
            icon_path = f'dist/icons/icon{size}.png'
            icon.save(icon_path)
            
            print(f"✅ Created {icon_path} ({size}x{size})")
            
        except Exception as e:
            print(f"❌ Error creating icon{size}.png: {e}")
    
    print("🎉 All icons generated successfully!")
    print("\nIcons are ready for the Chrome extension!")

if __name__ == "__main__":
    main()
