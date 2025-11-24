# 🌿 PIG - Paint IT Green

![Project Banner](public/og-img.png) 
> **Join students worldwide in learning about nature conservation, competing in environmental challenges, and making a real difference in your community.**

## 📖 About The Project

**Paint IT Green (PIG)** is an educational platform designed to gamify environmental conservation. This project was built to solve the problem of [insert specific problem, e.g., lack of student engagement in nature] by providing an interactive way to participate in eco-challenges.

### Key Features
* **🌍 Eco-Challenges:** Interactive tasks for students to complete.
* **🏆 Global Leaderboards:** Compete with other "Eco-Champions."
* **⚡ Serverless Backend:** Powered by Azure Functions for fast, scalable API responses.
* **🎨 Modern UI:** Built with shadcn/ui and Tailwind CSS for a sleek, responsive experience.

---

## 🛠️ Tech Stack

This project uses a modern **Serverless** architecture hosted on Azure.

| Area | Technology |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite |
| **Styling** | Tailwind CSS|
| **Backend** | Azure Functions (Node.js v4 Model) |
| **Hosting** | Azure Static Web Apps (SWA) |
| **CI/CD** | GitHub Actions |

---

## 🚀 Getting Started (Local Development)

To run this project locally, you need to run both the Frontend (React) and the Backend (Azure Functions).

### Prerequisites
* **Node.js:** Version 20 or higher.
* **Azure Functions Core Tools:** (Optional, but recommended for backend debugging).
* **SWA CLI:** (`npm install -g @azure/static-web-apps-cli`)

### 1. Clone & Install Dependencies

You need to install dependencies for **both** the root (frontend) and the API (backend).

```bash
# 1. Clone the repo
git clone [https://github.com/Valentin-Yordanov/eco-champions-club.git](https://github.com/Valentin-Yordanov/eco-champions-club.git)
cd eco-champions-club

# 2. Install Frontend Dependencies
npm install

# 3. Install Backend Dependencies
cd api
npm install
cd ..
```

### 2. Run app

```bash
##You will need 2 terminals
# Terminal 1. The BackEnd
cd api
npm start

# Terminal 2. FrontEnd (if not in eco-champions-club: cd eco-champions-club)
npm run dev
```
