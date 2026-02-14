// Typing effect for subtitle
const typingText = document.getElementById('typingText');
const text = 'Enter your password below to evaluate its security strength and receive detailed feedback';
let charIndex = 0;

function typeWriter() {
    if (charIndex < text.length) {
        typingText.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 30);
    } else {
        typingText.style.borderRight = 'none';
    }
}

// Start typing effect after a brief delay
setTimeout(typeWriter, 1000);

const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultContainer = document.getElementById('resultContainer');
const strengthLabel = document.getElementById('strengthLabel');
const strengthBar = document.getElementById('strengthBar');

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
});

// Analyze password on button click
analyzeBtn.addEventListener('click', analyzePassword);

// Also analyze on Enter key
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        analyzePassword();
    }
});

function analyzePassword() {
    const password = passwordInput.value;
    
    if (password.length === 0) {
        return;
    }

    // Calculate entropy and charset
    const charsetSize = calculateCharsetSize(password);
    const entropy = Math.log2(Math.pow(charsetSize, password.length));
    
    // Calculate uniqueness (unique chars / total chars)
    const uniqueChars = new Set(password).size;
    const uniqueness = Math.round((uniqueChars / password.length) * 100);

    // Detect patterns and weaknesses
    const feedback = [];
    let score = 0;
    
    // Length scoring (0-25 points)
    if (password.length < 8) {
        feedback.push({ type: 'error', text: 'Password is too short. Minimum recommended length is 12 characters.' });
        score += password.length * 2;
    } else if (password.length < 12) {
        feedback.push({ type: 'warning', text: 'Password length is acceptable but could be stronger with 12+ characters.' });
        score += 15 + (password.length - 8) * 2;
    } else if (password.length < 16) {
        feedback.push({ type: 'info', text: 'Good password length. Excellent protection against brute force attacks.' });
        score += 20 + (password.length - 12);
    } else {
        feedback.push({ type: 'info', text: 'Excellent password length. Maximum protection achieved.' });
        score += 25;
    }

    // Detect common patterns and sequences
    const patterns = detectPatterns(password);
    if (patterns.length > 0) {
        patterns.forEach(pattern => {
            feedback.push({ type: 'error', text: pattern });
            score -= 15;
        });
    }

    // Character diversity scoring (0-25 points)
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
    
    let diversityScore = 0;
    const charTypes = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (charTypes === 1) {
        feedback.push({ type: 'error', text: 'Uses only one character type. Mix uppercase, lowercase, numbers, and symbols.' });
        diversityScore = 5;
    } else if (charTypes === 2) {
        feedback.push({ type: 'warning', text: 'Limited character diversity. Add more character types for better security.' });
        diversityScore = 12;
    } else if (charTypes === 3) {
        feedback.push({ type: 'info', text: 'Good character diversity across multiple types.' });
        diversityScore = 20;
    } else {
        feedback.push({ type: 'info', text: 'Excellent character diversity using all character types.' });
        diversityScore = 25;
    }
    score += diversityScore;

    // Uniqueness scoring (0-15 points)
    if (uniqueness < 50) {
        feedback.push({ type: 'error', text: 'Too many repeated characters detected. Use more unique characters.' });
        score += Math.round(uniqueness / 10);
    } else if (uniqueness < 70) {
        feedback.push({ type: 'warning', text: 'Moderate character repetition. Increase uniqueness for better security.' });
        score += 8 + Math.round((uniqueness - 50) / 5);
    } else {
        feedback.push({ type: 'info', text: 'High character uniqueness provides good randomness.' });
        score += 15;
    }

    // Entropy scoring (0-25 points)
    if (entropy < 28) {
        feedback.push({ type: 'error', text: 'Very low entropy. Password is vulnerable to brute force attacks.' });
        score += Math.round(entropy / 2);
    } else if (entropy < 50) {
        feedback.push({ type: 'warning', text: 'Moderate entropy. Consider increasing complexity.' });
        score += 14 + Math.round((entropy - 28) / 3);
    } else if (entropy < 70) {
        feedback.push({ type: 'info', text: 'Good entropy level. Strong resistance to brute force.' });
        score += 20 + Math.round((entropy - 50) / 5);
    } else {
        feedback.push({ type: 'info', text: 'Excellent entropy. Maximum cryptographic strength.' });
        score += 25;
    }

    // Dictionary word check
    if (containsCommonWords(password)) {
        feedback.push({ type: 'error', text: 'Contains common dictionary words. Avoid using recognizable words.' });
        score -= 20;
    }

    // Keyboard pattern check
    if (hasKeyboardPattern(password)) {
        feedback.push({ type: 'error', text: 'Contains keyboard patterns (e.g., qwerty, asdf). Use random combinations.' });
        score -= 15;
    }

    // Date pattern check
    if (hasDatePattern(password)) {
        feedback.push({ type: 'warning', text: 'Appears to contain date patterns. Avoid using birthdays or years.' });
        score -= 10;
    }

    // Bonus for length over 20
    if (password.length >= 20) {
        score += 10;
    }

    // Normalize score to 0-100
    score = Math.max(0, Math.min(100, score));

    // Calculate crack time
    const crackTime = calculateCrackTime(entropy);

    // Determine strength level
    let strengthLevel = '';
    let strengthText = '';
    
    if (score < 30) {
        strengthLevel = 'weak';
        strengthText = 'WEAK';
    } else if (score < 55) {
        strengthLevel = 'medium';
        strengthText = 'MEDIUM';
    } else if (score < 75) {
        strengthLevel = 'strong';
        strengthText = 'STRONG';
    } else {
        strengthLevel = 'very-strong';
        strengthText = 'VERY STRONG';
    }

    // Update UI
    updateUI(strengthLevel, strengthText, score, entropy, crackTime, charsetSize, uniqueness, feedback);
}

