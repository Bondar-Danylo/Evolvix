import { useEffect, useRef, type JSX } from "react";
import styles from "./LoadingPage.module.scss";
import { useNavigate } from "react-router-dom";

const LoadingPage: React.FC = (): JSX.Element => {
  const timeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const handleAnimation = (): void => {
    timeoutRef.current = setTimeout((): void => {
      navigate("/login");
    }, 500);
  };

  useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <main>
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <img src="/logo.png" alt="Logo" className={styles.logo} />
          <p className={styles.text} onAnimationEnd={handleAnimation}>
            Evolvix
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoadingPage;
