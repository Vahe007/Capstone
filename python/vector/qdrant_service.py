from qdrant_client import QdrantClient, models
from qdrant_client.http.models import Distance, VectorParams, PointStruct, CollectionInfo, CountResult
from typing import List, Optional, Dict, Any
import vector.config as config

class QdrantService:

    def __init__(self, url: str, api_key: Optional[str], collection_name: str, vector_size: int, distance_metric: Distance):
        if not url:
            raise ValueError("Qdrant URL is required.")
        self.url = url
        self.api_key = api_key
        self.collection_name = collection_name
        self.vector_size = vector_size
        self.distance_metric = distance_metric
        try:
            self.client = QdrantClient(
                url=self.url,
                api_key=self.api_key,
                timeout=60
            )
            self.client.get_collections()
        except Exception as e:
            raise

    def ensure_collection(self):
        try:
            collections_response = self.client.get_collections()
            collection_names = [col.name for col in collections_response.collections]

            if self.collection_name not in collection_names:
                print(f"Collection '{self.collection_name}' not found. Creating...")
                self.client.recreate_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=self.vector_size, distance=self.distance_metric)
                )
                print(f"Collection '{self.collection_name}' created successfully.")
            else:
                print(f"Collection '{self.collection_name}' already exists.")

        except Exception as e:
            print(f"Error ensuring Qdrant collection '{self.collection_name}': {e}")
            raise

    def upsert_points_batch(self, points: List[PointStruct]):
        if not points:
            return

        try:
            response = self.client.upsert(
                collection_name=self.collection_name,
                points=points,
                wait=True 
            )
            if response.status != models.UpdateStatus.COMPLETED:
                 print(f"Warning: Qdrant upsert status was not COMPLETED: {response.status}")

        except Exception as e:
            raise

    def get_collection_info(self) -> Optional[CollectionInfo]:
        try:
            info = self.client.get_collection(collection_name=self.collection_name)
            return info
        except Exception as e:
            print(f"Error getting info for collection '{self.collection_name}': {e}")
            return None

    def count_points(self) -> Optional[CountResult]:
         try:
             count = self.client.count(collection_name=self.collection_name, exact=True)
             return count
         except Exception as e:
             print(f"Error counting points in collection '{self.collection_name}': {e}")
             return None
         
    def find_similar_points(self, query_vector, limit) -> List[PointStruct]:
        points = self.client.search(
            collection_name=config.COLLECTION_NAME,
            query_vector=query_vector,
            limit=limit
        )

        payloads = []
        for point in points:
            payloads.append(point.payload)

        return points

