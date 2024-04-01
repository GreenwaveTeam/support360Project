export const checkForSpecialCharacters = (str) => {
  const regex = /[!@#$%^&*(),.?":{}|<>]/;
  return !str.match(regex);
};
