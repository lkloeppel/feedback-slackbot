export const validateUser = (users: any[], text: string) => {
  if (!text.startsWith('@')) {
    return {
      isValid: false,
      errorMessage: 'Please specify a colleague you want to give regular feedback for'
    };
  }

  const username = text.replace('@', '');

  const user = users.find(u => u.name === username);

  if (!user) {
    return {
      isValid: false,
      errorMessage: 'User not found'
    };
  }

  return {
    isValid: true,
    user
  };
};
