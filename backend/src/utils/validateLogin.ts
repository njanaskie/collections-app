export const validateLogin = (usernameOrEmail: string, password: string) => {
  if (!usernameOrEmail) {
    return [
      {
        field: "usernameOrEmail",
        message: "Enter a username or email",
      },
    ];
  }

  if (usernameOrEmail.length <= 2) {
    return [
      {
        field: "usernameOrEmail",
        message: "Length must be greater than 2",
      },
    ];
  }

  if (!password) {
    return [
      {
        field: "password",
        message: "Enter a password",
      },
    ];
  }

  if (password.length <= 2) {
    return [
      {
        field: "password",
        message: "Length must be greater than 2",
      },
    ];
  }

  return null;
};
