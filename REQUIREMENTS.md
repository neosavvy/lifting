# One-Shot Prompt: 5x3x1 Weightlifting Planner  

## **Context**  
I need a **mobile-friendly web application** that helps me plan my **5x3x1 weightlifting cycle** every 4 weeks. The application should take a few **key inputs**:  

- **Body Weight**  
- **Years Lifting**  
- **Current 1 Rep Max** for:
  - Squat  
  - Bench Press  
  - Overhead Press  
  - Deadlift  

Additionally, I **optionally** want to set a **goal** to reach **Elite Level Fitness**, which is defined as:  

- **Overhead Press** → 1.0 × Body Weight  
- **Bench Press** → 1.5 × Body Weight  
- **Squat** → 2.0 × Body Weight  
- **Deadlift** → 2.5 × Body Weight  

The application should **generate a structured plan** to reach these strength goals and **predict when I can achieve them safely** based on the inputs.  

---

## **Technical Requirements**  
- **Frontend:** React (with TypeScript)  
- **UI Components:** Tailwind UI  
- **Data Storage:** LocalStorage (to enable full offline functionality)  
- **Mobile Optimization:** Ensure the app is highly **mobile-friendly** with responsive UI/UX  
- **Browser Capabilities:** Leverage **Progressive Web App (PWA) features** where possible to enhance offline usability  

---

## **Visual & Theming Requirements**  
- **Dark Mode + Light Mode toggle**  
- **Color Theme:** Black & Green, inspired by **The Matrix**  
- **Typography & Styling:** 80s Retro style, **Stranger Things** aesthetic  
- **UI Feel:** Cyberpunk meets Retro Arcade  

---

## **Expected Features & UX**  
- **Input Form:** Users enter body weight, years lifting, and 1RM data  
- **Plan Generator:** Calculates a structured **5x3x1** cycle based on inputs  
- **Elite Goal Tracking:** Optional toggle to **predict the timeline** for achieving Elite Level Fitness  
- **Offline Storage:** Data persists **without a database** using **LocalStorage**  
- **Mobile-First Design:** Prioritize **tap-friendly UI, fluid interactions, and smooth navigation**  

---

## **Constraints**  
- **No external backend services** (fully client-side)  
- **Maximize browser capabilities** to keep it lightweight  
- **Avoid complex dependencies**—keep the app simple and efficient  

---

## **Action Request**  
Please generate **React + TypeScript code** for this application, implementing the UI in **Tailwind UI**, ensuring **offline storage**, and styling it in **an 80s cyberpunk aesthetic**.  

The final result should be a **fully functional mobile-friendly PWA** that lets users plan their **5x3x1 cycle**, set **Elite strength goals**, and **predict progress timelines** safely.  