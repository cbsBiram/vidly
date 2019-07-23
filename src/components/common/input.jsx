import React from "react";

const Input = ({ name, label, error, ...res }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>
        {label}
        <input {...res} name={name} id={name} className="type form-control" />
      </label>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
