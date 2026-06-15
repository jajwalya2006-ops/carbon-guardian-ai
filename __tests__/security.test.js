/**
 * Security Utilities — Comprehensive Test Suite
 *
 * Tests all exported functions from src/lib/security.js
 * including XSS payloads, validation edge cases, and injection attacks.
 */
import {
  sanitizeInput,
  sanitizeForDisplay,
  validateNumericInput,
  validateEmail,
  validatePassword,
  validateName,
  CSP_DIRECTIVES,
  RATE_LIMITS,
} from '@/lib/security';

// ─── sanitizeInput ──────────────────────────────────────────────────────────

describe('sanitizeInput', () => {
  test('returns empty string for non-string input (number)', () => {
    expect(sanitizeInput(42)).toBe('');
  });

  test('returns empty string for null', () => {
    expect(sanitizeInput(null)).toBe('');
  });

  test('returns empty string for undefined', () => {
    expect(sanitizeInput(undefined)).toBe('');
  });

  test('returns empty string for boolean', () => {
    expect(sanitizeInput(true)).toBe('');
  });

  test('returns empty string for object', () => {
    expect(sanitizeInput({})).toBe('');
  });

  test('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  test('strips HTML script tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alert("xss")');
  });

  test('strips nested HTML tags', () => {
    expect(sanitizeInput('<div><p>hello</p></div>')).toBe('hello');
  });

  test('strips self-closing tags', () => {
    expect(sanitizeInput('<img src="x" />')).toBe('');
  });

  test('removes javascript: protocol', () => {
    expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
  });

  test('removes javascript: case insensitive', () => {
    expect(sanitizeInput('JaVaScRiPt:alert(1)')).toBe('alert(1)');
  });

  test('removes inline event handlers (onerror)', () => {
    expect(sanitizeInput('onerror=alert(1)')).toBe('alert(1)');
  });

  test('removes inline event handlers (onclick)', () => {
    expect(sanitizeInput('onclick =alert(1)')).toBe('alert(1)');
  });

  test('removes inline event handlers (onload)', () => {
    expect(sanitizeInput('onload=malicious()')).toBe('malicious()');
  });

  test('removes data: protocol', () => {
    expect(sanitizeInput('data:text/html,<script>alert(1)</script>')).toBe('text/html,alert(1)');
  });

  test('handles combined XSS payloads', () => {
    const payload = '<img src="x" onerror="javascript:alert(document.cookie)">';
    const result = sanitizeInput(payload);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).not.toContain('javascript:');
    expect(result).not.toContain('onerror');
  });

  test('preserves safe text content', () => {
    expect(sanitizeInput('Hello World 123')).toBe('Hello World 123');
  });

  test('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });

  test('handles whitespace-only string', () => {
    expect(sanitizeInput('   ')).toBe('');
  });

  test('handles string with special characters that are safe', () => {
    expect(sanitizeInput('john.doe@email.com')).toBe('john.doe@email.com');
  });
});

// ─── sanitizeForDisplay ─────────────────────────────────────────────────────

