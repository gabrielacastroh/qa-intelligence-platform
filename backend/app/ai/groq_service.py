import os

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

groq_client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)


async def generate_technical_review(audit_data: dict):
    prompt = f"""
    Eres una ingeniera senior de QA especializada en:
    - accesibilidad web
    - performance
    - testing automatizado
    - auditoría técnica frontend

    Analiza los siguientes resultados de testing.

    DATA:
    {audit_data}

    INSTRUCCIONES:
    - Responde SOLO en español
    - Máximo 180 palabras
    - Usa lenguaje técnico profesional
    - Sé específica pero concisa
    - No uses markdown
    - No uses **
    - No uses listas numeradas
    - Usa párrafos cortos
    - Menciona problemas importantes
    - Explica riesgos reales
    - Da recomendaciones accionables
    - El tono debe parecer un reporte enterprise SaaS

    ESTRUCTURA:

    Resumen:
    texto...

    Problemas detectados:
    texto...

    Riesgos:
    texto...

    Recomendaciones:
    texto...
    """

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Eres una ingeniera senior de QA y auditoría "
                        "técnica de aplicaciones web."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.3,
            max_tokens=500,
        )

        return response.choices[0].message.content

    except Exception as exc:
        return f"Análisis técnico no disponible: {str(exc)}"
