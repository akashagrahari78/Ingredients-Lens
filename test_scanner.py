from paddleocr import PaddleOCR

# Initialize the OCR engine
# lang='en' for English, 'ch' for Chinese, etc.
ocr = PaddleOCR(use_angle_cls=True, lang='en')

image_path = 'p4.png'  # path to your image

result = ocr.ocr(image_path, cls=True)
print("=== Extracted Text ===")

for line in result[0]:
    text = line[1][0]        # the recognized text
    confidence = line[1][1]  # confidence score (0 to 1)
    print(f"Text: {text} | Confidence: {confidence:.2f}")