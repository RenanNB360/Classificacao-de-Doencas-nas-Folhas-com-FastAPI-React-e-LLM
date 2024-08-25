import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ResultPage.css';

const ResultPage = () => {
    const { name } = useParams();
    const [imageSrc, setImageSrc] = useState(null);
    const [classificationResult, setClassificationResult] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchImage = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/download/`, {
                method: 'GET',
            });
            if (response.ok) {
                const imageBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setImageSrc(imageObjectURL);
            } else {
                console.error("Falha ao buscar a imagem.");
            }
        } catch (error) {
            console.error("Erro ao buscar a imagem:", error);
        }
    };

    const fetchClassification = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/classification`, {
                method: 'GET',
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Resposta da classificação:", data); // Adiciona um log para depuração
                setClassificationResult(data);
            } else {
                console.error("Falha ao buscar a classificação.");
            }
        } catch (error) {
            console.error("Erro ao buscar a classificação:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        navigate('/');
    }

    useEffect(() => {
        fetchImage();
        fetchClassification();
    }, [name]);

    return (
        <div className="page">
            <button className="top-left-button" onClick={handleSubmit}>Carregar uma nova imagem</button>
            <div className="container2">
                <div className="result-container">
                    {imageSrc ? <img src={imageSrc} alt="Resultado da Pesquisa" /> : <p>Carregando imagem...</p>}
                    {classificationResult && (
                        <div className="result-box">
                            <p>Resultado: {classificationResult.result}</p>
                            <p>Acurácia: {classificationResult.accuracy}</p>
                            <p>Resposta IA: {classificationResult.response_ai}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultPage;