# Logging Middleware

A reusable logging middleware package that makes API calls to a test server for comprehensive application logging.

## Features

- **Reusable Package**: Can be imported and used across different projects
- **API Integration**: Makes calls to test server for centralized logging
- **Multiple Log Levels**: Supports error, fatal, info, warn, debug levels
- **Structured Logging**: Includes stack, level, package, and message parameters
- **Timestamp**: Automatically adds ISO timestamp to each log entry

## Installation

```bash
npm install axios
```

## Usage

### Import the Log function

```javascript
import Log from './logging-middleware/index.js';
```

### Function Signature

```javascript
Log(stack, level, package, message)
```

**Parameters:**
- `stack` (string): The stack (e.g., "backend", "frontend")
- `level` (string): The log level (e.g., "error", "fatal", "info", "warn", "debug")
- `package` (string): The package/module name
- `message` (string): The log message

### Examples

```javascript
// Data type mismatch error in handler
await Log("backend", "error", "handler", "received string, expected bool");

// Critical database connection failure
await Log("backend", "fatal", "db", "Critical database connection failure.");

// User authentication
await Log("frontend", "info", "auth", "User login successful");

// API rate limiting
await Log("backend", "warn", "api", "Rate limit approaching threshold");

// Debug information
await Log("backend", "debug", "middleware", "Request processed successfully");
```

## Testing

Run the test file to see examples in action:

```bash
node test.js
```

## API Endpoint

The logging middleware makes POST requests to:
`http://20.244.56.144/evaluation-service/logs`

## Response Format

Each log call returns:
```javascript
{
  success: true/false,
  data: response.data, // from test server
  message: 'Log sent successfully' / 'Failed to send log'
}
```

## Best Practices

1. **Strategic Integration**: Place Log calls at key points in your application
2. **Descriptive Messages**: Provide specific context, avoid generic messages
3. **Relevant Data**: Include state, actions, and data that would be valuable for troubleshooting
4. **Future-Proof**: Think about what information would be most valuable months from now 