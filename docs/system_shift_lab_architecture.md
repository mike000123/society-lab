# System Shift Lab — Production Architecture Blueprint

## 1. Product Identity

**Working title:** System Shift Lab  
**Original concept:** “Let’s Change the World”  
**Core idea:** An online civic intelligence platform where users explore the bugs of modern economic, political, urban, informational and social systems, test alternative futures through simulations, and participate in structured dialogue and collective governance experiments.

The platform should avoid becoming a simple political forum. Its identity should be closer to:

> A public laboratory for systemic thinking, future society design, simulation, structured disagreement and collective action.

---

## 2. Product Pillars

### 2.1 Learn
Users understand systemic problems through articles, diagrams, explainers and interactive lessons.

### 2.2 Simulate
Users change parameters and watch social, economic, ecological and political indicators respond.

### 2.3 Discuss
Users debate through structured dialogue, not chaotic comment threads.

### 2.4 Govern
Users can vote, rank proposals, join assemblies and evolve ideas into real-world civic actions.

### 2.5 Act
Later phase: local groups, petitions, reports, policy proposals and educational workshops.

---

## 3. Recommended Technology Stack

## Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Recharts
- Mapbox or Leaflet

## Backend
- FastAPI or NestJS
- PostgreSQL
- Redis
- Supabase Auth
- WebSockets / Realtime

## AI / Simulation
- Python workers
- pgvector
- OpenAI-compatible API
- Mesa agent simulations

---

## 4. Main Features

- Structured discussion system
- AI debate agents
- Policy simulation sandbox
- Civilization simulator
- Reputation/trust system
- Governance voting system
- Interactive world map
- Live collaborative discussions
- Moderation AI
- Mobile-first UI
- Bloomberg-style futuristic dark interface

---

## 5. AI Debate Agents

Suggested agents:
- Systems Analyst
- Economist
- Political Realist
- Ethics Advocate
- Environmental Analyst
- Skeptic / Red Team
- Historian
- Moderator

Purpose:
- stress test ideas
- expose assumptions
- improve debate quality
- generate better questions

---

## 6. Simulation Engine

### Version 1
Simple weighted score model.

### Version 2
System dynamics model.

### Version 3
Agent-based simulation:
- households
- firms
- government
- media
- banks
- civic groups

### Version 4
Civilization simulator mode.

---

## 7. Database Core Tables

- users
- user_reputation
- topics
- threads
- posts
- proposals
- votes
- simulations
- live_rooms
- moderation_events
- ai_agent_runs

Recommended database:
- PostgreSQL via Supabase

---

## 8. Deployment

### MVP
- Frontend: Vercel
- Database/Auth: Supabase

### Full Production
- Frontend: Vercel
- Backend: Render
- Workers: Render background workers
- Redis: Upstash
- Storage: S3/Supabase Storage

---

## 9. MVP Build Order

1. Next.js frontend
2. Supabase auth/database
3. Structured discussions
4. Basic policy simulator
5. AI summarizer
6. Reputation system
7. Governance voting
8. Civilization simulator

---

## 10. Key Product Philosophy

Every feature should answer:

1. Does this help people understand systems better?
2. Does this help people disagree more intelligently?
3. Does this help test alternatives before promoting them?
4. Does this convert discussion into responsible action?
