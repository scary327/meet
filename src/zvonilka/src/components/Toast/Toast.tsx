import { memo, useEffect, useState } from "react";
import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const Toast = memo(
  ({ message, duration = 3000, onClose }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
      <div
        className={`${styles.toast} ${
          isVisible ? styles.visible : styles.hidden
        }`}
      >
        <p>{message}</p>
      </div>
    );
  }
);

Toast.displayName = "Toast";
