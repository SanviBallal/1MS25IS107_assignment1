# ScholarArchitect — CS Paper & Architecture Agent

> An advanced Computer Science research agent that parses academic papers, extracts interactive system architecture flowcharts, and generates tangible student resume project extensions.

---

## 📌 Overview

**ScholarArchitect** bridges the gap between theoretical computer science research and hands-on software/systems engineering. Given an arXiv link, paper title, or paper excerpt, the agent extracts the foundational systems architecture into an interactive **Mermaid.js flowchart**, distills the methodology in under 300 words, tracks token efficiency against a **25,000-token operational budget**, and formulates actionable, resume-worthy project extensions tailored for undergraduate CS students and aspiring ML/systems researchers.

---

## ✨ Key Features

### 1. 📄 arXiv & Paper Ingestion
- Automatically extracts arXiv identifiers from URLs (e.g. `https://arxiv.org/abs/1706.03762`) or paper queries.
- Interfaces directly with the official arXiv Export API to fetch title, authors, publication date, and abstract metadata.
- Accepts raw text excerpts, abstract copy-pastes, or query topics.

### 2. ⚡ Core Concept Extraction (<300 Words)
- Condenses dense papers into plain, rigorous, jargon-free explanations.
- Explicitly isolates:
  - **Problem Statement**: What computational bottleneck or theoretical limitation does this paper address?
  - **Primary Methodology**: What novel architectural inductive bias or algorithm was introduced?
  - **Key Algorithmic Breakthroughs**: Empirical and theoretical gains (throughput, VRAM reduction, FLOP efficiency).
- Real-time word counter ensuring strict compliance with the `<300 words` constraint.

### 3. 🗺️ Interactive Architectural Flowchart (Mermaid.js)
- Renders full data-flow pipelines: inputs, embeddings, attention/SSM mechanisms, residual connections, and output heads.
- Pan & zoom controls with SVG/PNG download and raw Mermaid code copy.
- Syntax-safe generation with fallback architectural synthesis for zero downtime.

### 4. 🎓 3rd-Year CS Student Opportunity Engine
- Formulates 3 concrete, realistic extension and optimization projects for an undergraduate CS resume:
  - **The Exact Extension** (e.g., replacing quadratic attention with linear state-space Mamba blocks or low-bit quantization).
  - **Targeted Performance Metric** (e.g., *40% latency reduction on edge hardware with <1.5% accuracy loss*).
  - **Recommended Tech Stack** (e.g., PyTorch, ONNX Runtime, TensorRT-LLM, HuggingFace).
  - **Resume STAR Bullet Point** ready for internship applications.
  - **4-Week Milestone Roadmap** detailing weekly technical deliverables.

### 5. 🛠️ One-Click GitHub Project Scaffolding
- Generates a complete starter repository structure for any selected student opportunity:
  - Model definitions (`model.py` with modular PyTorch blocks and tensor annotations).
  - Profiling & benchmarking harness (`benchmark.py` measuring latency, throughput, and memory).
  - Dependency specifications (`requirements.txt`).
  - STAR resume bullets tailored to SWE/ML roles.

### 6. 📊 Token Budget Meter
- Visual meter monitoring prompt tokens, candidate tokens, and total usage against the strict **25,000 token limit**.
- Real-time budget percentage indicators verifying agent efficiency.

### 7. 📚 Curated Seminal Paper Catalog
- Pre-loaded with foundational research milestones:
  - **Attention Is All You Need** (Transformer architecture)
  - **LoRA: Low-Rank Adaptation** (Parameter-efficient fine-tuning)
  - **FlashAttention** (IO-aware exact attention on GPU SRAM/HBM)
  - **Mamba: Linear-Time Sequence Modeling** (Selective state-space models)
  - **The Era of 1-bit LLMs (BitNet b1.58)** (Ternary addition-only matrix layers)
  - **DeepSeek-R1** (Reinforcement learning & emergent reasoning)

### 8. 💾 Markdown Report Export & History
- One-click export to comprehensive Markdown (`.md`) reports.
- Local browser caching drawer for quick recall of analyzed architectures.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion |
| **Diagrams** | Mermaid.js with custom dark-mode SVG styling |
| **Backend** | Node.js 22, Express 4, `tsx` TypeScript runner |
| **Vite Integration** | Vite 8 with embedded middleware mode for unified dev & prod serving |
| **AI / LLM** | `@google/genai` (Google GenAI SDK) server-side execution |
| **APIs** | arXiv Export API, Google Gemini Flash models |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or 22 recommended)
- `npm` (bundled with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SanviBallal/1MS25IS107_assignment1.git
   cd 1MS25IS107_assignment1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   *(Note: The agent includes an automatic architectural synthesis engine as a fallback if no API key is provided, guaranteeing that you can explore the UI and curated papers immediately.)*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Visit [http://localhost:3000](http://localhost:3000)

---

## 📡 API Reference

### `POST /api/analyze-paper`
Analyzes an academic paper and returns core concept extraction, Mermaid flowchart, token statistics, and student opportunities.

- **Request Body:**
  ```json
  {
    "url": "https://arxiv.org/abs/1706.03762",
    "title": "Attention Is All You Need",
    "rawContent": "",
    "studentFocus": "edge-quantization"
  }
  ```

- **Response:**
  ```json
  {
    "success": true,
    "verbatimOutput": "CORE CONCEPT EXTRACTION: ...",
    "structuredData": {
      "paperTitle": "Attention Is All You Need",
      "paperAuthors": ["Ashish Vaswani", "Noam Shazeer", "..."],
      "paperYear": "2017",
      "coreConcept": {
        "problemStatement": "...",
        "primaryMethodology": "...",
        "keyBreakthroughs": "...",
        "fullSummary": "...",
        "wordCount": 182
      },
      "mermaidGraph": "graph TD ...",
      "studentOpportunities": [...]
    },
    "tokenMetrics": {
      "promptTokens": 1200,
      "candidatesTokens": 1100,
      "totalTokens": 2300,
      "maxBudget": 25000,
      "withinBudget": true,
      "percentBudgetUsed": "9.2"
    }
  }
  ```

### `POST /api/generate-project-scaffold`
Generates runnable Python/PyTorch boilerplate and benchmarking code for a student opportunity.

- **Request Body:**
  ```json
  {
    "paperTitle": "Attention Is All You Need",
    "opportunity": {
      "title": "Selective State-Space Layer Substitution",
      "exactExtension": "Replacing multi-head attention with Mamba blocks",
      "targetedPerformanceMetric": "40% latency reduction"
    }
  }
  ```

### `GET /api/curated-papers`
Retrieves pre-curated computer science papers for immediate analysis.

### `GET /api/health`
Checks server status, operational model, and token budget specifications.

---

## 📜 Available Scripts

- `npm run dev`: Starts the unified Express server with Vite middleware on port 3000.
- `npm run build`: Builds the production Vite React frontend bundle into `dist/`.
- `npm run start`: Runs production server using pre-built static client assets.
- `npm run lint`: Performs strict TypeScript static type analysis (`tsc --noEmit`).

---

## 🛡️ License

Apache-2.0