describe('sanitizeForDisplay', () => {
  test('returns empty string for non-string input', () => {
    expect(sanitizeForDisplay(42)).toBe('');
    expect(sanitizeForDisplay(null)).toBe('');
    expect(sanitizeForDisplay(undefined)).toBe('');
  });

  test('encodes ampersand', () => {
    expect(sanitizeForDisplay('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  test('encodes less-than', () => {
    expect(sanitizeForDisplay('<div>')).toBe('&lt;div&gt;');
  });

  test('encodes greater-than', () => {
    expect(sanitizeForDisplay('a > b')).toBe('a &gt; b');
  });

  test('encodes double quotes', () => {
    expect(sanitizeForDisplay('say "hello"')).toBe('say &quot;hello&quot;');
  });

  test('encodes single quotes', () => {
    expect(sanitizeForDisplay("it's")).toBe('it&#x27;s');
  });

  test('encodes forward slashes', () => {
    expect(sanitizeForDisplay('a/b')).toBe('a&#x2F;b');
  });

  test('encodes all special chars in one string', () => {
    const result = sanitizeForDisplay('<script>alert("xss")</script>');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).not.toContain('"');
  });

  test('preserves safe characters', () => {
    expect(sanitizeForDisplay('Hello World 123')).toBe('Hello World 123');
  });

  test('handles empty string', () => {
    expect(sanitizeForDisplay('')).toBe('');
  });
});

// ─── validateNumericInput ───────────────────────────────────────────────────

describe('validateNumericInput', () => {
  test('valid number within default range', () => {
    const result = validateNumericInput(50);
    expect(result.valid).toBe(true);
    expect(result.value).toBe(50);
    expect(result.error).toBeNull();
  });

  test('string number is parsed correctly', () => {
    const result = validateNumericInput('42');
    expect(result.valid).toBe(true);
    expect(result.value).toBe(42);
  });

  test('empty string is invalid', () => {
    const result = validateNumericInput('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  test('null is invalid', () => {
    const result = validateNumericInput(null);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  test('undefined is invalid', () => {
    const result = validateNumericInput(undefined);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  test('NaN is invalid', () => {
    const result = validateNumericInput(NaN);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('valid number');
  });

  test('Infinity is invalid', () => {
    const result = validateNumericInput(Infinity);
    expect(result.valid).toBe(false);
  });

  test('non-numeric string is invalid', () => {
    const result = validateNumericInput('abc');
    expect(result.valid).toBe(false);
  });

  test('value below min is invalid', () => {
    const result = validateNumericInput(-5, 0, 100);
    expect(result.valid).toBe(false);
    expect(result.value).toBe(0);
    expect(result.error).toContain('at least');
  });

  test('value above max is invalid', () => {
    const result = validateNumericInput(200, 0, 100);
    expect(result.valid).toBe(false);
    expect(result.value).toBe(100);
    expect(result.error).toContain('exceed');
  });

  test('exact min boundary is valid', () => {
    const result = validateNumericInput(0, 0, 100);
    expect(result.valid).toBe(true);
    expect(result.value).toBe(0);
  });

  test('exact max boundary is valid', () => {
    const result = validateNumericInput(100, 0, 100);
    expect(result.valid).toBe(true);
    expect(result.value).toBe(100);
  });

  test('decimal numbers are valid', () => {
    const result = validateNumericInput(3.14, 0, 10);
    expect(result.valid).toBe(true);
    expect(result.value).toBe(3.14);
  });

  test('uses default max of 100000', () => {
    const result = validateNumericInput(100001);
    expect(result.valid).toBe(false);
  });

  test('zero is valid within default range', () => {
    const result = validateNumericInput(0);
    expect(result.valid).toBe(true);
  });
});

// ─── validateEmail ──────────────────────────────────────────────────────────

describe('validateEmail', () => {
  test('valid basic email', () => {
    const result = validateEmail('user@example.com');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  test('valid email with subdomain', () => {
    expect(validateEmail('user@mail.example.com').valid).toBe(true);
  });

  test('valid email with dots in local part', () => {
    expect(validateEmail('first.last@example.com').valid).toBe(true);
  });

  test('valid email with plus sign', () => {
    expect(validateEmail('user+tag@example.com').valid).toBe(true);
  });

  test('empty string is invalid', () => {
    const result = validateEmail('');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('required');
  });

  test('non-string is invalid', () => {
    expect(validateEmail(123).valid).toBe(false);
    expect(validateEmail(null).valid).toBe(false);
  });

  test('missing @ symbol is invalid', () => {
    expect(validateEmail('userexample.com').valid).toBe(false);
  });

  test('missing domain is invalid', () => {
    expect(validateEmail('user@').valid).toBe(false);
  });

  test('whitespace-only is invalid', () => {
    expect(validateEmail('   ').valid).toBe(false);
  });

  test('email with spaces is invalid', () => {
    expect(validateEmail('user @example.com').valid).toBe(false);
  });

  test('trims and validates', () => {
    expect(validateEmail('  user@example.com  ').valid).toBe(true);
  });
});

// ─── validatePassword ───────────────────────────────────────────────────────

describe('validatePassword', () => {
  test('empty string is invalid', () => {
    const result = validatePassword('');
    expect(result.valid).toBe(false);
    expect(result.strength).toBe('none');
    expect(result.error).toContain('required');
  });

  test('non-string is invalid', () => {
    expect(validatePassword(null).valid).toBe(false);
    expect(validatePassword(123).valid).toBe(false);
  });

  test('too short (< 8 chars) is invalid', () => {
    const result = validatePassword('abc');
    expect(result.valid).toBe(false);
    expect(result.strength).toBe('weak');
    expect(result.error).toContain('8 characters');
  });

  test('exactly 8 chars lowercase only is weak', () => {
    const result = validatePassword('abcdefgh');
    expect(result.valid).toBe(true);
    expect(result.strength).toBe('weak');
  });

  test('lowercase + uppercase is fair', () => {
    const result = validatePassword('Abcdefgh');
    expect(result.valid).toBe(true);
    expect(result.strength).toBe('fair');
  });

  test('lowercase + uppercase + number is good', () => {
    const result = validatePassword('Abcdefg1');
    expect(result.valid).toBe(true);
    expect(result.strength).toBe('good');
  });

  test('all character types is strong', () => {
    const result = validatePassword('Abcdef1!');
    expect(result.valid).toBe(true);
    expect(result.strength).toBe('strong');
  });

  test('no error when valid', () => {
    expect(validatePassword('MySecure1!').error).toBeNull();
  });

  test('7 chars is too short', () => {
    expect(validatePassword('Ab1!xyz').valid).toBe(false);
  });
});

// ─── validateName ───────────────────────────────────────────────────────────

describe('validateName', () => {
  test('valid name', () => {
    const result = validateName('Jane Doe');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  test('name with hyphen is valid', () => {
    expect(validateName('Mary-Jane').valid).toBe(true);
  });

  test('name with apostrophe is valid', () => {
    expect(validateName("O'Brien").valid).toBe(true);
  });

  test('name with period is valid', () => {
    expect(validateName('Dr. Smith').valid).toBe(true);
  });

  test('empty string is invalid', () => {
    const result = validateName('');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('required');
  });

  test('non-string is invalid', () => {
    expect(validateName(123).valid).toBe(false);
    expect(validateName(null).valid).toBe(false);
  });

  test('single character is too short', () => {
    const result = validateName('A');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('2 characters');
  });

  test('exactly 2 chars is valid', () => {
    expect(validateName('Al').valid).toBe(true);
  });

  test('over 100 chars is invalid', () => {
    const longName = 'A'.repeat(101);
    const result = validateName(longName);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('100');
  });

  test('exactly 100 chars is valid', () => {
    const name = 'A'.repeat(100);
    expect(validateName(name).valid).toBe(true);
  });

  test('name with numbers is invalid', () => {
    expect(validateName('John123').valid).toBe(false);
  });

  test('name with HTML tags is invalid', () => {
    expect(validateName('<script>alert</script>').valid).toBe(false);
  });

  test('name with SQL injection is invalid', () => {
    expect(validateName("'; DROP TABLE users; --").valid).toBe(false);
  });

  test('whitespace-only is invalid', () => {
    expect(validateName('   ').valid).toBe(false);
  });
});

// ─── Constants ──────────────────────────────────────────────────────────────

describe('Security Constants', () => {
  test('CSP_DIRECTIVES has required directive keys', () => {
    expect(CSP_DIRECTIVES).toHaveProperty('default-src');
    expect(CSP_DIRECTIVES).toHaveProperty('script-src');
    expect(CSP_DIRECTIVES).toHaveProperty('style-src');
    expect(CSP_DIRECTIVES).toHaveProperty('font-src');
    expect(CSP_DIRECTIVES).toHaveProperty('img-src');
    expect(CSP_DIRECTIVES).toHaveProperty('connect-src');
  });

  test('CSP default-src is self', () => {
    expect(CSP_DIRECTIVES['default-src']).toContain("'self'");
  });

  test('RATE_LIMITS has required keys', () => {
    expect(RATE_LIMITS.maxRequestsPerMinute).toBe(60);
    expect(RATE_LIMITS.maxLoginAttempts).toBe(5);
    expect(RATE_LIMITS.lockoutDurationMs).toBe(15 * 60 * 1000);
  });

  test('lockout duration is 15 minutes in ms', () => {
    expect(RATE_LIMITS.lockoutDurationMs).toBe(900000);
  });
});

describe('generateCSP', () => {
  test('generates valid CSP string', () => {
    const { generateCSP } = require('@/lib/security');
    const csp = generateCSP();
    expect(typeof csp).toBe('string');
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain(";");
  });
});

describe('RateLimiter', () => {
  const { RateLimiter } = require('@/lib/security');

  beforeEach(() => {
    localStorage.clear();
  });

  test('allows attempts within limit', () => {
    const limiter = new RateLimiter('test', 3, 1000);
    expect(limiter.checkLimit().allowed).toBe(true);
    limiter.recordAttempt();
    expect(limiter.checkLimit().allowed).toBe(true);
    limiter.recordAttempt();
    expect(limiter.checkLimit().allowed).toBe(true);
  });

  test('blocks attempts exceeding limit', () => {
    const limiter = new RateLimiter('test_block', 2, 5000);
    limiter.recordAttempt();
    limiter.recordAttempt();
    const result = limiter.checkLimit();
    expect(result.allowed).toBe(false);
    expect(result.remainingMs).toBeGreaterThan(0);
    expect(result.message).toContain('Too many attempts');
  });

  test('resets after lockout duration', () => {
    jest.useFakeTimers();
    const limiter = new RateLimiter('test_reset', 1, 5000);
    limiter.recordAttempt();
    expect(limiter.checkLimit().allowed).toBe(false);
    
    // Advance time past lockout
    jest.advanceTimersByTime(5001);
    
    expect(limiter.checkLimit().allowed).toBe(true);
    jest.useRealTimers();
  });

  test('reset method clears state', () => {
    const limiter = new RateLimiter('test_clear', 1, 5000);
    limiter.recordAttempt();
    expect(limiter.checkLimit().allowed).toBe(false);
    limiter.reset();
    expect(limiter.checkLimit().allowed).toBe(true);
  });

  test('handles localStorage exceptions', () => {
    // Mock localStorage to throw
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = jest.fn(() => { throw new Error('Quota exceeded'); });
    
    const limiter = new RateLimiter('test_error', 2, 5000);
    // Should not throw
    limiter.recordAttempt();
    expect(limiter.checkLimit().allowed).toBe(true);
    
    Storage.prototype.setItem = originalSetItem;
  });
});
