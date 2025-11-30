# Propel PRD

**Propel PRD** is an intelligent, AI-powered workspace designed to help Product Managers generate, refine, and manage Product Requirements Documents (PRDs) with speed and precision.

Built with **React 19**, **Tailwind CSS**, and powered by **Google's Gemini** model, it streamlines the product definition process from initial concept to stakeholder approval.

## 🚀 Key Features

### 🧠 AI-Powered Generation
- **Context-Aware Content**: Generates specific PRD sections (User Stories, Risks, Success Metrics) based on product name and description.
- **Smart Refinement**: "Refine" tool allows users to highlight text and ask the AI to rewrite, shorten, or expand specific areas.
- **Auto-Summarization**: Instantly generates executive summaries and product descriptions.

### ✍️ Rich Editing Experience
- **Markdown Support**: Full rendering of markdown content.
- **Focus Mode**: Distraction-free writing experience for specific sections.
- **Structure Customization**: Toggle sections on/off based on project needs (e.g., enable "Technical Requirements" only when needed).

### 🤝 Collaboration & Approval
- **Public View**: Shareable read-only links for stakeholders.
- **Approval Workflow**: Integrated flow for stakeholders to "Approve" or "Request Changes" (simulated webhook integration).
- **Engagement**: Commenting system and upvoting mechanism for feedback collection.

### 🛠️ Architecture & Utilities
- **Dark Mode**: System-aware accessible dark theme.
- **Export Options**: Download as PDF (Print), Markdown, JSON, HTML, or Plain Text.
- **Resilient Data Layer**: Robust `dataService` handling persistence via LocalStorage (simulating a backend) with safe fallbacks for restricted environments.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (Utility-first), Lucide React (Icons)
- **AI Model**: Google Gemini 2.5 Flash (`@google/genai` SDK)
- **State Management**: Custom Hooks (`usePRD`) with optimistic UI updates.
- **Persistence**: LocalStorage (Mock Backend Pattern)

## ⚙️ Configuration

To run this application, you need a Google Gemini API Key.

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. The application expects the key to be available via `process.env.API_KEY`.

## 📂 Project Structure

- **`/components`**: Reusable UI components (Buttons, Modals, Inputs).
- **`/components/views`**: Main application states (Config, Edit, Preview).
- **`/services`**:
  - `geminiService.ts`: Direct interaction with Google GenAI SDK.
  - `dataService.ts`: Abstraction layer for CRUD operations (mimics backend calls).
- **`/hooks`**: `usePRD.ts` encapsulates all business logic, routing, and state.
- **`/utils`**: Export helpers and Webhook simulation.

## 🔗 Backend Integration Notes

The application uses a **Service Repository Pattern**.
The `dataService.ts` file acts as the bridge between the UI and the data source. Currently, it uses `localStorage` to simulate a database with artificial network delay to test loading states.

To connect a real backend:
1. Replace `localStorage` calls in `services/dataService.ts` with real `fetch()` calls to your API.
2. The UI components (e.g., `PublicView`, `ApprovalControl`) are already typed and prepared to handle async Promises.

## 📄 License

MIT
