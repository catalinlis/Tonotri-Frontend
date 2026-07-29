export const CONFIRM_TOKEN_ERRORS: Record<string, Record<string, string>> = {
    code: {
      required: 'Confirmation code is required.',
      pattern: 'Confirmation code has to be 6-digits.'
    }
  };