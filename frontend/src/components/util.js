function getValidationClassName(errorMessage, wasValidated) {
  let className = '';
  const isValid = errorMessage.length === 0;
  if (wasValidated) {
    if (isValid) {
      className = 'is-valid';
    } else {
      className = 'is-invalid';
    }
  }
  return className;
}

export default getValidationClassName;
