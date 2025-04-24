# HackAuction Interview Platform

This is an AI-powered platform designed to help users practice for technical interviews. Users can engage in mock interviews with an AI agent, receive feedback, and track their progress.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Authentication & Database:** [Firebase](https://firebase.google.com/) (Firestore, Firebase Auth)
*   **AI Voice Agent:** [Vapi](https://vapi.ai/) (Likely, based on `app/api/vapi`)
*   **AI Text Generation:** Google Gemini (via `@ai-sdk/google`)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)

## Features

*   User Authentication (Sign up, Sign in, Sign out)
*   AI-driven mock interviews
*   Real-time voice interaction with AI agent
*   Generation of interview feedback (scores, strengths, areas for improvement)
*   Viewing past interview history
*   Browsing interviews conducted by others (potentially)

## Prerequisites

*   [Node.js](https://nodejs.org/) (Version specified in `.nvmrc` or >= 18.x recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   Firebase Project: Set up a project on the [Firebase Console](https://console.firebase.google.com/).
    *   Enable Firestore Database.
    *   Enable Firebase Authentication (Email/Password or desired providers).
    *   Obtain Firebase Admin SDK credentials (service account key JSON).
    *   Obtain Firebase Client SDK configuration.
*   Vapi Account: Obtain API keys from [Vapi](https://vapi.ai/).
*   Google AI API Key: Obtain an API key for Gemini models from [Google AI Studio](https://aistudio.google.com/app/apikey) or Google Cloud.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

(Add your license information here, e.g., MIT License)