export default () => ({
    port: parseInt(process.env.PORT, 10) || 3001,
    database: {
      uri: process.env.MONGODB_URI,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-ada-002',
      completionModel: process.env.COMPLETION_MODEL || 'gpt-3.5-turbo',
    },
    qdrant: {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY, // Optional
      collectionName: process.env.QDRANT_COLLECTION_NAME || 'heart_disease_cases',
      vectorSize: parseInt(process.env.QDRANT_VECTOR_SIZE, 10) || 1536,
    },
    ml_model: {
      apiUrl: process.env.ML_MODEL_API_URL,
    },
    // Add other configurations as needed
  });
  
  