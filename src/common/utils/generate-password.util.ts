export const generatePassword = (
  minLength: number,
  minLowercase: number,
  minNumbers: number,
  minSymbols: number,
  minUppercase: number,
): string => {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

  const passwordChars: string[] = [];

  // Helper function to get random character from a string
  const getRandomChar = (charset: string) =>
    charset[Math.floor(Math.random() * charset.length)];

  // Add the minimum required lowercase characters
  for (let i = 0; i < minLowercase; i++) {
    passwordChars.push(getRandomChar(lowercaseChars));
  }

  // Add the minimum required uppercase characters
  for (let i = 0; i < minUppercase; i++) {
    passwordChars.push(getRandomChar(uppercaseChars));
  }

  // Add the minimum required numbers
  for (let i = 0; i < minNumbers; i++) {
    passwordChars.push(getRandomChar(numberChars));
  }

  // Add the minimum required symbols
  for (let i = 0; i < minSymbols; i++) {
    passwordChars.push(getRandomChar(symbolChars));
  }

  // Fill the rest of the password length with random characters from all sets
  const allChars = lowercaseChars + uppercaseChars + numberChars + symbolChars;
  while (passwordChars.length < minLength) {
    passwordChars.push(getRandomChar(allChars));
  }

  // Shuffle the array to ensure random distribution
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  // Join the array into a string
  return passwordChars.join('');
};
