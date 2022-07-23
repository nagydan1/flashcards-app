import { getValidationClassName } from './validation';

function InputField(
  {
    icon,
    id,
    name,
    type,
    value = '',
    placeholder,
    handleOnChange,
    errorMessages = [],
    wasValidated = false,
    mbNone,
  },
) {
  return (
    <div className={`d-flex flex-row align-items-center ${!mbNone && 'mb-4'}`}>
      <div className=" p-1">
        {icon}
      </div>
      <div className="form-outline flex-fill mb-0">
        <input
          className={`form-control ${getValidationClassName(errorMessages, wasValidated)}`}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={handleOnChange}
          placeholder={placeholder}
        />
        <div className="invalid-feedback">
          {errorMessages.length > 0 && errorMessages[0]}
        </div>
      </div>
    </div>
  );
}

export default InputField;
