# Express TypeScript API with Redis and Swagger

A modern REST API built with Express.js, TypeScript, Redis for caching, and Swagger for API documentation.

## Prerequisites

- Node.js (v14 or higher)
- Redis server running locally (or update the Redis connection URL in the code)
- npm or yarn package manager

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Redis server (if not already running)
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev`: Start the development server with hot-reload
- `npm run build`: Build the TypeScript code
- `npm start`: Start the production server
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint issues

## API Documentation

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Cache API

- `GET /api/cache/:key`: Get a value from cache
- `POST /api/cache`: Set a value in cache

Example request:
```bash
# Set a value
curl -X POST http://localhost:3000/api/cache \
  -H "Content-Type: application/json" \
  -d '{"key": "test-key", "value": "test-value"}'

# Get a value
curl http://localhost:3000/api/cache/test-key
```

## Testing

Run the test suite:
```bash
npm test
```

## Project Structure

```
src/
├── __tests__/          # Test files
├── routes/            # API routes
├── index.ts           # Main application file
└── types/             # TypeScript type definitions
```

## License

ISC 