# Mini-paint

## Task

Documentation: https://drive.google.com/file/d/19cb4whI_HUVPzuaPyaj5r6hGotIVnhho/view

## How to Run the App

### Prerequisites
- Node.js (version 14 or higher)
- npm (version 6 or higher) or yarn (version 1.22 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd [repository-name]

2. Install dependencies:
   ```bash
    npm install
    # or
    yarn install

3. To start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

## Database Snapshot

### Firebase Firestore Database Structure
The application uses Firebase Firestore for data storage. Here is a snapshot of the database structure:

In the `pics` collection, each document contains the following fields:
- **createdAt**: The timestamp of when the document was created.
- **url**: The URL of the image stored in Firebase Storage.
- **userEmail**: The email of the user who uploaded the image.
- **userId**: The unique identifier of the user.

## Application Stack

The application is built using the following technologies and libraries:

- **Vite**: A build tool that provides a faster and leaner development experience for modern web projects.
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript that adds static types.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **React Hook Form**: For form management in React applications.
- **Firebase Storage**: For storing images and other files.
- **Firebase Firestore**: A flexible, scalable database for mobile, web, and server development.
- **React Router**: For routing and navigation in the application.
- **React Toastify**: For notifications and alerts.
- **Material-UI (MUI)**: A React component library for faster and easier web development.

## Folder Structure

The project follows a modular architecture. Here's an overview of the folder structure:

- **src/**: Contains the source code of the application.
- **components/**: Reusable React components.
- **constants/**: Contains constant values used across the application.
- **context/**: Context API components and providers.
- **modules/**: Feature-specific modules.
- **hooks/**: Custom React hooks.
- **pages/**: Page components that represent different routes.
- **helpers/**: Helper functions used across the application.