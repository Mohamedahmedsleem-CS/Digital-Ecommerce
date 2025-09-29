# Search and Pagination Implementation

This document describes the search and pagination system implemented for the products list.

## Features Implemented

### 1. Search Functionality
- **Debounced Search Input**: Search queries are debounced with a 500ms delay to prevent excessive API calls
- **Real-time Filtering**: Products are filtered by title using Strapi's `$containsi` filter
- **Search Reset**: Page resets to 1 when a new search query is entered

### 2. Pagination System
- **Page Navigation**: Previous/Next buttons with proper disabled states
- **Page Numbers**: Smart page number display with ellipsis for large page counts
- **Page Info**: Shows current page, total pages, and total products count
- **Smooth Scrolling**: Automatically scrolls to products section when changing pages

### 3. State Management
- **Centralized API Function**: `fetchProducts` function handles all product fetching with search, pagination, and sorting
- **Loading States**: Proper loading indicators during API calls
- **Error Handling**: User-friendly error messages for failed requests

## Components Created

### 1. `useDebounce` Hook (`app/_hooks/useDebounce.js`)
Custom hook for debouncing values to prevent excessive API calls.

### 2. `SearchInput` Component (`app/_components/SearchInput.jsx`)
Reusable search input component with loading state and RTL support.

### 3. `PaginationControls` Component (`app/_components/PaginationControls.jsx`)
Comprehensive pagination component with page numbers, navigation buttons, and page info.

### 4. Enhanced `ProductSection` Component
Updated to integrate search and pagination functionality.

## API Integration

### Enhanced `ProductApis.js`
- Added `fetchProducts` function with support for:
  - Search queries (`filters[title][$containsi]`)
  - Pagination (`pagination[page]`, `pagination[pageSize]`)
  - Sorting (`sort[0]`)
  - Category filtering (`filters[category][$eq]`)

### Strapi Query Structure
```
${NEXT_PUBLIC_STRAPI_API_URL}/api/products?populate=*&filters[title][$containsi]={SEARCH_QUERY}&pagination[page]={PAGE_NUMBER}&pagination[pageSize]=12&sort[0]=createdAt:desc
```

## Usage

### Basic Usage
The search and pagination functionality is automatically available in the `ProductSection` component used on the home page and search page.

### Search Page
Visit `/search` to access the dedicated search page with enhanced search functionality.

### Environment Variables
Make sure to set the following environment variables in your `.env.local` file:
```
NEXT_PUBLIC_API_BASE_URL=https://strapi-95jv.onrender.com/api
NEXT_PUBLIC_STRAPI_API_URL=https://strapi-95jv.onrender.com/api
NEXT_PUBLIC_REST_API_KEY=your_api_key_here
```

## Technical Details

### Debouncing
- Search queries are debounced with a 500ms delay
- This prevents API calls on every keystroke
- Improves performance and reduces server load

### Pagination
- Default page size: 12 products per page
- Smart page number display for large datasets
- Proper disabled states for navigation buttons

### Error Handling
- Network errors are caught and displayed to users
- Graceful fallbacks for missing data
- Console logging for debugging

### Performance Optimizations
- Debounced search to reduce API calls
- Efficient state management
- Smooth scrolling for better UX
- Loading states to provide user feedback

## Testing

To test the functionality:

1. Start the development server: `npm run dev`
2. Visit the home page to see the enhanced ProductSection
3. Visit `/search` for the dedicated search page
4. Test search functionality by typing in the search box
5. Test pagination by clicking Previous/Next buttons or page numbers
6. Verify that search and pagination work together correctly

## Future Enhancements

Potential improvements for the future:
- Advanced filtering (by category, price range, etc.)
- Sorting options (by price, name, date)
- Search suggestions/autocomplete
- URL state management for bookmarkable search results
- Infinite scroll as an alternative to pagination
