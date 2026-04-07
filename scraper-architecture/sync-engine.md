# Sync Engine Architecture

## Overview
The sync engine is responsible for periodically fetching updated TV deal information from retailers and maintaining a local cache using MMKV storage.

## Sync Mechanisms

### 1. Periodic Background Sync
- Frequency: Every 6 hours during active usage
- Extended frequency: Every 12 hours when app is not in use
- Implementation: iOS background fetch API
- Data volume: Fetch top 50 deals from each retailer

### 2. Manual Refresh
- User-initiated sync from pull-to-refresh or refresh button
- Full data fetch from all registered retailers
- Immediate execution with progress feedback

### 3. Push Notifications Integration
- Server-side webhook for hot deals
- Immediate local sync when notification received
- Smart filtering to avoid duplicate entries

## Sync Process Flow

1. Check last sync timestamp
2. Determine which retailers need updating
3. Execute scraper requests in parallel with rate limiting
4. Parse and normalize incoming data
5. Compare with existing data to identify changes
6. Update MMKV storage with new/changed data
7. Track price history for existing products
8. Update last sync timestamp
9. Notify UI layer of data changes

## Conflict Resolution
- Use most recently scraped data as authoritative
- Preserve price history even when other attributes change
- Merge data from multiple sources for same product when possible

## Error Handling
- Retry failed scrapers up to 3 times
- Maintain offline functionality with cached data
- Notify user when sync fails consistently
- Log errors for debugging purposes