export const LOGIN_ERRORS: Record<string, Record<string, string>> = {
    login: {
      required: 'Username is required.'
    },
    password: {
      required: 'Password is required.'  
    },
    backend: {
      credentials: 'Incorrect username or password.'
    }
  };