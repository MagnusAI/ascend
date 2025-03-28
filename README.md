# Ascend - Goal Tracking Application

A web application for setting and tracking goals, built with React, TypeScript, and Supabase.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Supabase account and project
- Supabase CLI
- Docker (for local Supabase development)

### Environment Setup

1. Clone the repository
2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` file with your Supabase credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase project's anon/public key

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Setup

1. Install Supabase CLI:
```bash
# Windows (using scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# macOS (using homebrew)
brew install supabase/tap/supabase
```

2. Start Supabase locally:
```bash
npm run supabase:start
```

3. Run database migrations:
```bash
npm run supabase:db:push
```

## Development

1. Start the development server:
```bash
npm run dev
```

2. The application will be available at `http://localhost:5173`

## Database Management

### Local Development
- Push migrations to the database:
```bash
npm run supabase:db:push
```

- Pull the latest database schema:
```bash
npm run supabase:db:pull
```

- Reset the database (useful for development):
```bash
npm run supabase:db:reset
```

### Production Deployment

1. Set up GitHub Secrets in your repository:
   - Go to your repository settings
   - Navigate to Secrets and Variables > Actions
   - Add the following secrets:
     - `SUPABASE_DB_PASSWORD`: Your database password (from Supabase dashboard > Project Settings > Database)
     - `SUPABASE_PROJECT_REF`: Your project reference ID (from Supabase dashboard > Project Settings > General)

2. The migrations will run automatically when:
   - You push changes to the `main` branch
   - The changes include files in the `supabase/migrations` directory
   - You manually trigger the workflow from the Actions tab

3. To manually run migrations:
   - Go to the Actions tab in your repository
   - Select "Database Migrations"
   - Click "Run workflow"

## Stopping Supabase

When you're done developing, you can stop the Supabase services:
```bash
npm run supabase:stop
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
