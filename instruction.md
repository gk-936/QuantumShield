# 🛡️ Qubit-Guard Platform Deployment Guide

Follow these steps to deploy and run the **Qubit-Guard PQC Platform** on a new system for the **PNB Hackathon 2026**.

## 1. Prerequisites
- **Python 3.9+**: For the FastAPI backend.
- **Node.js (LTS)**: For the React/Vite frontend.

## 2. Backend Setup
1.  **Extract the ZIP**: Unzip the repository to your target directory.
2.  **Navigate to Backend**: 
    ```powershell
    cd backend
    ```
3.  **Create Virtual Environment**:
    ```powershell
    python -m venv venv
    .\venv\Scripts\activate
    ```
4.  **Install Dependencies**:
    ```powershell
    pip install -r requirements.txt
    ```

## 3. Configuration (Critical Step) 🔑
Create or update the `backend/.env` file with the following credentials to enable reporting and AI remediation:

```env
PORT=5006
GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
SMTP_USER=YOUR_EMAIL_ADDRESS@EMAIL.com
# Use Gmail App Password (16 characters, no spaces)
SMTP_PASS=
```

## 4. Frontend Setup
1.  **Navigate to Frontend**:
    ```powershell
    cd ../frontend
    ```
2.  **Install Packages**:
    ```powershell
    npm install
    ```

## 5. Running the Prototype
Open two terminals to run both services simultaneously:

- **Terminal 1 (Backend)**: 
  ```powershell
  cd backend
  .\venv\Scripts\activate
  python main.py
  ```
  *(Service runs on http://localhost:5006)*

- **Terminal 2 (Frontend)**:
  ```powershell
  cd frontend
  npm run dev
  ```
  *(Dashboard accessible at http://localhost:5173)*

## 6. Default Login Credentials
- **Username**: `admin`
- **Password**: `pnb_password_2026`

---
**Note**: The platform includes an **Auto-Fallback Demo Mode**. If your network blocks SMTP ports 465 or 587 (common in corporate environments), the dashboard will still simulate a successful dispatch to ensure your presentation flow remains uninterrupted.
