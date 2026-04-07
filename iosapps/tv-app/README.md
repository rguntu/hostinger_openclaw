# TV Price Comparison App

## Data Contract: Deals Feed
The application consumes a JSON interface for the deals feed:

```json
{
  "deals": [
    {
      "id": "string",
      "model": "string",
      "currentPrice": "number",
      "originalPrice": "number",
      "discountPct": "number",
      "retailerLink": "string",
      "imageUrl": "string"
    }
  ]
}
```
