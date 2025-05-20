import time
import uuid
import pandas as pd
from qdrant_client.http.models import PointStruct

import config
from data_processor import load_and_preprocess_data
from sentence_generator import generate_sentence, create_payload
from embedding_service import EmbeddingService
from qdrant_service import QdrantService

def run_pipeline():
    start_time_total = time.time()

    try:
        qdrant_service = QdrantService(
            url=config.QDRANT_URL,
            api_key=config.QDRANT_API_KEY,
            collection_name=config.COLLECTION_NAME,
            vector_size=config.VECTOR_SIZE,
            distance_metric=config.DISTANCE_METRIC
        )
        embedding_service = EmbeddingService(
            api_key=config.OPENAI_API_KEY,
            model=config.EMBEDDING_MODEL
        )
    except Exception as e:
        print(f"Error is {e}")
        return

    try:
        qdrant_service.ensure_collection()
    except Exception as e:
        print(f"Error is {e}")
        return

    try:
        df = load_and_preprocess_data(
            file_path=config.CSV_FILE_PATH,
            column_names=config.CSV_COLUMN_NAMES,
            has_header=config.HAS_HEADER,
            mappings=config.ALL_MAPPINGS
        )
        if df is None or df.empty:
            return
    except Exception as e:
        return

    points_batch = []
    total_processed = 0
    total_failed_embeddings = 0

    for index, row in df.iterrows():
        sentence = generate_sentence(row)
        if not sentence or sentence.strip() == "":
            continue

        embedding = embedding_service.get_embedding(
            text=sentence,
            max_retries=config.EMBEDDING_MAX_RETRIES,
            delay=config.EMBEDDING_RETRY_DELAY
        )
        if embedding is None:
            total_failed_embeddings += 1
            continue

        payload = create_payload(row, sentence)
        point_id = str(uuid.uuid4())

        point = PointStruct(id=point_id, vector=embedding, payload=payload)
        points_batch.append(point)


        if len(points_batch) >= config.QDRANT_BATCH_SIZE or (index == len(df) - 1):
            if points_batch:
                try:
                    qdrant_service.upsert_points_batch(points_batch)
                    total_processed += len(points_batch)
                except Exception as e:
                    print(f"Error uploading batch to Qdrant (starting index {index - len(points_batch) + 1}): {e}")
                finally:
                     points_batch = []

    print(f"Successfully processed and attempted upload for: {total_processed} points")

    end_time_total = time.time()
    print(f"Total execution time: {end_time_total - start_time_total:.2f} seconds")



if __name__ == "__main__":
    run_pipeline()
