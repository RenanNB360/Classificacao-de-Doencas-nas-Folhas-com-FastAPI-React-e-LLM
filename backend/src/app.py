from fastapi import FastAPI, UploadFile, File
from fastapi.responses import PlainTextResponse, FileResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from uuid import uuid4
from aiofile import async_open
from transformers import pipeline
from model_response.src.llama import response_disease
import asyncio

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

media = Path('backend/media')
latest_upload = None

class FileUploadResponse(BaseModel):
    filename: str

@app.post('/upload_image', 
          description='Faz o upload da imagem da folha a ser classificada',
          response_model=FileUploadResponse)
async def upload_image(file: UploadFile = File(...)):
    global latest_upload

    file_ext: str = file.filename.split('.')[-1]
    new_name: str = f'{str(uuid4())}.{file_ext}'

    async with async_open(f'{media}/{new_name}', 'wb') as afile:
        await afile.write(file.file.read())
    
    latest_upload = new_name
    
    return FileUploadResponse(filename=new_name)


@app.get('/download/', response_class=FileResponse, description='Imprime a imagem na tela')
async def get_image():
    global latest_upload

    name = latest_upload

    file_path = f'{media}/{name}'

    return FileResponse(file_path)


@app.get('/classification', description='Aqui ele retorna a classificação da imagem')
async def result_classification():
    global latest_upload

    if latest_upload is None:
        return PlainTextResponse("Nenhuma imagem carregada.", status_code=404)
    
    file_path = f'{media}/{latest_upload}'

    classifier = pipeline('image-classification', model='./model_classification/final_model')
    classification = classifier(file_path)[0]
    classification_label = classification['label']
    classification_score = classification['score']

    if classification_label is None:
        return PlainTextResponse("Nenhuma classificação disponível.", status_code=404)

    response = await asyncio.to_thread(response_disease, classification_label)

    latest_upload = None

    return {
        'result': classification_label,
        'accuracy': f'{(classification_score * 100):.2f}%',
        'response_ai': response
    }

app.mount('/media', StaticFiles(directory="backend/media"), name="media")
