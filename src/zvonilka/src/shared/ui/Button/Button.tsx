// src/components/Button.tsx
import React, { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";
type ButtonShape = "default" | "circle";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  children: React.ReactNode;
  "aria-label"?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      shape = "default",
      children,
      disabled = false,
      className = "",
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const baseClasses = `${styles.button} ${styles[variant]} ${styles[size]} ${styles[shape]}`;
    const computedClassName = `${baseClasses} ${className}`.trim();

    return (
      <button
        ref={ref}
        className={computedClassName}
        disabled={disabled}
        aria-disabled={disabled}
        aria-label={
          ariaLabel || (typeof children === "string" ? children : undefined)
        }
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
