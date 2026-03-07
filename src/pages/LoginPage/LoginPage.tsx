import { useForm } from "react-hook-form";
import styles from "./LoginPage.module.scss";
import emailIcon from "@/assets/email.svg";
import padlockIcon from "@/assets/padlock.svg";
import LoginInput from "@/components/LoginInput/LoginInput";
import VerticalLogo from "@/components/VerticalLogo/VerticalLogo";
import Button from "@/components/Button/Button";
import type { ILoginPage, ILoginPageProps } from "./ILoginPage.types";
import { useNavigate, type NavigateFunction } from "react-router-dom";

const LoginPage = ({ role, setRole }: ILoginPageProps) => {
  const navigate: NavigateFunction = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginPage>();

  const onSubmit = (data: ILoginPage) => {
    console.log(data);
    setRole("user");
    role === "admin" ? navigate("/dashboard") : navigate("/topics");
  };

  return (
    <main>
      <div className={styles.wrapper}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <VerticalLogo />

          <div className={styles.main}>
            <LoginInput
              text="Email"
              type="email"
              icon={emailIcon}
              required={true}
              register={register("email", {
                required: "Email required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Wrong email",
                },
              })}
              error={errors.email?.message}
            />

            <LoginInput
              text="Password"
              type="password"
              icon={padlockIcon}
              required={true}
              register={register("password", {
                required: "Password required",
                minLength: {
                  value: 6,
                  message: "Min 6 symbols",
                },
              })}
              error={errors.password?.message}
            />
          </div>

          <div className={styles.buttons}>
            <Button type="submit" color="blue" size="large">
              LOGIN
            </Button>

            <button type="reset" className={styles.buttons__reset}>
              Forgot password?
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
