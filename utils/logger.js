// utils/logger.js
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Lokasi log file (absolute path to project-level logs folder)
const logDir = path.join(__dirname, '..', 'logs');

// Pastikan folder log ada (buat rekursif jika perlu)
if (!fs.existsSync(logDir)) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
  } catch (err) {
    // Jika pembuatan folder gagal, biarkan winston menangani error selanjutnya
    // tapi tetap log ke console agar developer tahu
    // eslint-disable-next-line no-console
    console.error('Could not create log directory', logDir, err);
  }
}

const logger = winston.createLogger({
  level: 'info', // default level
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    // Log ke file
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
});

// Jika environment development, tampilkan di console
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = logger;