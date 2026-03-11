import { useForm } from "react-hook-form";
import styles from "./LoginPage.module.scss";
import emailIcon from "@/assets/email.svg";
import padlockIcon from "@/assets/padlock.svg";
import LoginInput from "@/components/LoginInput/LoginInput";
import VerticalLogo from "@/components/VerticalLogo/VerticalLogo";
import Button from "@/components/Button/Button";
import type { ILoginPage, ILoginPageProps } from "./ILoginPage.types";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useState } from "react";
import SmallPopup from "@/components/SmallPopup/SmallPopup";
import attentionIcon from "@/assets/attention-triangle_icon.svg";

const LoginPage = ({ setRole }: ILoginPageProps) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const navigate: NavigateFunction = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ILoginPage>();

  const onSubmit = async (data: ILoginPage): Promise<void> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("userRole", result.user.role);
        localStorage.setItem("isAuth", "true");
        setRole(result.user.role);
        result.user.role === "admin"
          ? navigate("/dashboard")
          : navigate("/topics");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error");
    }
  };

  const handleResetPassword = async (): Promise<void> => {
    const email = getValues("email");

    if (!email || errors.email) {
      alert("Please enter a valid email address first.");
      setShowPopup(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/evolvix-api/reset-password.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const result = await response.json();

      if (result.success) {
        alert("Success! Check your email for the new password.");
        console.log("DEBUG: New Password is", result.newPassword);
        alert(
          `[DEBUG MODE]: Check console log for new password.\nNew password: ${result.newPassword}`,
        );

        setShowPopup(false);
      } else {
        alert(result.message);
        setShowPopup(false);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Connection error. Try again later.");
      setShowPopup(false);
    }
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

            <button
              type="reset"
              className={styles.buttons__reset}
              onClick={(): void => setShowPopup(true)}
            >
              Forgot password?
            </button>
          </div>
        </form>
      </div>
      {showPopup && (
        <SmallPopup
          icon={attentionIcon}
          title="Would you like to reset password?"
          subtitle="You will receive new password via email"
          text="This action cannot be undone"
          closePopup={(): void => setShowPopup(false)}
          onConfirm={handleResetPassword}
        />
      )}
    </main>
  );
};

export default LoginPage;
