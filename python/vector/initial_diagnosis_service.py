import asyncio
import vector.config as config
from openai import OpenAI
from typing import List, Optional
from vector.embedding_service import EmbeddingService
from vector.qdrant_service import QdrantService


class InitialDiagnosisService:
    def __init__(
        self,
        embedding_service: EmbeddingService,
        qdrant_service: QdrantService,
        openai_api_key: Optional[str] = None,
        model: str = "gpt-4o"
    ):
        self.embedding_service = embedding_service
        self.qdrant_service = qdrant_service
        self.completion_model = model
        
        openai_api_key = config.OPENAI_API_KEY

        if not openai_api_key:
            raise ValueError("OpenAI API key needed for completion client.")

        try:
            self.openai_completion_client = OpenAI(api_key=openai_api_key)
        except Exception as e:
            raise
        
        
        
    async def is_valid_medical_input(self, user_input: str) -> bool:
        try:
            validation_prompt = f"""Determine if the following input is a meaningful medical description suitable for an AI-based preliminary assessment. Only reply with "yes" or "no".

            Input:
            "{user_input}" 

            Is this valid medical input?"""

            response = self.openai_completion_client.chat.completions.create(
                model=self.completion_model,
                messages=[{"role": "user", "content": validation_prompt}],
                temperature=0,
                max_tokens=3,
            )

            if response.choices and "yes" in response.choices[0].message.content.lower():
                return True
            return False
        except Exception as e:
            return False
    
    

    async def get_initial_diagnosis(self, user_input: str, top_k: int = 20) -> Optional[str]:
            if not user_input:
                return None
            
            is_valid = await self.is_valid_medical_input(user_input)
            
            if not is_valid:
                return {
                    "result_text": "Input appears unrelated or not medically meaningful. Please describe your symptoms or condition in more detail.",
                    "context_texts": []
                }

            query_vector = self.embedding_service.get_embedding(user_input)

            if not query_vector:
                return None

            similar_points = self.qdrant_service.find_similar_points(query_vector, limit=top_k)
            if similar_points is None:
                return None

            context_texts = []
            if similar_points:
                for point in similar_points:
                    payload = getattr(point, 'payload', None)
                    if payload and isinstance(payload.get("source_text"), str):
                        context_texts.append(payload["source_text"])
                        
            context_string = "\n---\n".join(context_texts) if context_texts else "No relevant past cases found."

            system_prompt = """You are an AI assistant providing preliminary health information. DO NOT provide a definitive diagnosis or medical advice. ALWAYS recommend consulting a healthcare professional. Keep responses concise."""
            user_prompt = f"""Provide a cautious initial assessment based on the following, mentioning if similar cases were found.

                User Input:
                "{user_input}"

                Similar Cases Context:
                ---
                {context_string}
                ---

                Initial Assessment (Remember to advise consulting a doctor):
            """

            try:
                response = self.openai_completion_client.chat.completions.create(
                    model=self.completion_model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.5,
                    max_tokens=250,
                )

                if response.choices and response.choices[0].message and response.choices[0].message.content:
                    result_text = response.choices[0].message.content.strip()
                    return {
                        "result_text": result_text,
                        "context_texts": context_texts[:5],
                    }
                else:
                    return None
            except Exception as e:
                print('error of the shit', e)
                return None
