# Dine-In: Modern Restaurant Ecosystem

A comprehensive, production-ready digital dine-in ordering system designed to streamline restaurant operations and enhance the guest experience through technology.

##  Business Scope

The Dine-In project transforms traditional restaurant workflows into a seamless digital journey:

*   **Self-Service Ordering**: Guests scan table-specific QR codes to access a dynamic digital menu on their own devices—no app download or account creation required.
*   **Real-time Operations**: Restaurant staff monitor live table sessions, manage kitchen orders, and track preparation times in real-time.
*   **Table & Capacity Management**: Visual floor layout maps that indicate table availability, occupancy, and session health (timers).
*   **Menu Agility**: Admin tools to update categories, toggle availability based on time windows (breakfast/dinner items), and manage pricing instantly.
*   **Hybrid Payment Flow**: Supports digital bill viewing with external payment verification (UPI QR/Cash), bridging the gap between digital ordering and physical settlement.


##  Technical Architecture

The system is built with a decoupled, modular architecture using a modern TypeScript stack for reliability and performance.

###  Backend (`dine-in-api`)
*   **Framework**: [NestJS](https://nestjs.com/) (Node.js) for structured, testable server-side logic.
*   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) for flexible document schema management.
*   **Real-time Connectivity**: Server-Sent Events (SSE) provide live updates to both guests and staff without aggressive polling.
*   **Auth**: JWT-based authentication for Admin staff and session-based fingerprinting for Guest users.
*   **Standards**: SOLID principles, Repository pattern, and strict DTO validation.

###  Admin Dashboard (`dine-in-admin-ui`)
*   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/).
*   **State & Caching**: [Redux Toolkit](https://redux-toolkit.js.org/) with **RTK Query** for intelligent data fetching, automatic cache invalidation, and background synchronization.
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for a premium, custom-branded interface with native Dark Mode support.
*   **Interactivity**: Refined UI components using the native HTML `<dialog>` API and Lucide icons for a premium feel.

###  Guest Experience (`dine-in-ui`)
*   **Experience**: Mobile-first Web App (PWA) designed for low friction.
*   **Logic**: QR-based table binding and session persistence that maintains orders across page refreshes.
*   **UI**: Minimalist, high-performance interface focused on menu discoverability and order clarity.


##  Performance & Scalability
*   **Caching Strategy**: Centralized API slice with tag-based invalidation ensures that a status update on one screen (e.g., Table Master) is instantly reflected everywhere else (e.g., Dashboard).
*   **Clean Code**: Decoupled modules ensure that features like "Heatmap" or "Advanced Reservations" can be added without regressing existing ordering flows.
*   **SEO & UX**: Implementation of semantic HTML5 and SEO best practices for the Guest UI and high-density information layout for the Admin UI.

## License
This project is licensed under CC BY-NC 4.0.

What this means: 
> * Anyone is free to share and adapt the code for personal or educational use.
> * Users must give appropriate credit to the original work.
> * Users Cannot use this material for commercial purposes without my exclusive permission.