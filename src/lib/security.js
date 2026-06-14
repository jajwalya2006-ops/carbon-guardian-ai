/**
 * Carbon Guardian AI — Security Utilities
 * 
 * Input validation, sanitization, and safe data handling patterns.
 * Used across all form inputs and user-facing data rendering.
 */

// ─── Input Sanitization ────────────────────────────────────────────────────────

/**
 * Strip HTML tags and potentially dangerous content from a string.
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')        // strip HTML tags
    .replace(/javascript:/gi, '')    // remove javascript: protocol
    .replace(/on\w+\s*=/gi, '')      // remove inline event handlers
    .replace(/data:/gi, '')          // remove data: protocol
    .trim();
}

/**
 * Encode HTML entities for safe display rendering.
 * @param {string} str - String to encode
 * @returns {string} HTML-entity encoded string
 */
export function sanitizeForDisplay(str) {
  if (typeof str !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return str.replace(/[&<>"'/]/g, (char) => map[char]);
}

// ─── Input Validation ───────────────────────────────────────────────────────────

/**
 * Validate a numeric input within bounds.
 * @param {*} value - The value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {{ valid: boolean, value: number, error: string|null }}
 */
export function validateNumericInput(value, min = 0, max = 100000) {
  const num = Number(value);

  if (value === '' || value === null || value === undefined) {
    return { valid: false, value: 0, error: 'This field is required.' };
  }

  if (!isFinite(num)) {
    return { valid: false, value: 0, error: 'Please enter a valid number.' };
  }

  if (num < min) {
    return { valid: false, value: min, error: `Value must be at least ${min}.` };
  }

  if (num > max) {
    return { valid: false, value: max, error: `Value must not exceed ${max}.` };
  }

  return { valid: true, value: num, error: null };
}

/**
 * Validate an email address format.
 * @param {string} email - Email to validate
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateEmail(email) {
  if (typeof email !== 'string' || email.trim() === '') {
    return { valid: false, error: 'Email address is required.' };
  }

  // RFC 5322 simplified regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  return { valid: true, error: null };
}

/**
 * Validate password strength.
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean, strength: string, error: string|null }}
 */
export function validatePassword(password) {
  if (typeof password !== 'string' || password.length === 0) {
    return { valid: false, strength: 'none', error: 'Password is required.' };
  }

  if (password.length < 8) {
    return { valid: false, strength: 'weak', error: 'Password must be at least 8 characters.' };
  }

  let score = 0;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { valid: true, strength: 'weak', error: null };
  if (score <= 2) return { valid: true, strength: 'fair', error: null };
  if (score <= 3) return { valid: true, strength: 'good', error: null };
  return { valid: true, strength: 'strong', error: null };
}

/**
 * Validate a name field (no special characters that could be injection).
 * @param {string} name - Name to validate
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateName(name) {
  if (typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'Name is required.' };
  }

  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters.' };
  }

  if (name.length > 100) {
    return { valid: false, error: 'Name must not exceed 100 characters.' };
  }

  // Allow letters, spaces, hyphens, apostrophes, and periods
  const nameRegex = /^[a-zA-Z\s\-'.]+$/;
  if (!nameRegex.test(name.trim())) {
    return { valid: false, error: 'Name contains invalid characters.' };
  }

  return { valid: true, error: null };
}

// ─── Content Security ───────────────────────────────────────────────────────────

/**
 * Content Security Policy directives for the application.
 */
export const CSP_DIRECTIVES = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline'",
  'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
  'font-src': "'self' https://fonts.gstatic.com",
  'img-src': "'self' data: blob:",
  'connect-src': "'self'",
};

/**
 * Rate limiter configuration (for future API integration).
 */
export const RATE_LIMITS = {
  maxRequestsPerMinute: 60,
  maxLoginAttempts: 5,
  lockoutDurationMs: 15 * 60 * 1000, // 15 minutes
};
