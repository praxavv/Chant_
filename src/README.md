# Chant

Chant is a simple and beautiful mantra chanting application with a relaxing, space-themed UI. It helps you keep track of your mantra repetitions with ease.

## Features

*   **Simple Counter**: Click anywhere on the screen to increment the counter for your selected mantra.
*   **Mantra Management**: Add, delete, and switch between multiple mantras.
*   **Persistent Storage**: Your mantras and their counts are saved in your browser's local storage, so you'll never lose your progress.
*   **Manual Adjustments**: Manually set, add to, or subtract from your chant count.
*   **Relaxing Ambiance**: Enjoy a calming, animated starry background and optional background music to enhance your chanting experience.
*   **Responsive Design**: The application is designed to work on both desktop and mobile devices.

## How to Use

1.  **Incrementing the Counter**: Simply click or tap anywhere on the screen.
2.  **Accessing Settings**: Click the gear icon (⚙️) in the top-right corner to open the settings panel.
3.  **Managing Mantras**:
    *   **Add**: Click the `+` button to add a new mantra.
    *   **Delete**: Select a mantra and click the `−` button to remove it.
    *   **Switch**: Use the dropdown menu to switch between your saved mantras.
4.  **Adjusting the Count**:
    *   **Set Count**: Enter a number in the "SET COUNT" field and click "SET & START" to change the current count.
    *   **Manual Operations**: Use the "➕ Add" and "➖ Subtract" buttons to add or subtract a specific value from the current count.
    *   **Decrement/Reset**: Use the "Decrement" and "Reset" buttons for quick adjustments.
5.  **Background Music**: Toggle the background music on or off using the "Play/Pause Music" button in the settings.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm (or yarn) installed on your machine.

### Installation

1.  Clone the repo:
    ```sh
    git clone https://github.com/your_username/Chant_.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd Chant_
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```

### Running the Application

To run the app in development mode, execute:
```sh
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) (or the address shown in your terminal) to view it in the browser.

## Folder Structure

```
/src
├── App.jsx          # Main application component
├── Chant.jsx        # Core component for the chanting functionality
├── index.css        # Styles for the application
└── main.jsx         # Entry point for the React application
```

## Technologies Used

*   [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
*   [Vite](https://vitejs.dev/) - A fast frontend build tool.
*   HTML5 & CSS3

---

Happy Chanting! ✨
