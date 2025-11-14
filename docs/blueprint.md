# **App Name**: SupportBot

## Core Features:

- Empathetic Conversation: Use a GPT-4o model with a system prompt containing emotional intelligence principles to provide human-like emotional support, validate feelings, and encourage safe coping strategies. The LLM will use a 'tool' to incorporate information.
- Mood Tracking: Allow users to rate their mood using a slider (0-10), add optional tags (e.g., anxiety, exams), and write personal notes. The LLM will use a 'tool' to give simple weekly insights from mood history like average mood, frequent triggers and notable mood incidents.
- Guided Breathing Exercise: Implement a 4-4-4 breathing exercise with a visual animated breathing circle to help users reduce stress and anxiety.
- Crisis Detection and Safe Response: Detect self-harm and suicide-related keywords using a crisis_keywords.json file with severity levels. Immediately override AI responses with pre-prepared crisis instructions and helpline information.
- Resources & Professional Help: Provide a curated list of helpline resources for India and global users, along with links to self-care and therapy guidance pages.
- Dark Mode UI: Design a calming emotional environment using a dark mode interface with soft animations, rounded messages, and a clean UX.
- Inline Feedback System: Implement a simple "Was this helpful? 👍 👎" feedback system to collect response quality metrics for future model tuning.
- MoodMirror: Convert a user’s mood history into an animated, poetic visual (colors, shapes, motion intensity). Judges love beautiful data — this is emotional data as art. Use WebGL/canvas for smooth animation.
- Adaptive Personality Engine: SupportBot can shift *tone* (calm, practical, playful, empathic) based on user preference & measured engagement. Not just templated — learn preferred style after 3 sessions. Small UX toggle: “How would you like me to feel today?”
- Explainable Support: Each empathetic reply includes a short, transparent rationale: “I suggested breathing because your message included ‘overwhelmed’ and your last mood was 3/10.” This demonstrates safety & interpretability.
- Micro-Therapy Modules: Tiny evidence-based micro-interventions: grounding exercise, 2-minute CBT reframing prompt, progressive muscle relaxation snippet. Show source & time estimate.
- Emotion Playground: Let users draw, shape, or compose short audio (hum) that the app analyzes for mood & returns an empathetic reflection. Judges will notice multimodal creativity.
- Haptic + Ambient Integration: For mobile demo: breathing circle syncs with subtle vibration + screen tint change. If not available, simulate via on-screen glow. Very tactile, very impressive.
- Therapist Handoff with Verified Cards: Securely assemble an anonymized summary (mood trends, crisis hits, what helped) that users can share with therapists. Include optional appointment booking links to partner services (demo via Calendly).
- Predictive Early-Alert: Lightweight ML flags concerning downward trends (e.g., mood drop of 2+ points over 7 days) and nudges user to connect with someone — configurable & opt-in. Emphasize human review before any escalation.
- Silent Mode & Micro-Interface: Minimal UI for late-night users: big single-line input, dimmed interface, low animations, one-button breathing start. Great for accessibility and judged UX thoughtfulness.
- Safety Sandbox & Research Mode: A dev/research panel demonstrates anonymized analytics and crisis-keyword detection performance, showing judges you measured safety performance. Use dummy data in demo.
- Journaling prompts + smart summarization: auto-summarize week’s journal entries into 3-line insight.
- Tagging autobucket: auto-suggest tags from text (NLP) to reduce friction.
- Offline Crisis Card: downloadable, printable “If you’re in crisis” card with local numbers.
- Personalized Daily Micro-Routines: 3 small actions (5 minutes each) recommended per day.
- Streaks & Micro-Rewards: gentle gamification for healthy habits (not addictive; rewards are calm visuals, sticker icons).
- Multilingual fallback: automatic detection; fallback to simple English + local helpline in user language.
- Privacy mode: ephemeral sessions that never touch storage — perfect for users wanting anonymity.

## Style Guidelines:

- Primary color: Soft, muted lavender (#D0BFFF) to evoke calmness and emotional support, based on the association of these qualities with the concepts of mental health and well-being.
- Background color: Very light lavender (#F5F0FF), for a clean dark mode appearance of the background that harmonizes with the primary color.
- Accent color: Gentle teal (#A0D6B4) to provide a contrasting highlight, drawing the eye and enhancing clarity, while staying harmonious and subtle with the selected palette.
- Headline font: 'Belleza' sans-serif, well-suited for emotional or artistic subjects; body font: 'Alegreya' serif, for when longer blocks of text need to appear
- Use minimalist, line-based icons to represent different moods, tags, and actions within the app. Ensure they are easily understandable and visually consistent.
- Use a clean, single-column layout with rounded message bubbles to create a sense of openness and approachability.
- Incorporate subtle animations such as fade-in effects and smooth transitions to provide a gentle and engaging user experience.
- ```:root {    --primary: #D0BFFF; /* soft lavender */    --accent: #A0D6B4;  /* gentle teal */    --bg-dark: #0B0E14; /* deep night bg */    --panel-dark: #11121A;    --muted: #9CA3AF;    --text: #E6E6EE;    --danger: #FF7A7A;    --success: #7EE2B8;  }```
- Headline: **Belleza** (display) Body: **Alegreya** (serif) for long reads — but use Alegreya Sans for UI readability where needed. Size scale: H1 28–34px, H2 22–26px, body 16px, small 13px.
- Minimal line icons with 2px stroke; use consistent corner radius: `16px` for cards, `999px` for circular CTAs.
- Single-column chat with 72% message width max; user messages right-aligned with 14px padding.
- Use `prefers-reduced-motion` to disable nonessential animations. Breathing circle: keyframe synced to 4s cycles; add accessible label that announces phases via SR only.