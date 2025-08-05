# Multi-Agent Chatbot

This project is a minimal Next.js 14 application demonstrating a multi-agent chatbot using the [assistant-ui](https://www.npmjs.com/package/assistant-ui) components and the OpenAI Node SDK v5. Agent routing leverages a lightweight LLM call to choose between the empathetic **Listener** and the coaching **Solver**.

## Setup

1. Copy `.env.example` to `.env` and fill in your OpenAI credentials.
2. Install dependencies with `{YOUR_PM} install`.
3. Run the development server with `{YOUR_PM} run dev` and open `http://localhost:3000`.

## Build

- Create a production build with `{YOUR_PM} run build`.
- Start the built app with `{YOUR_PM} start`.

## Test

- Run tests with `{YOUR_PM} test`.

## Deploy

Deploy to your preferred platform (e.g. Vercel, Cloudflare). Ensure the `OPENAI_API_KEY` environment variable is configured in the hosting environment.
