from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv
import json

# Import your custom OCR extractor
from product_scanner import extract_text_from_image

load_dotenv()

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

Analyze this text and output a JSON object with the following schema:
{{
    "ingredients": ["list of strings, representing all individual ingredients found"],
    "allergens": ["list of strings representing recognized allergens, e.g., milk, nuts, soy. If none, return empty list"],
    "health_score": "integer from 1-10 evaluating overall healthiness based on ingredients",
    "analysis": "a short paragraph explaining the score and pointing out any harmful or artificial additives."
}}

Here is the raw OCR Text:
{ocr_data}
"""

prompt = ChatPromptTemplate.from_template(template)

# 4. Construct the LangChain execution chain
# We pipe the prompt into the llm, and pipe the result into our JSON parser
analysis_chain = prompt | llm | json_parser

def scan_and_analyze(image_file_path: str):
    print(f"--- Processing image: {image_file_path} ---")
    
    # Step A: Run the image through the external OCR file
    print("1. Extracting text using product_scanner.py...")
    try:
        raw_text = extract_text_from_image(image_file_path)
        if not raw_text.strip():
            return "No text detected in the image."
    except Exception as e:
        return f"OCR Failed: {e}"
        
    print("2. Text extraction complete. Sending to Groq LLM...")
    
    # Step B: Passing the text to our Langchain chain
    try:
        # We invoke the chain, passing in our raw text as the '{ocr_data}' variable
        result = analysis_chain.invoke({"ocr_data": raw_text})
        return result
    except Exception as e:
        return f"LLM Analysis Failed: {e}"

if __name__ == "__main__":
    # Test using your image 'f2.jpg'
    image_path = 'f2.jpg' 
    
    final_analysis = scan_and_analyze(image_path)
    
     
    print("\n--- Final Structured Result ---")
    if isinstance(final_analysis, dict):
        print(json.dumps(final_analysis, indent=4))
    else:
        print(final_analysis)
    
