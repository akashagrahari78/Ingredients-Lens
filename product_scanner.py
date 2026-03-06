from paddleocr import PaddleOCR
import os

# Initialize the OCR engine once to save loading time
ocr = PaddleOCR(use_angle_cls=True, lang='en')

def extract_text_from_image(image_path: str) -> str:
    """
    Takes an image path, scans it using PaddleOCR, 
    and returns the extracted text cleanly joined by newlines.
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at: {image_path}")
        
    result = ocr.ocr(image_path, cls=True)
    
    extracted_lines = []
    # result is a list of lists. result[0] contains the OCR output
    if result and result[0]:
        for line in result[0]:
            text = line[1][0]        # the recognized text
            extracted_lines.append(text.strip())
            
    # Join all lines cleanly separated by a newline
    return "\n".join(extracted_lines)

if __name__ == "__main__":
    # Test the scanner
    test_image_path = 'f2.jpg' 
    print(f"Scanning {test_image_path}...\n")
    
    extracted_text = extract_text_from_image(test_image_path)
    
    print("=== Extracted Text ===")
    print(extracted_text)
