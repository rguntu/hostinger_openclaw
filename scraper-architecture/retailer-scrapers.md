# Retailer Scraper Implementations

## 1. Amazon Scraper
- Base URL: https://www.amazon.com/s?k=tv
- Parsing approach: Extract data from search results and product pages
- Key data points: Price, brand, model, size, rating, image URL
- Rate limiting: 1 request per 2 seconds
- User agents: Rotate between 3-5 common browser user agents

## 2. Best Buy Scraper
- Base URL: https://www.bestbuy.com/site/searchpage.jsp?st=tv
- Parsing approach: Use structured data when available, HTML parsing otherwise
- Key data points: Price, model number, screen size, resolution, smart features
- Rate limiting: 1 request per 3 seconds
- Authentication: None required for basic product listings

## 3. Walmart Scraper
- Base URL: https://www.walmart.com/search?q=tv
- Parsing approach: JSON-LD structured data where available
- Key data points: Price, brand, model, size, customer rating
- Rate limiting: 1 request per 2.5 seconds

## 4. Target Scraper
- Base URL: https://www.target.com/s?searchTerm=tv
- Parsing approach: HTML parsing with specific selectors
- Key data points: Price, brand, model, size, availability
- Rate limiting: 1 request per 3 seconds

## Common Implementation Details
- Each scraper implements the RetailerScraper protocol
- Error handling for network issues, parsing errors, and empty results
- Caching of product details to minimize requests
- Support for handling pagination across search results
- Proper user agent rotation to prevent IP blocking
- Respect robots.txt guidelines