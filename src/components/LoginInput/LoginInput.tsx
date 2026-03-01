import styles from "./LoginInput.module.scss";
import type { LoginInputProps } from "./ILoginInput.types";

const LoginInput = ({
  icon,
  text,
  type,
  register,
  error,
  required = true,
}: LoginInputProps) => {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.icon}>
          <img src={icon} alt={`${text} Icon`} />
        </div>
        <input
          {...register}
          type={type}
          className={`${styles.input} ${error ? styles.error : ""}`}
          placeholder={text}
          required={required}
        />
      </div>
      {error && (
        <span role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </>
  );
};

export default LoginInput;
