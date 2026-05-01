# Choti Kahaniyan, Badi Soch (Little Stories, Big Dreams) 📖✨

An interactive, AI-powered storytelling platform designed specifically for children, featuring bilingual support (English & Urdu) and engaging interactive elements to foster a love for reading and learning.

## 🌟 Overview

**Choti Kahaniyan, Badi Soch** is a modern web application that brings stories to life. Tailored for children across various age groups, it provides a safe, vibrant, and interactive environment where stories are not just read but experienced through touch and sound.

## 🚀 Key Features

-   **🎯 Age-Appropriate Content**: Carefully curated stories for different stages:
    -   **2-3 Years**: Simple phrases and bold interactions.
    -   **4-5 Years**: Easy sentences with character-driven plots.
    -   **6-8 Years**: Small paragraphs with moral lessons and problem-solving.
-   **🌍 Bilingual Support (English & Urdu)**: Full localization including standard Urdu typography (Noto Nastaliq Urdu) and Right-to-Left (RTL) layout.
-   **🗣️ Read Aloud (TTS)**: Integrated Text-to-Speech functionality for both languages to help with pronunciation and accessibility.
-   **🎨 Immersive Themes**: Choose between 'Magical Forest', 'Deep Blue Sea', and 'Fast Cars' with dynamic background decorations and themed soundscapes.
-   **⚡ Interactive Scenes**: Stories feature interaction targets (tap, multi-tap) that advance the narrative, keeping children engaged.
-   **🏆 Gamified Progress**: Earn XP, level up, and unlock special badges as you read more stories.
-   **🤖 AI-Powered Adventures**: Utilizes Google Gemini API to generate new, context-aware stories based on chosen themes and age levels.

## 🛠️ Tech Stack

-   **Frontend**: React 18, TypeScript, Vite
-   **Styling**: Tailwind CSS
-   **Animations**: Framer Motion
-   **AI Integration**: Google Generative AI (Gemini SDK)
-   **Iconography**: Lucide React
-   **Fonts**: Google Fonts (Quicksand, Bubblegum Sans, Noto Nastaliq Urdu, Noto Color Emoji)

## 📦 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/choti-kahaniyan.git
    cd choti-kahaniyan
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the root directory and add your Gemini API Key:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 📂 Folder Structure

-   `src/components`: Reusable UI components (Dashboard, StoryCard, etc.)
-   `src/services`: Core logic for AI generation and sound management.
-   `src/stories`: Pre-defined Markdown-based story templates.
-   `src/types.ts`: Centralized TypeScript interfaces.
-   `src/index.css`: Global styles and Tailwind configuration.

## 🤝 Contributing

Contributions are welcome! If you have ideas for new themes, story structures, or technical improvements:
1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ to inspire the next generation of storytellers.*
