# Horse Racing Game

A simple and fun horse racing game built with React and TypeScript.

## Features

- **Main Menu**: Select your horse and start the race
- **Game Screen**: Watch 6 horses race from left to right
- **Pause Menu**: Pause the game and choose to resume or exit to menu
- **Winner Screen**: See which horse won and if your selection was correct

## How to Play

1. From the main menu, select one of the 6 colored horses
2. Click the "Start Race" button to begin the race
3. Watch as the horses race from left to right
4. The first horse to reach the right side of the screen wins
5. After the race, you'll see if your selected horse won
6. Click "Return to Menu" to play again

## Development

This project was built using:
- React 19
- TypeScript
- Vite

### Running the Project

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Assets

The game uses the following assets:
- Horse image: `src/assets/horse.png`
- Racetrack image: `src/assets/racetrack.jpg`

## Game Logic

- Each horse moves at a random speed
- Only one horse can win the race
- The game can be paused at any time
- The winner is determined by the first horse to reach 100% of the track

## License

MIT
