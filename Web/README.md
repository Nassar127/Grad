# 🧠 MediLearn – Interactive Medical Education Platform

**MediLearn** is a modern, responsive web platform that provides immersive medical learning through **interactive 3D anatomical models** and an **AI-powered medical chatbot**.

🚀 **Live Demo:** [https://gradv2.vercel.app/](https://gradv2.vercel.app/)

---

## ✨ Features

- 🧠 **3D Brain Model**  
  Interactive Unity WebGL viewer for exploring the human brain's anatomy.

- ❤️ **3D Heart Model**  
  Interactive Unity WebGL viewer for exploring the human heart's anatomy.

- 🤖 **AI Chatbot**  
  AI assistant for answering medical questions. (Currently uses placeholder logic with stubs for LLM API.)

- 💡 **Evidence-Based Content**  
  Based on trusted medical sources and literature.

- 📱 **Responsive Design**  
  Fully mobile-friendly with dynamic 3D content optimized for desktop and mobile.

---

## 📦 Installation

```bash
git clone https://github.com/Mohanned-Mahmoud/gradv2.git
cd gradv2
npm install
```

---

## 🧪 Development

Start the local development server:

```bash
npm run dev
```

This runs the Vite development server at [http://localhost:5173](http://localhost:5173) with hot-reload enabled.

---

## 🏗️ Build

To build for production:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

---

## 📚 Usage

- **Navigation:** Use the top navbar to access `Home`, `Features`, `Products`, and `Contact`.
- **3D Brain:** Found in the **Features** page, loads via Unity WebGL iframe.
- **3D Heart:** Found in the **Features** page, loads via Unity WebGL iframe.
- **Chatbot:** Scroll to the bottom of the **Features** page. Type a medical question. Currently uses keyword-stub logic (to be replaced with a real API call).
- **Contact Form:** Submits messages via Formspree.

---

## ⚙️ Technologies Used

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **3D Rendering:**
  - Heart: Unity WebGL build embedded via iframe
  - Brain: Unity WebGL build embedded via iframe
- **AI Chatbot:** Placeholder code, ready for LLM API integration
- **Forms:** Formspree
- **Icons:** Lucide React
- **Linting & Format:** ESLint, Prettier, PostCSS

---

## 🗂️ Project Structure

```
gradv2/
├── public/               # Static files (Unity WebGL brain)
│   └── unity-wrapper.html
├── src/
│   ├── main.tsx          # App entry
│   ├── App.tsx           # Router + Layout
│   ├── index.css         # Tailwind base
│   ├── pages/            # Home, Features, Products, Contact
│   ├── features/         # BrainModel, HeartModel, AiChatbot
│   └── components/       
│       ├── layout/       # Navbar, Footer
│       └── ui/           # Cards, Buttons, etc.
└── package.json
```

---

## ☁️ Deployment (Vercel)

The site is deployed to [Vercel](https://vercel.com/):

1. Link the GitHub repo to Vercel.
2. Set:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/`
3. Configure environment variables (e.g., LLM API keys) in Vercel settings if needed.
4. Vercel auto-builds and deploys on every push to the `main` branch.

---

## 🔌 AI Chatbot API Integration

The `AiChatbot.tsx` file contains:

```ts
// This would be replaced with your actual AI API call
let response = '';
```

To integrate:
- Replace with `fetch()` or `axios` call to your server or OpenAI endpoint.
- Handle authentication, error catching, and response rendering.
- Never expose API keys in frontend code.

Example:

```ts
const res = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message }),
});
const data = await res.json();
setMessages([...messages, { sender: 'ai', text: data.response }]);
```

---

## 🤝 Contributing

Contributions are welcome!

1. **Fork** the repo
2. **Create a branch**: `git checkout -b feature-name`
3. **Make changes** with ESLint and Prettier formatting
4. **Commit**: `git commit -m 'Add new feature'`
5. **Push**: `git push origin feature-name`
6. **Open a Pull Request**

---

## 📫 Contact

For support or inquiries, use the Contact form on the website or open an issue.

---

© 2025 [MediLearn](https://gradv2.vercel.app/) — All rights reserved.
