import React from "react";
import styles from "./Input.module.css";

export type InputVariant = "default" | "chat";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
}

export const Input: React.FC<InputProps> = ({
  variant = "default",
  className = "",
  style,
  ...rest
}) => {
  const variantClass = variant === "chat" ? styles.chat : styles.default;
  const cls = [styles.root, variantClass, className].filter(Boolean).join(" ");

  return <input className={cls} style={style} {...rest} />;
};

export default Input;
