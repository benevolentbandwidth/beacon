# Beacon API

## Run

```bash
npm install && npm run dev
```

## Endpoint

```
POST /v1/analyze
```

Request:
```json
{
  "text": "Click here to verify your account",
  "url": "https://example.com",
  "heuristic_score": 0.74,
  "context": "email_body"
}
```

Response:
```json
{
  "risk_score": 0.91,
  "label": "phishing",
  "action": "block",
  "reason": "..."
}
```
