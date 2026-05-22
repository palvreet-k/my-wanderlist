# my-wanderlist

Full-stack application with a React frontend and Express backend.

---

## 📁 Project Structure

```bash
my-wanderlist/
├── backend/                 # Express REST API
├── frontend/                # React or React Native app
└── docs/                    # Proposal and architecture diagrams
```

---

## 🚀 Running the Backend

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file inside the `backend` folder

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start the backend server

```bash
npm run dev
```

---

## 💻 Running the Frontend

### 1. Navigate to the frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the frontend app

#### React Web

```bash
npm run dev
```

#### React Native (Expo)

```bash
npx expo start
```
