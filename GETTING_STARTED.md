# GETTING STARTED

## Installation

1. Install Node.js (version 18 or higher)
   Download from: https://nodejs.org/

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Game

Development mode (with hot reload):
```bash
npm run dev
```

Then open your browser to:
http://localhost:3000

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

- `/src/App.tsx` - Main game application
- `/src/lib/` - Core game simulation logic
- `/src/components/` - React UI components
- `/src/styles/` - CSS styling
- `/public/mockdata/` - Initial game data
- `/docs/agents/fullstack/` - Complete documentation

## Documentation

- `README.md` - Overview and quick start
- `docs/agents/fullstack/README.md` - Detailed technical documentation
- `docs/agents/fullstack/DECISIONS.md` - Architecture decisions
- `docs/agents/fullstack/API_CONTRACT.md` - Data schemas
- `docs/agents/fullstack/HANDOFF.md` - Quick reference

## Troubleshooting

If you see TypeScript errors:
- Make sure you ran `npm install`
- Delete `.next/` folder and rebuild

If the game won't start:
- Check that port 3000 is available
- Try `npm run dev` again
- Check browser console for errors

## Next Steps

1. Run `npm install`
2. Run `npm run dev`
3. Open http://localhost:3000
4. Start playing!
