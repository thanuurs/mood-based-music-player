# Quick Installation Guide for Visual Studio Code

## Step 1: Extract Files
1. Extract the `moodtunes-cactus.zip` file to your desired location
2. Open the extracted folder in Visual Studio Code

## Step 2: Install Dependencies
1. Open the integrated terminal in VS Code (Terminal → New Terminal or Ctrl+`)
2. Run the following command:
   ```bash
   npm install
   ```

## Step 3: Start the Application
1. In the same terminal, run:
   ```bash
   npm run dev
   ```
2. Wait for the server to start (you'll see "serving on port 5000")
3. Open your browser and go to: `http://localhost:5000`

## Step 4: Enjoy!
- Click on any mood button (Happy, Sad, Energetic, etc.)
- Watch the cactus dance and listen to the generated music
- No login or external accounts required!

## Troubleshooting
- **If npm install fails**: Make sure you have Node.js 18+ installed
- **If the page doesn't load**: Check that port 5000 isn't already in use
- **If no music plays**: Click on a mood button to generate audio

That's it! Your MoodTunes Cactus app is ready to use.