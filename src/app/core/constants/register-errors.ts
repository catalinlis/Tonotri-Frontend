export const REGISTER_ERRORS: Record<string, Record<string, string>> = {
    username: {
      required:  'Username is required.',
      minlength: 'Username requires at least 6 characters.',
      maxlength: 'Username allows maximum 20 characters.',
      pattern:   'Username could contain just letters, numbers, dots and hyphens.',
    },
    first_name: {
      required:  'First name is required.',
      minlength: 'First name requires at least 2 characters.',
      maxlength: 'First name can be maximum 20 characters.',
      pattern: 'First name can have just letters or hyphen in between.'
    },
    last_name: {
      required:  'Last name is required.',
      minlength: 'Last name requires at least 2 characters.',
      maxlength: 'Last name can be maximum 20 characters.',
      pattern: 'Last name can have just letters or hyphen in between.'
    },
    email: {
      required: 'Email is required.',
      email:    'Enter a valid email address.',
    },
    birthday: {
      required:    'Date of birth is required.',
      invalidDate: 'Please enter a valid date of birth.',
      futureDate:  'Date of birth cannot be in the future.',
      underage:    'You must be at least 18 years old.',
    },
    gender: {
      required: 'You must select gender.',
    },
    password1: {
      required:  'Password is required.',
      minlength: 'Password requires at least 8 characters.',
      pattern:   'Password must contain at least one uppercase letter and one number.',
    },
    password2: {
      required: 'Please confirm your password.',
    },
    form: {
        passwordMismatch: 'Passwords do not match.',
    }
  };