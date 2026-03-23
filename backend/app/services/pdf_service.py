"""
PDF Service — Resume PDF generation.
This is the EXACT same logic from pages/1_Resume_Builder.py.
"""
import re
from fpdf import FPDF


def break_long_words(match):
    """Helper to insert a space into words that exceed safe PDF margins."""
    word = match.group(0)
    return " ".join(word[i:i+80] for i in range(0, len(word), 80))

def clean_text(text):
    """Sanitize text for PDF compatibility (Latin-1 encoding) and fix absurd string widths."""
    if not text:
        return ""
    
    # Break unbroken strings over 80 chars (like '---------...') to prevent fpdf2 horizontal space crashes
    text = re.sub(r'\S{80,}', break_long_words, text)
    replacements = {
        "\u2013": "-", "\u2014": "-", "\u2018": "'",
        "\u2019": "'", "\u201c": '"', "\u201d": '"',
        "\u2022": "*"
    }
    for char, replacement in replacements.items():
        text = text.replace(char, replacement)
    return text.encode('latin-1', 'replace').decode('latin-1')


def hex_to_rgb(hex_str):
    """Convert hex color string to RGB tuple."""
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))


class PDF(FPDF):
    def __init__(self, brand_color=(0, 0, 128)):
        super().__init__()
        self.brand_color = brand_color

    def header(self):
        pass

    def add_modern_header(self, name, contact_info):
        name = clean_text(name)
        contact_info = clean_text(contact_info)
        
        self.set_fill_color(*self.brand_color)
        self.rect(0, 0, 210, 35, 'F')
        
        self.set_text_color(255, 255, 255)
        self.set_font('Arial', 'B', 24)
        self.set_xy(10, 12)
        self.cell(0, 10, name.upper(), 0, 1, 'C')
        
        self.set_font('Arial', '', 10)
        self.set_xy(10, 28)
        self.cell(0, 5, contact_info, 0, 1, 'C')
        
        self.ln(20)

    def add_classic_header(self, name, contact_info):
        name = clean_text(name)
        contact_info = clean_text(contact_info)
        
        self.set_text_color(*self.brand_color)
        self.set_font('Arial', 'B', 22)
        self.cell(0, 10, name.upper(), 0, 1, 'C')
        
        self.set_text_color(80, 80, 80)
        self.set_font('Arial', '', 10)
        self.cell(0, 5, contact_info, 0, 1, 'C')
        
        self.set_draw_color(*self.brand_color)
        self.set_line_width(0.5)
        self.line(10, 32, 200, 32)
        self.ln(15)

    def section_title(self, title):
        title = clean_text(title)
        self.set_font('Arial', 'B', 12)
        self.set_text_color(*self.brand_color)
        self.cell(0, 8, title.upper(), 0, 1, 'L')
        
        curr_y = self.get_y() - 1
        self.set_draw_color(*self.brand_color)
        self.set_line_width(0.3)
        self.line(10, curr_y, 200, curr_y)
        self.set_line_width(0.2)
        self.ln(2)

    def section_body(self, text):
        text = clean_text(text)
        self.set_text_color(40, 40, 40)
        self.set_font('Arial', '', 10)
        self.multi_cell(0, 5, text)
        self.ln(3)

    def bullet_points(self, items):
        self.set_font('Arial', '', 10)
        self.set_text_color(40, 40, 40)
        for item in items:
            if not item or not item.strip():
                continue
            item = clean_text(item)
            self.set_x(16)  # Explicitly set X to 16 to avoid fpdf2 margin accumulation bugs
            self.cell(4, 5, chr(127), 0, 0)  # Bullet char
            self.multi_cell(0, 5, item)
        self.ln(3)
