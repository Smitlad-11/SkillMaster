/**
 * Validates password strength
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character
 * 
 * @param {string} password 
 * @returns {object} { isValid: boolean, message: string }
 */
const validatePassword = (password) => {
  if (!password) return { isValid: false, message: 'Password is required' };
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  // Checking for special characters (not alphanumeric)
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (e.g., !@#$%^&*)' };
  }
  
  return { isValid: true, message: '' };
};

module.exports = validatePassword;
