# test_groq.py

import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.1-8b-instant"
)

response = llm.invoke([
    HumanMessage(content="What are preservatives in food?")
])

print(response.content)

print('hellow')
