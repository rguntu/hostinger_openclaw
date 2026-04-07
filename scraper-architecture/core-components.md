# Core Components

## 1. Scraper Manager
- Central coordinator for all scraping operations
- Manages scheduling and execution of scrapers
- Handles retry logic and error reporting
- Controls rate limiting to respect retailer policies

## 2. Scraper Protocols
- Generic interface for all retailer scrapers
- Standardized output format for TV product data
- Error handling and parsing utilities

## 3. Data Models
- TVProduct: Standardized model for TV product information
- RetailerProduct: Raw data from individual retailers
- PriceHistory: Historical price tracking

## 4. Storage Layer (MMKV)
- Local caching of scraped data
- Fast key-value storage for iOS
- Automatic data expiration and cleanup

## 5. Network Layer
- HTTP client with retry mechanisms
- Proxy/rotation support for handling blocks
- User agent rotation to prevent detection

## 6. Configuration System
- Retailer-specific settings
- Scheduling configuration
- API keys and authentication tokens