function calculateCharsetSize(password) {
    let size = 0;
    if (/[a-z]/.test(password)) size += 26;
    if (/[A-Z]/.test(password)) size += 26;
    if (/[0-9]/.test(password)) size += 10;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) size += 32;
    return size;
}

function detectPatterns(password) {
    const patterns = [];
    const lower = password.toLowerCase();
    
    // Sequential numbers
    const numberSequences = ['0123', '1234', '2345', '3456', '4567', '5678', '6789', '9876', '8765', '7654', '6543', '5432', '4321', '3210'];
    if (numberSequences.some(seq => lower.includes(seq))) {
        patterns.push('Contains sequential numbers (e.g., 123, 456). Avoid predictable sequences.');
    }
    
    // Sequential letters
    const letterSequences = ['abcd', 'bcde', 'cdef', 'defg', 'efgh', 'fghi', 'ghij', 'dcba', 'edcb', 'fedc'];
    if (letterSequences.some(seq => lower.includes(seq))) {
        patterns.push('Contains sequential letters (e.g., abc, xyz). Use random character combinations.');
    }
    
    // Repeated patterns
    const repeated = /(.{2,})\1{2,}/.test(password);
    if (repeated) {
        patterns.push('Contains repeated patterns (e.g., 123123, abcabc). Avoid repetition.');
    }
    
    // Same character repeated
    if (/(.)\1{3,}/.test(password)) {
        patterns.push('Contains repeated characters (e.g., aaaa, 1111). Avoid using same character multiple times.');
    }
    
    return patterns;
}

function containsCommonWords(password) {
    const commonWords = ['password', 'admin', 'user', 'login', 'welcome', 'letmein', 'monkey', 'dragon', 
                        'master', 'sunshine', 'princess', 'qwerty', 'trustno', 'batman', 'superman'];
    const lower = password.toLowerCase();
    return commonWords.some(word => lower.includes(word));
}

function hasKeyboardPattern(password) {
    const keyboardPatterns = ['qwerty', 'asdfgh', 'zxcvbn', 'qwertz', 'azerty', '!@#$%^', 'qweasd'];
    const lower = password.toLowerCase();
    return keyboardPatterns.some(pattern => lower.includes(pattern));
}

function hasDatePattern(password) {
    // Check for years 1900-2099
    const yearPattern = /(19|20)\d{2}/;
    // Check for date-like patterns
    const datePattern = /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/;
    return yearPattern.test(password) || datePattern.test(password);
}

function calculateCrackTime(entropy) {
    // Assuming 10 billion guesses per second
    const guessesPerSecond = 10000000000;
    const possibleCombinations = Math.pow(2, entropy);
    const seconds = possibleCombinations / (2 * guessesPerSecond); // Divide by 2 for average case
    
    if (seconds < 1) return 'Instant';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
    if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
    return `${(seconds / 31536000).toExponential(2)} years`;
}

function updateUI(strengthLevel, strengthText, score, entropy, crackTime, charsetSize, uniqueness, feedback) {
    // Update strength label
    strengthLabel.textContent = strengthText;
    strengthLabel.className = 'strength-label ' + strengthLevel;
    
    // Update strength bar
    strengthBar.className = 'strength-bar ' + strengthLevel;
    
    // Update score
    document.getElementById('scoreValue').textContent = `${Math.round(score)}/100`;
    
    // Update entropy metrics
    document.getElementById('entropyValue').textContent = `${Math.round(entropy)} bits`;
    document.getElementById('crackTime').textContent = crackTime;
    document.getElementById('charsetSize').textContent = charsetSize;
    document.getElementById('uniqueness').textContent = `${uniqueness}%`;
    
    // Update feedback
    const feedbackList = document.getElementById('feedbackList');
    feedbackList.innerHTML = '';
    
    feedback.forEach(item => {
        const div = document.createElement('div');
        div.className = 'detail-item';
        
        let icon = '';
        let iconClass = '';
        if (item.type === 'info') {
            icon = '✓';
            iconClass = 'info-icon';
        } else if (item.type === 'warning') {
            icon = '⚠';
            iconClass = 'warning-icon';
        } else {
            icon = '✗';
            iconClass = 'error-icon';
        }
        
        div.innerHTML = `
            <span class="detail-icon ${iconClass}">${icon}</span>
            <span>${item.text}</span>
        `;
        feedbackList.appendChild(div);
    });
    
    // Show results
    resultContainer.classList.add('show');
}
