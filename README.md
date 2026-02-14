# Password Strength Analyzer 🔐

A modern, professional password strength analyzer with advanced mathematical analysis and real-time feedback.

## Features ✨

- **Advanced Mathematical Analysis**: Uses entropy calculation, charset analysis, and uniqueness scoring
- **Pattern Detection**: Detects sequential numbers, letters, keyboard patterns, dictionary words, and date patterns
- **Real-time Feedback**: Professional color-coded feedback system (✓ Info, ⚠ Warning, ✗ Error)
- **Security Metrics**: Displays entropy bits, crack time estimation, charset size, and character uniqueness
- **Beautiful UI**: Dark theme with green and purple accents, smooth animations, and typing effects
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Live Demo 🚀

You can host this on GitHub Pages:

1. Upload all files to your repository
2. Go to repository Settings → Pages
3. Select main branch as source
4. Your site will be live at `https://yourusername.github.io/repository-name`

## Files 📁

- `index.html` - Main HTML structure
- `style.css` - All styling and animations
- `script.js` - Password analysis logic and UI interactions
- `README.md` - This file

## How It Works 🔬

### Scoring System (0-100 points)

1. **Length** (0-25 points): Rewards longer passwords, with bonuses for 12+ and 16+ characters
2. **Character Diversity** (0-25 points): Scores based on use of lowercase, uppercase, numbers, and special characters
3. **Uniqueness** (0-15 points): Measures ratio of unique characters to total characters
4. **Entropy** (0-25 points): Calculates cryptographic strength using `log2(charset^length)`
5. **Pattern Penalties**: Deducts points for detected weaknesses

### Strength Levels

- **WEAK** (0-29): Red - Vulnerable to attacks
- **MEDIUM** (30-54): Orange - Basic security
- **STRONG** (55-74): Yellow - Good protection
- **VERY STRONG** (75-100): Green - Excellent security

### Pattern Detection

- Sequential numbers (123, 456)
- Sequential letters (abc, xyz)
- Repeated patterns (123123, abcabc)
- Keyboard patterns (qwerty, asdfgh)
- Common dictionary words (password, admin)
- Date patterns (years, dates)
- Character repetition (aaaa, 1111)

## Usage 💡

1. Enter your password in the input field
2. Click "Analyze Password" or press Enter
3. View your security score and detailed feedback
4. Review entropy metrics and crack time estimation
5. Follow recommendations to improve password strength

## Technical Details 🛠️

- **Pure JavaScript**: No frameworks or libraries required
- **CSS Animations**: Smooth transitions and effects
- **Responsive**: Mobile-first design approach
- **Accessible**: Keyboard navigation support
- **Performance**: Instant analysis with no server calls

## Browser Support 🌐

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Security Note 🔒

This analyzer runs entirely in your browser. No passwords are sent to any server or stored anywhere. Your password never leaves your device.

## License 📄

© 2026 Password Analyzer. All Rights Reserved.

## Contributing 🤝

Feel free to fork this project and submit pull requests for improvements!

---

Made with ❤️ for better password security
