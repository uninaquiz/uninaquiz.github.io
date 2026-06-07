import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input: React.FC<InputProps> = ({ label, id, style, onFocus, onBlur, ...rest }) => {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#00FF87";
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#1e3060";
    onBlur?.(e);
  };

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: "block",
            fontSize: "0.75rem",
            fontWeight: 700,
            marginBottom: "6px",
            letterSpacing: "0.1em",
            color: "#00FF87",
          }}
        >
          {label}
        </label>
      )}
      <input
        {...rest}
        id={id}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "#0f1d40",
          border: "1px solid #1e3060",
          borderRadius: "8px",
          color: "#fff",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "0.875rem",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
          ...style,
        }}
      />
    </div>
  );
};
