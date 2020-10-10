import React from "react";

const Select = ({ name, lbl, options, error, idprop, propvalue, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{lbl}</label>
      <select {...rest} name={name} id={name} className="form-control">
        <option value=" sd" />
        {options.map(option => (
          <option key={option[idprop]} value={option[idprop]}>
            {option[propvalue]}
          </option>
        ))}
      </select>
      {error && <div className="alert alert-danger">{error} </div>}
    </div>
  );
};

export default Select;
