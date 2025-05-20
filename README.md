# Health Monitoring & Prediction System (Capstone Project)

This project is a full-stack application designed to provide users with insights into their health through AI-powered initial diagnosis and custom machine learning model predictions based on their medical data.

## Project Overview

The system allows users to:
1.  Receive an AI-driven initial diagnostic assessment by describing their symptoms in natural language. This utilizes OpenAI for text embedding and completion, and Qdrant as a vector database for contextual similarity search.
2.  Get predictions about heart disease risk by providing structured medical data (e.g., via form input or Excel file upload). This uses custom-trained machine learning models (Decision Tree, Logistic Regression, XGBoost, KNN).
3.  Register and log in securely to access these features.

## Architecture

The system is composed of three main services:

1.  **Frontend (UI):** A Next.js application providing the user interface for data input and displaying results.
    * Located in the `/UI` directory.
    * See `/UI/README.md` for specific setup and running instructions.
2.  **Backend API (NestJS):** A NestJS application serving as the main API gateway. It handles user authentication, orchestrates calls to the Python services, and manages data persistence in MongoDB.
    * Located in the `/nest-js` directory.
    * See `/nest-js/README.md` for specific setup and running instructions.
3.  **Python Services (FastAPI):** Two separate FastAPI applications:
    * **Initial Diagnosis API:** Handles the OpenAI embedding, Qdrant search, and OpenAI completion logic.
    * **ML Model Prediction API:** Serves the custom-trained machine learning models (Decision Tree, Logistic Regression, etc.) for heart disease prediction.
    * Located in the `/python-api` directory (or separate subdirectories within it if you structured it that way).
    * See `/python-api/README.md` (or relevant sub-READMEs) for specific setup and running instructions.

**Databases Used:**
* **MongoDB:** Stores user accounts, registration/verification data, and diagnosis request history.
* **Qdrant:** Stores vector embeddings of medical case descriptions for the initial AI diagnosis feature.

**(Optional: Add a simple architecture diagram here if you have one, or a link to it)**
[Link to High-Level Architecture Diagram if available]
## Core Technologies

* **Frontend:** Next.js, React, TypeScript
* **Backend API:** NestJS, TypeScript, Node.js
* **Python Services:** FastAPI, Python
* **Machine Learning:** Scikit-learn, Joblib
* **AI & Embeddings:** OpenAI API (Embeddings, Chat Completions - e.g., GPT-4o)
* **Vector Database:** Qdrant
* **Primary Database:** MongoDB (with Mongoose ODM in NestJS)
* **Authentication:** JWT (JSON Web Tokens)
* **Email Verification:** (Mention library used, e.g., Nodemailer, or service)

## Getting Started

To run the entire system locally, you will need to set up and run each service concurrently.

**Prerequisites:**

* Node.js (version X.X.X or higher)
* npm or yarn
* Python (version X.X.X or higher)
* pip (Python package installer)
* MongoDB instance (local or cloud-based like MongoDB Atlas)
* Qdrant instance (local using Docker, or cloud-based)
* OpenAI API Key
* (Any other specific tools, e.g., Docker if used for Qdrant)

**Setup Steps:**

1.  **Clone the Repository:**
    ```bash
    git clone [your-repository-url]
    cd [your-project-root]
    ```

2.  **Setup Frontend (UI):**
    * Navigate to the `/UI` directory.
    * Follow the instructions in `/UI/README.md` (typically involves `npm install` or `yarn install`, setting up `.env` variables, and running `npm run dev` or `yarn dev`).

3.  **Setup Backend API (NestJS):**
    * Navigate to the `/nest-js` directory.
    * Follow the instructions in `/nest-js/README.md` (typically involves `npm install` or `yarn install`, setting up `.env` variables with database connection strings, API keys, JWT secret, etc., and running `npm run start:dev` or `yarn start:dev`).
    * Ensure your MongoDB instance is running and accessible.

4.  **Setup Python Services (FastAPI):**
    * Navigate to the `/python-api` directory (or relevant subdirectories).
    * Follow the instructions in `/python-api/README.md` (typically involves creating a virtual environment, `pip install -r requirements.txt`, setting up `.env` variables with OpenAI API keys, Qdrant URLs, etc., and running each FastAPI app using `uvicorn main:app --reload --port [PORT_NUMBER]`).
    * Ensure your Qdrant instance is running and accessible.
    * Ensure your trained ML models (`.joblib` files) and scaler are in the correct paths as expected by the FastAPI services.

5.  **Environment Variables:**
    * Each service (`UI`, `nest-js`, `python-api/*`) will likely have its own `.env.example` file. Copy these to `.env` in their respective directories and fill in the necessary credentials and configuration values (API keys, database URIs, service URLs, JWT secrets, etc.).
    * **Root `.env` (Optional):** If you have any configuration that is truly global or used by scripts in the root, you can mention it here. Otherwise, direct users to the service-specific `.env` files.

**Running the System:**

Once all services are set up, you will need to start each one in separate terminal windows:
* Frontend (Next.js): Typically on `http://localhost:3000`
* Backend API (NestJS): Typically on `http://localhost:3001` (or as configured)
* Python Initial Diagnosis API (FastAPI): Typically on `http://localhost:8000` (or as configured)
* Python ML Prediction API (FastAPI): Typically on `http://localhost:8001` (or as configured, if separate from the initial diagnosis API)

Ensure the URLs configured in each service's `.env` file correctly point to the other running services.

## Project Structure

.├── UI/                   # Next.js Frontend Application│   ├── ...│   └── README.md├── nest-js/              # NestJS Backend API│   ├── ...│   └── README.md├── python-api/           # Python FastAPI Services│   ├── initial_diagnosis_service/  # Example structure│   │   ├── ...│   │   └── README.md│   ├── ml_prediction_service/      # Example structure│   │   ├── ...│   │   └── README.md│   └── trained_models/     # Directory for saved ML models and scaler│   └── datasets/           # Original datasets used for training├── .env.example          # Optional: Example root env variables if any├── README.md             # This file└── ...                   # Other root level files (e.g., .gitignore, docker-compose.yml if used)
## Key Features Implemented

* User Registration with Email Verification
* Secure User Login with JWT Authentication
* AI-Powered Initial Diagnosis (Text Input -> Qdrant Context -> OpenAI Completion)
* Custom ML Model Predictions for Heart Disease (Structured Input -> FastAPI -> Scikit-learn Model)
    * Supports multiple models (Decision Tree, Logistic Regression, etc.)
    * Returns prediction and model evaluation metrics.

## Future Work / Potential Enhancements

* [List 1-2 key future ideas, e.g., Direct wearable data integration, User dashboard for history]

## Authors

* Vahe Manukyan
* Raffi Minasyan

## Supervisor

* Gagik Khalafyan

---

*This README provides a general overview. For detailed setup and information about each component, please refer to the README.md file within its respective directory.*
