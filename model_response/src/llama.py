from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
import re

template = """
answer the question below.

Here is the conversation history: {context}

Question: {question}

Answer
"""

model = OllamaLLM(model='llama3')
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

def response_disease(disease):
    context = ''
    disease = re.sub(r'[,/_]', ' ', str(disease))

    if 'healthy' in disease:
        question = f'Define the plant {disease} in a maximum of 3 lines.'
    else:
        question = f'Define the disease {disease} in a maximum of 3 lines.'

    result = chain.invoke({'context': context, 'question': question})

    return result

#print(response_disease('Apple___healthy'))
