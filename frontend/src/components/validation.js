import { isEmail, isStrongPassword } from 'validator';

function isNotEmpty(value = '') {
  return value !== '';
}

function isNotLongerThan20(value = '') {
  return value.length <= 20;
}

function isNotLongerThan100(value = '') {
  return value.length <= 100;
}

function isValidPassword(password) {
  return isStrongPassword(password, { minSymbols: 0 });
}

const validators = {
  firstName: [
    {
      fn: isNotEmpty,
      errorMessage: 'Field is required.',
    },
    {
      fn: isNotLongerThan20,
      errorMessage: 'Max. 20 characters.',
    },
  ],
  lastName: [
    {
      fn: isNotEmpty,
      errorMessage: 'Field is required.',
    },
    {
      fn: isNotLongerThan20,
      errorMessage: 'Max. 20 characters.',
    },
  ],
  email: [
    {
      fn: isNotEmpty,
      errorMessage: 'Field is required',
    },
    {
      fn: isEmail,
      errorMessage: 'Invalid e-mail address.',
    },
    {
      fn: isNotLongerThan100,
      errorMessage: 'Max. 100 characters.',
    },
  ],
  password: [
    {
      fn: isNotEmpty,
      errorMessage: 'Field is required',
    },
    {
      fn: isNotLongerThan100,
      errorMessage: 'Max. 100 characters.',
    },
    {
      fn: isValidPassword,
      errorMessage: 'Min. 8 characters, incl. 1 number, 1 uppercase and 1 lowercase letter.',
    },
  ],
  confirmPassword: [
    {
      fn: isNotEmpty,
      errorMessage: 'Field is required',
    },
    {
      fn: isNotLongerThan100,
      errorMessage: 'Max. 100 characters.',
    },
    {
      fn: isValidPassword,
      errorMessage: 'Min. 8 characters, incl. 1 number, 1 uppercase and 1 lowercase letter.',
    },
  ],
};

function getInputErrorMessages(inputName, inputValue) {
  const inputValidators = validators[inputName];
  const inputErrorMessages = inputValidators.map((inputValidator) => {
    const { fn: validatorFn, errorMessage: validatorErrorMessage } = inputValidator;
    const isValid = validatorFn(inputValue);
    return (isValid) ? '' : validatorErrorMessage;
  }).filter((errorMessage) => errorMessage !== '');
  return inputErrorMessages;
}

export function getFormErrorMessages(defaultFormData, formData) {
  let formErrorMessages = {};
  Object.keys(defaultFormData).forEach((inputName) => {
    formErrorMessages = {
      ...formErrorMessages,
      [inputName]: getInputErrorMessages(inputName, formData[inputName]),
    };
  });
  if (formData.confirmPassword !== formData.password) {
    formErrorMessages.confirmPassword.push('Passwords don\'t match. Try again.');
  }
  return formErrorMessages;
}

export function getValidationClassName(errorMessages, wasValidated) {
  let className = '';
  const isValid = errorMessages.length === 0;
  if (wasValidated) {
    if (isValid) {
      className = 'is-valid';
    } else {
      className = 'is-invalid';
    }
  }
  return className;
}

export function isFormValid(errorMessagesByInput) {
  const errorMessagesValues = Object.values(errorMessagesByInput);
  const fieldValidities = errorMessagesValues.map((errorMessages) => errorMessages.length === 0);
  const isValid = fieldValidities.every((fieldValidity) => fieldValidity);
  return isValid;
}
