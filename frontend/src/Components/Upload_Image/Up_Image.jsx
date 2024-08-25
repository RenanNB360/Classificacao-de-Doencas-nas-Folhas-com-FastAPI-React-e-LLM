import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaImage } from "react-icons/fa";
import './Up_Image.css';

const Up_Image = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedImage) {
            alert("Por favor, selecione uma imagem primeiro.");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedImage);

        try {
            const response = await fetch('http://127.0.0.1:8000/upload_image', {
                method: 'POST',
                body: formData,
            });

            console.log("Response status:", response.status);
            console.log(response); // Adicione essa linha para verificar a resposta

            if (response.ok) {
                navigate('/result');
            } else {
                alert("Falha ao carregar a imagem.");
            }
        } catch (error) {
            console.error("Erro ao enviar a imagem:", error);
            alert("Ocorreu um erro ao enviar a imagem.");
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h3>Carregue uma imagem da folha</h3>
                <div className='input-field'>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <FaImage className='icon' />
                </div>
                <button type="submit">Pesquisar doença</button>
            </form>
        </div>
    );
};

export default Up_Image;
