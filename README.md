<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1iwsOeozJdFQMXN27ET14CV6buDY9IdNt

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


In a world saturated with generic to-do lists and passive calendar apps, RankUp: AI Performance Suite emerges not as a mere tool, but as a comprehensive, high-stakes digital environment. It is an opinionated ecosystem meticulously engineered for a specific archetype: the relentless achiever. Its name, "RankUp," is a direct and unapologetic declaration of its core purpose—to facilitate a measurable, systematic ascent in one's chosen domain. This is not for the casual hobbyist; it is a digital dojo for the JEE aspirant battling for a top percentile, the software engineer architecting complex systems, the professional mastering a new skill, and anyone who views their productivity not as a chore, but as a craft.
The application’s soul is encapsulated in its central gamification metaphor: the "Mala 108." Drawing inspiration from Eastern philosophies where 108 is a sacred number representing spiritual completion and the entirety of existence, RankUp transforms the arduous journey of mastery into the tangible act of collecting 108 "beads" of achievement. Each badge, or bead, is a testament to effort, a marker of progress on the path to absolute focus. This isn't just about checking boxes; it's about stringing together a personal mala of discipline, one focused session, one completed task, one conquered day at a time.
The entire user experience is built upon a foundation of deep work and intense focus. The default dark-mode aesthetic is not a stylistic whim; it is a deliberate choice to create a low-distraction "cockpit" environment. The typography, powered by the Inter font family, is clean, professional, and optimized for legibility during long hours of engagement. The language throughout the app—"Daily Ops," "Commit Task," "Begin Flow," "Focus Central"—is militaristic and precise, framing productivity as a series of strategic missions rather than a list of mundane chores.
Underpinning this robust frontend is a simple yet effective architecture built on React and browser localStorage. This offline-first approach ensures that the user's data—their plans, their logs, their hard-won achievements—is private, secure, and always accessible. RankUp is a self-contained universe, a personal performance tracker that empowers the user without tethering them to the cloud.
Finally, the "AI Performance Suite" moniker is earned through the integration of Google's Gemini models. The Creative Studio, powered by the formidable gemini-3-pro-image-preview, and the AI Note Polisher, utilizing the agile gemini-2.5-flash-image, are not gimmicks. They are advanced tools designed to augment the user's cognitive workflow, allowing them to visualize complex ideas, create motivational art, and digitally enhance their physical study materials.
This document will deconstruct the RankUp application layer by layer, exploring its core components, its intricate achievement engine, and the profound philosophy that binds it all together into a singular, powerful experience.
Part I: The Core Pillars of Performance—Anatomy of the RankUp Suite
The RankUp experience is built upon five interconnected modules, each serving a distinct function in the user's productivity lifecycle: Plan, Execute, Reward, Analyze, and Refine. These are represented in the UI as the Planner, Pomodoro Timer, Mala (Badges), Stats, and Settings. The Dashboard acts as the central command hub, integrating information from all other pillars.
1. The Dashboard: Focus Central
The Dashboard is the user’s daily briefing. It’s the first screen they see, designed to answer the most critical question: "What is the mission today?" It is an aggregation of the most vital, time-sensitive information, presented with clarity and purpose.
Header & Streak Counter: The top of the screen immediately grounds the user with the current date and their Consistency Streak. This streak counter is a powerful psychological driver. It’s a visual representation of momentum, a chain of effort the user will be reluctant to break. Clicking this widget is a direct portal to the Mala, creating a tight feedback loop between daily action and long-term reward.
The Hero Quote: Sourced from constants.ts, this isn't a random platitude. It’s a curated piece of motivation aligned with the app's ethos of deep work and earned success. Phrases like "Rank is earned in the silence of deep work" serve as a philosophical anchor for the day's efforts.
Daily Completion & Recent Medals: This section is the core of the dashboard's feedback mechanism.
The Progress Ring: Implemented with a clever SVG circle animation, this donut chart provides an immediate, visual summary of the day's progress. The smooth animation of the strokeDashoffset as tasks are completed offers a satisfying micro-interaction, akin to "closing the ring." It transforms the abstract concept of "completion percentage" into a tangible visual goal.
Recent Medals: Below the progress ring, the dashboard showcases the last three badges unlocked. This serves as instant gratification and a constant reminder that daily efforts are contributing to the larger Mala 108 journey. It makes long-term goals feel immediate and attainable.
Priority Goals: This is the dashboard's actionable core. It lists only the tasks scheduled for the current day, filtering out the noise of future plans. The UI of each task item is a masterclass in information density: a satisfying checkbox, a clear title, the associated category, and a color-coded priority tag derived from the getPriorityColor utility. This allows the user to instantly triage their day and focus on what truly matters. The entire component is a direct line to the Planner, encouraging users to "Edit Plan" if the day's strategy needs adjustment.
2. The Planner: Architecting Success in "Daily Ops"
If the Dashboard is the briefing room, the Planner is the strategy table. This is where the user architects their victory, block by block, day by day. The view is named "Daily Ops," framing planning as a tactical, strategic endeavor.
The "Commit Task" Workflow: The primary action is to "Commit Task," which opens a focused, full-screen modal. This design choice removes all other distractions, allowing the user to concentrate fully on defining their next mission.
Anatomy of a Task: Each task is a structured object with several key properties that give it depth and utility:
Title (Objective): The core deliverable.
Subject (Division): This is arguably the most powerful feature of the planner. The dropdown is dynamically populated from the user's custom list in settings.subjects. This is the mechanism by which RankUp adapts to any user's life. A JEE aspirant will populate it with 'Physics', 'Chemistry', 'Mathematics'. A software engineer will use 'Project Phoenix', 'Code Refactor', 'Team Sync'. A student might have 'Thesis Research' and 'Lab Work'. This customization is what elevates RankUp from a simple planner to a personal operating system.
Priority: The High/Medium/Low tags provide a simple but effective system for visual triage on the main planner grid.
Time & Date: Allows for precise scheduling, transforming a vague to-do list into a concrete action plan.
Filtering and Views: The ability to filter tasks by 'All', 'Today', 'Upcoming', and 'Completed' is essential for managing cognitive load. The user can zoom out to see their long-term plan ('Upcoming') or zoom in to focus only on the immediate battle ('Today').
The Task Card UI: Each task is rendered as a self-contained "card." The design is robust, displaying all necessary information without clutter. The most significant UI element is the main action button. Initially labeled "Rank Up," it transforms into "Achieved" upon completion. This linguistic choice is deliberate and powerful, constantly reinforcing the app's core philosophy of advancement.
3. The Pomodoro Timer: The Deep Focus Core
This is where strategy meets execution. The Pomodoro timer is RankUp's engine room, the tool designed to facilitate the state of "flow" required for deep, meaningful work.
The Pomodoro Methodology: The timer implements the classic Pomodoro technique with modes for 'Work' (Execute), 'Short Break' (Recovery), and 'Long Break' (Deep Rest). The logic of progressing through these cycles (e.g., a long break after four work sessions) provides a structured rhythm to the user's focus, preventing burnout and maximizing cognitive output.
The Visual Interface: The timer's UI is its greatest strength. It is dominated by a large, circular dial that acts as a visual anchor.
The Countdown: The digitally rendered time is large, clear, and unambiguous.
The Progress Ring: Like the dashboard's completion chart, the timer uses an animated SVG circle. As time elapses, the vibrant indigo (for work) or emerald (for breaks) ring visibly drains. This provides a constant, non-intrusive peripheral awareness of the time remaining in a session, allowing the user to stay focused on the task without constantly checking the numbers.
The Controls: The primary button, "Begin Flow," is a call to action. When active, it changes to "Pause Flow." This language choice is crucial; it frames the activity not as "starting a timer" but as "entering a state of flow."
The Logging Engine: The Pomodoro timer is the primary data source for the entire RankUp ecosystem. When a 'Work' session is completed, the handleTimerComplete function is triggered. This function does three critical things:
It logs the session, creating a StudyLog object that records the date, duration (settings.pomodoroWork), and, most importantly, the selectedSubject.
It updates the user's global stats, incrementing the totalStudyMinutes.
It advances the Pomodoro cycle.
This simple act of logging is the linchpin of the entire system. It is the data that feeds the charts in the Stats view and, most critically, drives the logic for unlocking every single Focus, Session, and Mastery badge in the Mala 108 system.
Part II: The Mala 108—A Gamified Path to Nirvana
The Badges screen, or "Mala," is the heart and soul of RankUp's long-term motivational strategy. It transforms the grind of daily work into an epic quest for completion.
The "Mala Bead" Aesthetic: The visual design of the badges is paramount. These are not flat, boring icons. They are designed to feel like precious, collectible artifacts.
Glassmorphism and Gradients: Each unlocked badge employs a sophisticated visual style. It uses a multi-step gradient (from-via-to), a subtle backdrop-blur, and an inner border to create a sense of depth and luminosity. They look like polished, glass-like beads.
Tiered Rarity: The constants.ts file defines six color tiers, from Copper to Radiant. This system provides a clear visual hierarchy of achievement. A user can instantly recognize the significance of a "Radiant" tier badge compared to a "Copper" one, adding a layer of prestige to higher-level accomplishments.
Locked "Void" State: Locked badges are not simply grayed out. They are styled as "void" orbs—dark, mysterious, with an inner shadow and a lock icon. This creates a sense of anticipation and discovery, compelling the user to uncover what lies within.
Micro-interactions: The subtle shine that sweeps across a badge on hover and the gentle "bounce" animation of the checkmark on an unlocked badge add a layer of polish and delight to the experience.
The Achievement Engine Deconstructed: The logic that powers the Mala resides in a master useEffect hook within App.tsx. This hook is a vigilant observer, running every time the user's core data (tasks, logs, streak, etc.) changes. It systematically checks the user's progress against the definitions for all 108 badges stored in BADGE_DEFS.
The Four Pillars of Grind: The majority of the badges are distributed across four tiered categories:
Tasks Completed (Path of Action): Rewarding raw output and diligence.
Focus Hours (Path of Stillness): Rewarding deep work and sustained concentration.
Streaks (Path of Discipline): Rewarding consistency and habit formation.
Sessions Completed (Path of Rhythm): Rewarding the adherence to the structured Pomodoro rhythm.
The Sage Slots (Path of Mastery): This is the pinnacle of the Mala system. There are 12 generic "Sage" slots. The system dynamically checks the user's logs against their custom settings.subjects. When the total focused time for any single category crosses the 6,000-minute (100-hour) threshold, a Sage slot is unlocked. This is a monumental achievement, representing true mastery and dedication to a specific domain. It also brilliantly ensures the badge system remains relevant regardless of how the user customizes their categories.
Special Feats (Path of the Warrior): These 24 badges reward specific, often difficult or unique, behaviors. "Brahma Muhurta" for pre-4 AM sessions, "Iron Focus" for a 12-hour study day, and "4K Visionary" for using the AI studio are designed to push the user beyond their normal routines and explore the full potential of the RankUp suite.
Part III: The AI Performance Suite—Augmenting the Mind
RankUp integrates AI not as a replacement for human effort, but as a powerful tool to augment it. The Creative Studio and AI Editor are designed to enhance the learning and productivity process.
1. The Creative Studio
Powered by gemini-3-pro-image-preview, this is the user's personal visualization engine. Its purpose is to help translate abstract concepts into concrete images. A physics student could generate an image of "Maxwell's equations visualized as flowing cosmic energy," or a programmer could create a mascot for their new project. The inclusion of 1K, 2K, and 4K resolution options signals a commitment to quality, positioning this as a professional-grade tool. The integration with googleSearch grounding means the AI's creations can be more accurate and contextually aware. Unlocking the "4K Visionary" badge provides a direct incentive to use this powerful feature to its fullest.
2. The AI Note Polisher
This feature, found under the Image Generator tab in the code as AIEditor.tsx, leverages the gemini-2.5-flash-image model for a highly practical purpose. It allows users to take a photograph of their handwritten notes and use AI to clean them up. Prompts like "enhance contrast," "remove the shadow," or "make the background look like clean white paper" can transform messy physical notes into legible, archivable digital assets. This creates a seamless bridge between the analog and digital worlds of study and work.
Part IV: Feedback and Refinement—The Path to Self-Improvement
A core tenet of performance is the feedback loop. RankUp provides this through its Stats and Settings screens.
1. The Rank Screen (Stats)
This is the user's personal analytics dashboard. It provides objective data on their performance, allowing for informed adjustments to their strategy.
High-Level KPIs: The four cards at the top (Total Hours, Tasks Done, Completion %, Session Count) give a quick, quantitative summary of the user's lifetime effort within the app.
Weekly Performance Chart: The bar chart, powered by Recharts, visualizes the user's focus hours over the last seven days. It’s a powerful tool for identifying patterns. Is focus dipping on weekends? Is Wednesday consistently the most productive day? This chart provides the data to answer these questions.
Subject Distribution Pie Chart: This is perhaps the most strategically important visualization. It shows exactly how the user is allocating their most valuable resource: time. It can reveal an imbalance in study subjects for a JEE aspirant or show a professional that they are spending too much time on administrative tasks versus deep work. It is a mirror reflecting the user's actual priorities back at them.
2. The Settings Screen
This is the control panel where the user fine-tunes the RankUp engine to their specific needs.
Categories & Subjects Manager: This is the heart of the app's adaptability. The simple interface for adding and removing subjects is what allows RankUp to be a perfect tool for virtually any goal-oriented individual.
Deep Focus Logic: The ability to customize the duration of work and break periods allows users to tailor the Pomodoro timer to their own unique cognitive rhythm. A beginner might stick to the classic 25/5, while an experienced deep worker might configure 50/10 cycles.
Hard Reset: The "Nuke Data" button is a testament to the app's philosophy of user ownership. It provides a powerful, irreversible way to wipe the slate clean and begin the journey anew.
Conclusion: RankUp as a Way of Life
RankUp: AI Performance Suite transcends the definition of a simple application. It is a meticulously crafted philosophy of performance, encoded in React. It presents a clear, demanding, and rewarding path to mastery through its core loop:
Plan: Architect your success with strategic intent in the Planner.
Execute: Convert plans into tangible progress through disciplined, rhythmic work in the Pomodoro timer.
Get Rewarded: See your efforts crystallize into beautiful, meaningful achievements in the Mala 108.
Analyze: Gain objective, data-driven insights into your performance patterns in the Stats view.
Refine: Tune your personal operating system for even greater efficiency in the Settings.
The app does not promise an easy path. The 108 beads of the Mala are a formidable mountain to climb, with milestones requiring thousands of hours of focus and thousands of completed tasks. But in doing so, RankUp respects its user. It assumes they are ambitious, disciplined, and capable. It provides them with an elite set of tools, a clear system for progress, and a beautiful, immersive environment in which to forge their own success. It is more than an app; it is a digital companion for the most arduous and rewarding journey of all: the journey to one's full potentia
