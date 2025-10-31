import React from "react";
import styles from "./Typography.module.css";

interface CommonProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const H1: React.FC<CommonProps> = ({
  children,
  className = "",
  style,
}) => (
  <h1 className={`${styles.h1} ${styles.root} ${className}`} style={style}>
    {children}
  </h1>
);

export const H2: React.FC<CommonProps> = ({
  children,
  className = "",
  style,
}) => (
  <h2 className={`${styles.h2} ${styles.root} ${className}`} style={style}>
    {children}
  </h2>
);

export const Body: React.FC<CommonProps> = ({
  children,
  className = "",
  style,
}) => (
  <p className={`${styles.body} ${styles.root} ${className}`} style={style}>
    {children}
  </p>
);

export const Label: React.FC<CommonProps> = ({
  children,
  className = "",
  style,
}) => (
  <span className={`${styles.label} ${styles.root} ${className}`} style={style}>
    {children}
  </span>
);

export const Muted: React.FC<CommonProps> = ({
  children,
  className = "",
  style,
}) => (
  <span className={`${styles.muted} ${styles.root} ${className}`} style={style}>
    {children}
  </span>
);

export const Small: React.FC<CommonProps> = ({
  children,
  className = "",
  style,
}) => (
  <small
    className={`${styles.small} ${styles.root} ${className}`}
    style={style}
  >
    {children}
  </small>
);

export const ButtonText: React.FC<CommonProps> = ({
  children,
  className = "",
  style,
}) => (
  <span
    className={`${styles.buttonText} ${styles.root} ${className}`}
    style={style}
  >
    {children}
  </span>
);

const Typography = { H1, H2, Body, Label, Muted, Small, ButtonText };
export default Typography;
