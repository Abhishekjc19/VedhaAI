# VedaAI - Assessment Creator

## Project Overview
AI-powered Assessment Creator - Full stack application for teachers to create assignments, generate questions using AI, and preview formatted question papers.

## Architecture
- **Monorepo Structure**: apps/backend (Express + TS) and apps/frontend (Next.js + TS)
- **Backend**: Express.js with MongoDB, Redis, BullMQ, WebSocket
- **Frontend**: Next.js with Redux/Zustand, TypeScript, responsive design
- **AI Integration**: LLM-based question generation with structured output

## Stack
- Node.js + Express (TypeScript) - Backend
- Next.js + TypeScript - Frontend
- MongoDB - Data persistence
- Redis - Caching and session management
- BullMQ - Background job processing
- Socket.io - Real-time WebSocket communication
- Anthropic Claude API - AI question generation
