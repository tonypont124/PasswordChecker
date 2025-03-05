
// DOM Elements
const passwordInput = document.getElementById('password-input');
const toggleVisibilityBtn = document.getElementById('toggle-visibility');
const eyeIcon = document.getElementById('eye-icon');
const strengthBar = document.getElementById('strength-bar');
const strengthLabel = document.getElementById('strength-label');
const lengthCheck = document.getElementById('length-check');
const uppercaseCheck = document.getElementById('uppercase-check');
const lowercaseCheck = document.getElementById('lowercase-check');
const numberCheck = document.getElementById('number-check');
const specialCheck = document.getElementById('special-check');
const suggestionsBox = document.getElementById('suggestions');

// Toggle password visibility
toggleVisibilityBtn.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.textContent = '👁️‍🗨️';
  } else {
    passwordInput.type = 'password';
    eyeIcon.textContent = '👁️';
  }
});

// Password evaluation
passwordInput.addEventListener('input', evaluatePassword);

function evaluatePassword() {
  const password = passwordInput.value;
  
  // Check requirements
  const hasLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  // Update requirement checks
  lengthCheck.textContent = hasLength ? '✅' : '❌';
  uppercaseCheck.textContent = hasUppercase ? '✅' : '❌';
  lowercaseCheck.textContent = hasLowercase ? '✅' : '❌';
  numberCheck.textContent = hasNumber ? '✅' : '❌';
  specialCheck.textContent = hasSpecial ? '✅' : '❌';
  
  // Calculate strength score (0-100)
  let score = 0;
  
  // Base points for length
  if (password.length > 0) {
    score += Math.min(password.length * 5, 30); // Max 30 points for length
  }
  
  // Points for character variety
  if (hasUppercase) score += 15;
  if (hasLowercase) score += 15;
  if (hasNumber) score += 15;
  if (hasSpecial) score += 25;
  
  // Calculate strength category and update UI
  updateStrengthUI(score);
  
  // Generate suggestions
  generateSuggestions(password, hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial);
}

function updateStrengthUI(score) {
  // Update strength bar width
  strengthBar.style.width = `${score}%`;
  
  // Update strength class and label
  strengthBar.className = 'strength-bar';
  
  let strengthText = '';
  if (score === 0) {
    strengthText = 'Strength: Empty';
  } else if (score < 25) {
    strengthBar.classList.add('very-weak');
    strengthText = 'Strength: Very Weak';
  } else if (score < 50) {
    strengthBar.classList.add('weak');
    strengthText = 'Strength: Weak';
  } else if (score < 70) {
    strengthBar.classList.add('medium');
    strengthText = 'Strength: Medium';
  } else if (score < 90) {
    strengthBar.classList.add('strong');
    strengthText = 'Strength: Strong';
  } else {
    strengthBar.classList.add('very-strong');
    strengthText = 'Strength: Very Strong';
  }
  
  strengthLabel.textContent = strengthText;
}

function generateSuggestions(password, hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial) {
  if (password.length === 0) {
    suggestionsBox.textContent = '';
    return;
  }
  
  let suggestions = [];
  
  if (!hasLength) {
    suggestions.push('Make your password at least 8 characters long.');
  }
  
  if (!hasUppercase) {
    suggestions.push('Add uppercase letters (A-Z).');
  }
  
  if (!hasLowercase) {
    suggestions.push('Add lowercase letters (a-z).');
  }
  
  if (!hasNumber) {
    suggestions.push('Add numbers (0-9).');
  }
  
  if (!hasSpecial) {
    suggestions.push('Add special characters (e.g., !@#$%^&*).');
  }
  
  // Check for common patterns
  if (/^[a-zA-Z]+$/.test(password)) {
    suggestions.push('Your password contains only letters. Add numbers and special characters.');
  }
  
  if (/^[0-9]+$/.test(password)) {
    suggestions.push('Your password contains only numbers. Add letters and special characters.');
  }
  
  if (/(.)\1{2,}/.test(password)) {
    suggestions.push('Avoid repeating characters (e.g., "aaa", "111").');
  }
  
  // Sequential characters check
  const sequences = ['abcdefghijklmnopqrstuvwxyz', '01234567890', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  for (const seq of sequences) {
    for (let i = 0; i < seq.length - 2; i++) {
      const fragment = seq.substring(i, i + 3);
      if (password.toLowerCase().includes(fragment)) {
        suggestions.push('Avoid sequential patterns like "abc", "123", or keyboard rows.');
        break;
      }
    }
  }
  
  // Display suggestions
  if (suggestions.length > 0) {
    suggestionsBox.innerHTML = '<strong>Suggestions:</strong><ul>' + 
      suggestions.map(suggestion => `<li>${suggestion}</li>`).join('') + 
      '</ul>';
  } else {
    suggestionsBox.innerHTML = '<strong>Great password!</strong> It meets all the recommended criteria.';
  }
}

// Initialize on page load
evaluatePassword();
