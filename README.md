# 🔬 SciSim

**SciSim** is an interactive, web-based scientific simulation platform that brings laboratory experiments to life. Built with modern web technologies, it features immersive 3D and 2D simulations for Biology, Chemistry, and Physics, integrated with a powerful AI partner to guide students through their scientific journey.

## 🌟 Features

*   **🧪 Interactive Laboratories:**
    *   **BioLab:** Explore microscopic organisms and biological structures.
    *   **ChemLab:** Mix elements, observe reactions, and learn chemical properties on an interactive canvas.
    *   **PhysicsLab:** Run physical simulations with customizable parameters and real-time control panels.
*   **🤖 AI Partner Integration:** Powered by Google's GenAI (`@google/genai`), offering real-time assistance, explanations, and dynamic guidance during experiments.
*   **📈 Data Visualization:** Live charting and tracking of experimental data using `recharts`.
*   **🎨 Stunning UI & Animations:** Fluid interface transitions and animations driven by `framer-motion` and styled with `Tailwind CSS`.
*   **🌐 3D & 2D Graphics:** High-performance rendering using `three.js` (via `@react-three/fiber` & `@react-three/drei`) and `p5.js`.

## 🛠️ Tech Stack

*   **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **3D Rendering:** [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
*   **2D Rendering:** [p5.js](https://p5js.org/)
*   **Charting:** [Recharts](https://recharts.org/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **AI Integration:** `@google/genai`

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js and npm (or yarn/pnpm) installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/MohdAltamish/SciSim.git
    cd SciSim
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    *   Copy the example environment file: `cp .env.example .env`
    *   Add your API keys to `.env` (e.g., your Gemini API key for the AI partner functionality).

4.  Start the development server:
    ```bash
    npm run dev
    ```

5.  Open your browser and navigate to `http://localhost:5173`.

## 📁 Project Structure

```
src/
├── assets/         # Static assets (images, global icons)
├── components/     # Reusable UI components (Navbar, Footer, AIPartnerBar, LabCard)
├── context/        # React Context providers (LabContext)
├── labs/           # Individual lab modules
│   ├── BioLab/     # Biology simulations
│   ├── ChemLab/    # Chemistry experiments
│   └── PhysicsLab/ # Physics mechanics and kinematics
├── pages/          # Application routes (Home, About, LabPage)
├── services/       # External API integrations (e.g., AI services)
├── App.jsx         # Main application component & routing setup
├── main.jsx        # Application entry point
└── index.css       # Global styles and Tailwind directives
```

## 📜 Scripts

*   `npm run dev` - Starts the Vite development server.
*   `npm run build` - Bundles the app into static files for production.
*   `npm run lint` - Runs ESLint to check for code quality and style issues.
*   `npm run preview` - Previews the production build locally.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/MohdAltamish/SciSim/issues).

## 📝 License

This project is licensed under the MIT License.
