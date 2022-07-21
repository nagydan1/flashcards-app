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
  },
) {
  return (
    <div className="mb-3">
      <div className="d-flex flex-row align-items-start">
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
    </div>
  );
}

export default InputField;
