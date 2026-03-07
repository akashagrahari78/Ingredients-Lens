from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnablePassthrough
import os
from dotenv import load_dotenv
import json
import sys

# Import your custom OCR extractor
from product_scanner import extract_text_from_image

# Explicitly load from the same directory as main.py
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, ".env")
load_dotenv(env_path)

# 1. Initialize the LLM  
llm = ChatGroq(
    model_name="llama-3.3-70b-versatile",
    temperature=0.2
)

# 2. Define the Output Parser  
json_parser = JsonOutputParser()

# 3. Creating the Prompt Template
template = """
You are an expert food scientist and nutritionist.
I am providing you with the raw Optical Character Recognition (OCR) text scanned from the back of a food product package.

Analyze this text and output a JSON object with the following exact schema:
{{
    "healthScore": "good, warning, or bad (based on the ingredients)",
    "scoreMessage": "A short message like 'Moderately Healthy - Consume in moderation'",
    "ingredients": [
        {{ "name": "Ingredient Name", "safety": "good, warning, or bad", "reason": "Short reason" }}
    ],
    "allergens": ["list of strings representing recognized allergens. If none, return empty list"],
    "analysis": "a short paragraph explaining the overall score.",
    "detailedAnalysis": {{
        "whyGoodOrBad": "Explain in detail why this product is considered good, average, or bad for health based strictly on the ingredients.",
        "whoShouldEat": "Mention the target demographic or under what circumstances someone should eat this.",
        "whoShouldAvoid": "Mention who should strictly avoid this (e.g., diabetics, people with heart conditions, etc.) and why."
    }}
}}

If any information is uncertain, use your expert judgment based on the provided ingredients.

Here is the raw OCR Text:
{ocr_data}
"""

prompt = ChatPromptTemplate.from_template(template)

# 4. Construct the LangChain execution chain
# We pipe the prompt into the llm, and pipe the result into our JSON parser
analysis_chain = prompt | llm | json_parser

def scan_and_analyze(image_file_path: str):
    print(f"--- Processing image: {image_file_path} ---", file=sys.stderr)
    
    # Step A: Run the image through the external OCR file
    print("1. Extracting text using product_scanner.py...", file=sys.stderr)
    try:
        raw_text = extract_text_from_image(image_file_path)
        if not raw_text.strip():
            return "No text detected in the image."
        print("\n=== EXTRACTED OCR TEXT ===", file=sys.stderr)
        print(raw_text, file=sys.stderr)
        print("==========================\n", file=sys.stderr)
    except Exception as e:
        return f"OCR Failed: {e}"
        
    print("2. Text extraction complete. Sending to Groq LLM...", file=sys.stderr)
    
    # Step B: Passing the text to our Langchain chain
    try:
        # We invoke the chain, passing in our raw text as the '{ocr_data}' variable
        result = analysis_chain.invoke({"ocr_data": raw_text})
        print("\n=== RAW LLM RESPONSE ===", file=sys.stderr)
        print(json.dumps(result, indent=4), file=sys.stderr)
        print("========================\n", file=sys.stderr)
        return result
    except Exception as e:
        return f"LLM Analysis Failed: {e}"

if __name__ == "__main__":
    # Test using provided argument
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
    else:
        print(json.dumps({"error": "No image path provided."}))
        sys.exit(1)
        
    final_analysis = scan_and_analyze(image_path)
    
    # We only print the JSON so the backend can parse it directly
    if isinstance(final_analysis, dict):
        print(json.dumps(final_analysis))
    else:
        print(json.dumps({"error": str(final_analysis)}))
