import React from "react";

const Select = ({ name, label, error, options, ...res }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>
        {label}
        <select {...res} name={name} id={name} className="type form-control">
          <option value="" />
          {options.map(o => (
            <option value={o._id} key={o._id}>
              {o.name}
            </option>
          ))}
        </select>
      </label>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Select;
