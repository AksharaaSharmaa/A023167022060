import axios from 'axios';

/**
 * Log function that makes an API call to the test server
 * @param {string} stack - The stack (e.g., "backend", "frontend")
 * @param {string} level - The log level (e.g., "error", "fatal", "info", "warn", "debug")
 * @param {string} packageName - The package/module name
 * @param {string} message - The log message
 */
export async function Log(stack, level, packageName, message) {
  try {
    // Validate inputs according to API constraints
    const validStacks = ['backend', 'frontend'];
    const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
    const validBackendPackages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
    const validFrontendPackages = ['component', 'hook', 'page', 'state', 'style'];
    const validBothPackages = ['auth', 'config', 'middleware', 'utils'];

    if (!validStacks.includes(stack.toLowerCase())) {
      throw new Error(`Invalid stack. Must be one of: ${validStacks.join(', ')}`);
    }

    if (!validLevels.includes(level.toLowerCase())) {
      throw new Error(`Invalid level. Must be one of: ${validLevels.join(', ')}`);
    }

    const stackLower = stack.toLowerCase();
    const levelLower = level.toLowerCase();
    const packageLower = packageName.toLowerCase();

    // Validate package based on stack
    const allValidPackages = [...validBackendPackages, ...validFrontendPackages, ...validBothPackages];
    
    if (!allValidPackages.includes(packageLower)) {
      throw new Error(`Invalid package. Must be one of: ${allValidPackages.join(', ')}`);
    }

    const logData = {
      stack: stackLower,
      level: levelLower,
      package: packageLower,
      message,
      timestamp: new Date().toISOString()
    };

    console.log(`[${levelLower.toUpperCase()}] [${stackLower}] [${packageLower}] ${message}`);

    // Use the auth token directly
    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJha3NoYXJhLnNoYXJtYS5jb250YWN0QGdtYWlsLmNvbSIsImV4cCI6MTc1NDM3MjEyOSwiaWF0IjoxNzU0MzcxMjI5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNDBlNzEyMDAtN2M3NC00YzAwLTg5YzEtNmY2YmIyMTExZGEwIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWtzaGFyYSBzaGFybWEiLCJzdWIiOiI3YmNlYjI1Zi1hMTAyLTQ3NzgtYTgzZi1jY2UyMGZmNzU1ZTMifSwiZW1haWwiOiJha3NoYXJhLnNoYXJtYS5jb250YWN0QGdtYWlsLmNvbSIsIm5hbWUiOiJha3NoYXJhIHNoYXJtYSIsInJvbGxObyI6ImEwMjMxNjcwMjIwNjAiLCJhY2Nlc3NDb2RlIjoieXZoZGRhIiwiY2xpZW50SUQiOiI3YmNlYjI1Zi1hMTAyLTQ3NzgtYTgzZi1jY2UyMGZmNzU1ZTMiLCJjbGllbnRTZWNyZXQiOiJTVVl4UlJ5cXJ6ZmNGeGVaIn0.51Di_m3nQ7udoWLw7mVdwuq2jY3-wxMZ_oicy__iD_0";

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    };

    // Make API call to test server
    const response = await axios.post('http://20.244.56.144/evaluation-service/logs', logData, { headers });
    
    return {
      success: true,
      data: response.data,
      message: 'Log sent successfully'
    };

  } catch (error) {
    console.error('Failed to send log to test server:', error.message);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send log'
    };
  }
}

// Export default for convenience
export default Log; 