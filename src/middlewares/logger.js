// logger.js
const fs = require('fs');

function customLogger(req, res, next) {
  const start = Date.now();
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url}`;

  // Log the request method and URL to the console
  console.log(logMessage);

  // Attach an event listener to log the response finish event
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    const logMessageWithStatus = `${logMessage} - Status ${res.statusCode} - Response Time: ${responseTime}ms }`;

    // Log the response status and response time to the console
    console.log(logMessageWithStatus);

    // Write the log to a text file (logs.txt)
    fs.appendFile('./src/logs.txt', logMessageWithStatus + '\n', (err) => {
      if (err) {
        console.error('Error writing to the log file:', err);
      }
    });
  });

  // Call the next middleware in the chain
  next();
}

module.exports = customLogger;
