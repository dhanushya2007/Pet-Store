import React from "react";

function FormField({ id, label, type = "text", value, onChange, placeholder, required, rows }) {
  return (
    <label htmlFor={id} className="form-label">
      {label}
      {type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 4}
          required={required}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </label>
  );
}

export default FormField;
