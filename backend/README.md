# URL Shortener Backend

This is a simple backend service for a URL shortener application built with Node.js.

## Features
- Shorten long URLs to short codes
- Redirect short codes to original URLs
- Simple REST API

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yash5800/urlshort-backend.git
   cd urlshort-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Usage
Start the server:
```sh
node server.js
```

### API Endpoints
- `POST /shorten` - Shorten a URL
- `GET /:code` - Redirect to the original URL

## Project Structure
- `server.js` - Main server file
- `lib.js` - Utility functions
- `scheme.js` - URL schema/model
- `package.json` - Project metadata and dependencies

## License
MIT
