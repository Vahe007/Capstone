import time
from openai import OpenAI, RateLimitError, APIError
from typing import List, Optional

class EmbeddingService:
    def __init__(self, api_key: str, model: str):
        if not api_key:
            raise ValueError("OpenAI API key is required.")
        self.model = model
        try:
            self.client = OpenAI(api_key=api_key)
        except Exception as e:
            raise

    def get_embedding(self, text: str, max_retries: int = 3, delay: int = 5) -> Optional[List[float]]:
        if not text:
            return None

        text = text.replace("\n", " ")
        attempt = 0
        while attempt < max_retries:
            try:
                response = self.client.embeddings.create(input=[text], model=self.model)
                if response.data and response.data[0].embedding:
                    return response.data[0].embedding
                else:
                    return None
            except RateLimitError as e:
                attempt += 1
                time.sleep(delay * (attempt))
            except APIError as e:
                 attempt += 1
                 time.sleep(delay)
            except Exception as e:
                attempt += 1
                if attempt < max_retries:
                    time.sleep(delay)
                else:
                    print("Max retries reached. Failed to get embedding.")
                    return None
        print(f"Failed to get embedding for text after {max_retries} retries: '{text[:50]}...'")
        return None

