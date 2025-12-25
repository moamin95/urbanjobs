# Urban Jobs NYC

A full-stack job board application for browsing New York City government job postings, powered by NYC Open Data.

https://urbanjobs.vercel.app/

## Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Query** (React Query) v5.90.12 - Server state management and caching
- **TailwindCSS** 4.1.18 - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend
- **Express.js** v5.2.1 - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing

### Data Source
- **NYC Open Data SODA API** - Socrata Open Data API
- **SOQL Queries** - SQL-like query language for filtering and retrieving data

## TanStack Query Caching Strategy

The application implements an efficient caching strategy using TanStack Query:

### Cache Configuration
```typescript
{
  staleTime: 1000 * 60 * 60,      // 1 hour - data considered fresh for 1 hour
  gcTime: 1000 * 60 * 60 * 2,     // 2 hours - cache retained for 2 hours
  placeholderData: (previousData) => previousData  // Show previous data while fetching
}
```

### Query Key Strategy
Queries are cached based on:
- `pageNumber` - Current page
- `pageSize` - Number of items per page
- `searchQuery` - Job title and keyword filters
- `agencies` - Selected agency filters

This ensures that identical queries return cached data instantly, while different filter combinations fetch fresh data.

### Benefits
- Reduced API calls and backend load
- Instant navigation when returning to previously viewed pages
- Smooth UX with placeholder data during refetches
- Automatic cache invalidation after 1 hour

## Express.js Backend

The backend server provides a REST API that interfaces with NYC Open Data:

### Architecture
- RESTful endpoints for jobs, agencies, and categories
- Proxy layer to NYC Open Data SODA API
- Query building with SOQL syntax
- Error handling and validation

### API Endpoints
- `GET /jobs` - Retrieve paginated job listings with filters
- `GET /agencies` - Get list of NYC agencies
- `GET /categories` - Get job categories

### Environment Variables
```bash
API_TOKEN=your_nyc_open_data_token
```

## NYC Open Data SODA API

The application queries the [NYC Jobs dataset](https://data.cityofnewyork.us/City-Government/NYC-Jobs/kpav-sd4t) using SOQL (Socrata Query Language):

### SOQL Query Examples

**Fetch jobs with filters:**
```sql
SELECT *
WHERE business_title LIKE '%Engineer%'
  AND agency IN ('DEPT OF PARKS & RECREATION', 'FIRE DEPARTMENT')
ORDER BY posting_date DESC
```

**Get total count:**
```sql
SELECT COUNT(*)
WHERE business_title LIKE '%Engineer%'
```

### Features
- SQL-like syntax for familiar querying
- Support for `WHERE`, `LIKE`, `IN`, `ORDER BY` clauses
- Pagination with page number and size
- Full-text search capabilities

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks (TanStack Query)
│   │   ├── lib/         # Utilities
│   │   └── apis.ts      # API client configuration
├── server/              # Express.js backend
│   ├── routes/          # API route handlers
│   ├── server.ts        # Express server setup
│   └── type.ts          # TypeScript types
└── shared/              # Shared types between client and server
```
