import React from 'react';

const Input = React.forwardRef((props, ref) => {
  const handleOnChange = (event) => props.setter(event.target.value);

  return (
    <div className={`d-flex flex-row align-items-center ${!props.mbNone && 'mb-4'}`}>
      {props.icon}
      <div className="form-outline flex-fill mb-0">
        <input
          ref={ref}
          type={props.type}
          id={props.id}
          className="form-control"
          onChange={props.onChange || handleOnChange}
          placeholder={props.placeholder}
          name={props.name}
          data-testid={props['data-testid']}
          value={props.value}
        />
      </div>
    </div>
  );
});

export default Input;
