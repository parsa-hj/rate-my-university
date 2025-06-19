const fs = require("fs");
const path = require("path");

// Load blocked/allowed IPs from environment or file
const BLOCKED_IPS = process.env.BLOCKED_IPS
  ? process.env.BLOCKED_IPS.split(",")
  : [];
const ALLOWED_IPS = process.env.ALLOWED_IPS
  ? process.env.ALLOWED_IPS.split(",")
  : [];

// Configurable rate limit
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 10000; // ms
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX) || 10;

const BLOCKED_UA_PATTERNS = [
  /sqlmap/i,
  /curl/i,
  /nikto/i,
  /nmap/i,
  /acunetix/i,
  /wpscan/i,
  /fuzz/i,
];

const rateLimitMap = new Map();

function logSuspicious(ip, reason, req) {
  const logLine = `${new Date().toISOString()} Suspicious request from ${ip} - ${reason} - UA: ${
    req.headers["user-agent"]
  }\n`;
  fs.appendFile(path.join(__dirname, "waf.log"), logLine, () => {});
  console.warn(logLine);
}

function normalizeInput(input) {
  if (typeof input === "string") return input.toLowerCase().trim();
  if (typeof input === "object" && input !== null) {
    return JSON.stringify(input).toLowerCase().trim();
  }
  return "";
}

function wafMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;

  // Allowlist check
  if (ALLOWED_IPS.length && !ALLOWED_IPS.includes(ip)) {
    logSuspicious(ip, "IP not in allowlist", req);
    return res.status(403).send("Forbidden: IP not allowed.");
  }

  // Blocklist check
  if (BLOCKED_IPS.includes(ip)) {
    logSuspicious(ip, "IP blocked", req);
    return res.status(403).send("Forbidden: IP blocked.");
  }

  // User-Agent block
  const ua = req.headers["user-agent"] || "";
  if (BLOCKED_UA_PATTERNS.some((pat) => pat.test(ua))) {
    logSuspicious(ip, "Blocked User-Agent", req);
    return res.status(403).send("Forbidden: Bad User-Agent.");
  }

  // Rate limiting
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, lastRequest: now };
  const timeSinceLast = now - entry.lastRequest;
  if (timeSinceLast < RATE_LIMIT_WINDOW) {
    entry.count++;
  } else {
    entry.count = 1;
  }
  entry.lastRequest = now;
  if (entry.count > RATE_LIMIT_MAX) {
    logSuspicious(ip, "Rate limit exceeded", req);
    return res.status(429).send("Too many requests");
  }
  rateLimitMap.set(ip, entry);

  // Malicious pattern detection
  const patterns = [
    /\bselect\b|\bunion\b|\bdrop\b|\binsert\b|\bupdate\b|\bdelete\b|\bshutdown\b|\bgrant\b|\bexec\b|\bconcat\b|\bload_file\b|\boutfile\b/i,
    /<script.*?>/i,
    /<img.*?onerror=.*?>/i,
    /javascript:/i,
    /\balert\b|\bprompt\b|\bconfirm\b/i,
    /\.{2,}\//, // Path traversal
    /%00/, // Null byte
    /\bbase64\b/i,
    /\bdata:/i,
    /\bfetch\b|\bxmlhttprequest\b/i,
    /\bset-cookie\b/i,
    /\bhttp-equiv\b/i,
    /\bmeta\b.*?refresh/i,
  ];

  function checkForThreats(data) {
    const norm = normalizeInput(data);
    return patterns.some((pattern) => pattern.test(norm));
  }

  // Check query, body, headers, cookies
  if (
    checkForThreats(req.query) ||
    checkForThreats(req.body) ||
    checkForThreats(req.headers) ||
    checkForThreats(req.cookies)
  ) {
    logSuspicious(ip, "Malicious pattern detected", req);
    return res.status(403).send("Forbidden: Malicious content detected.");
  }

  // HTTP Parameter Pollution: check for duplicate keys
  const hasDuplicateKeys = (obj) => {
    if (!obj || typeof obj !== "object") return false;
    const keys = Object.keys(obj);
    return keys.length !== new Set(keys).size;
  };
  if (hasDuplicateKeys(req.query) || hasDuplicateKeys(req.body)) {
    logSuspicious(ip, "HTTP Parameter Pollution", req);
    return res.status(400).send("Bad Request: Duplicate parameters detected.");
  }

  next(); // Safe to proceed
}

module.exports = wafMiddleware;
