# IntelliDesk AI

<div align="center">

![IntelliDesk AI](https://img.shields.io/badge/IntelliDesk-AI%20Powered-6366f1?style=for-the-badge&logo=openai&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

**AI-powered customer support ticketing system that supercharges your support team with intelligent automation.**

[Getting Started](#-getting-started) • [Features](#-features) • [Tech Stack](#-tech-stack) • [API Reference](#-api-reference)

</div>

---

## ✨ Features

- **🤖 AI-Powered Response Drafts** - Generate intelligent response suggestions in milliseconds based on your knowledge base and ticket context
- **📊 Sentiment Analysis** - Real-time emotional tracking helps agents prioritize urgent and sensitive customer issues
- **🔍 Smart FAQ Matching** - Vector-based semantic search finds the best matching FAQ articles using cosine similarity
- **🎯 Ticket Classification** - Automatic categorization and severity assessment for incoming tickets
- **🔄 Deduplication** - Intelligent detection of duplicate tickets to streamline support workflow
- **🌗 Dark/Light Mode** - Beautiful, modern UI with theme switching support
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.4 | React framework with App Router |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| TailwindCSS | 4.x | Styling |
| Lucide React | 0.563 | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Express.js | 4.18.2 | API server |
| MongoDB | 8.x | Database |
| Mongoose | 8.0.0 | ODM |
| OpenAI | 6.16.0 | AI/LLM integration |
| Winston | 3.11.0 | Logging |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **MongoDB** running locally or a MongoDB Atlas connection
- **OpenAI API Key** for AI features

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/IntelliDesk-AI.git
   cd IntelliDesk-AI
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   ```

   Configure your `.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/intellidesk
   OPENAI_API_KEY=your_openai_api_key_here
   JWT_SECRET=your_jwt_secret_here
   ```

3. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Create environment file
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
   ```

4. **Seed the Database (Optional)**
   ```bash
   cd ../backend
   node seed_faq.js
   ```

### Running the Application

**Start the Backend:**
```bash
cd backend
npm run dev
```
The API server will run on `http://localhost:5000`

**Start the Frontend:**
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:3000`

---

## 📁 Project Structure

```
IntelliDesk-AI/
├── frontend/                 # Next.js frontend application
│   ├── app/                  # App router pages
│   ├── components/           # React components
│   │   ├── AiReasoning.tsx   # AI response reasoning display
│   │   ├── TicketList.tsx    # Ticket listing component
│   │   ├── TicketDetail.tsx  # Individual ticket view
│   │   ├── ThreadView.tsx    # Conversation thread
│   │   └── ResponsePreview.tsx
│   ├── context/              # React context providers
│   ├── lib/                  # Utilities and API client
│   └── public/               # Static assets
│
├── backend/                  # Express.js backend API
│   ├── config/               # Database configuration
│   ├── controller/           # Route controllers
│   ├── middleware/           # Express middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   │   ├── classifier.service.js
│   │   ├── deduplication.service.js
│   │   ├── faq.service.js    # Vector search for FAQs
│   │   └── llm.service.js
│   ├── utils/                # Helper utilities
│   └── server.js             # Application entry point
│
└── README.md
```

---

## 📡 API Reference

### Health Check
```http
GET /api/health
```
Returns server status and timestamp.

### Tickets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | Get all tickets |
| POST | `/api/tickets` | Create a new ticket |
| GET | `/api/tickets/:id` | Get ticket by ID |
| PUT | `/api/tickets/:id` | Update ticket |
| DELETE | `/api/tickets/:id` | Delete ticket |

---

## 🔧 Configuration

### Environment Variables

#### Backend (`.env`)
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | No |

#### Frontend (`.env.local`)
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by the IntelliDesk Team**

</div>
