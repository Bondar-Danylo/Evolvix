import { useForm } from "react-hook-form";
import styles from "./AddEmployeePopup.module.scss";
import Button from "@/components/Button/Button";
import closeIcon from "@/assets/close_icon.svg";
import { useEffect } from "react";
import type { IAddEmployeeInput, IProps } from "./IAddEmployeePopup.types";

const AddEmployeePopup = ({ closePopup, onSuccess, editData }: IProps) => {
  const isEdit = !!editData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IAddEmployeeInput>({
    mode: "onTouched",
  });

  useEffect(() => {
    if (editData) {
      reset({
        firstName: editData.first_name,
        lastName: editData.last_name,
        email: editData.email,
        phone: editData.phone,
        department: editData.department,
        position: editData.position,
        startDate: editData.start_date,
        role: editData.role,
      });
    }
  }, [editData, reset]);

  const onSubmit = async (data: IAddEmployeeInput) => {
    const url = isEdit
      ? `${import.meta.env.VITE_API_URL}/update_user.php`
      : `${import.meta.env.VITE_API_URL}/add_user.php`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { ...data, id: editData.id } : data),
      });

      const result = await response.json();
      if (result.success) {
        onSuccess();
        closePopup();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Server error. Please check your connection.");
    }
  };

  return (
    <div className={styles.overlay} onClick={closePopup}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>{isEdit ? "Edit Employee" : "Add New Employee"}</h2>
          <button className={styles.closeBtn} onClick={closePopup}>
            <img src={closeIcon} alt="close" />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.grid}>
            {/* First Name */}
            <div className={styles.field}>
              <label>First Name</label>
              <input
                {...register("firstName", {
                  required: "Required",
                  minLength: { value: 2, message: "Min 2 symbols" },
                })}
                placeholder="John"
                className={errors.firstName ? styles.errorInput : ""}
              />
              {errors.firstName && (
                <small className={styles.errorText}>
                  {errors.firstName.message}
                </small>
              )}
            </div>

            {/* Last Name */}
            <div className={styles.field}>
              <label>Last Name</label>
              <input
                {...register("lastName", {
                  required: "Required",
                  minLength: { value: 2, message: "Min 2 symbols" },
                })}
                placeholder="Doe"
                className={errors.lastName ? styles.errorInput : ""}
              />
              {errors.lastName && (
                <small className={styles.errorText}>
                  {errors.lastName.message}
                </small>
              )}
            </div>

            {/* Department */}
            <div className={styles.field}>
              <label>Department</label>
              <input
                {...register("department", {
                  required: "Required",
                  setValueAs: (v) => v.trim(),
                })}
                placeholder="Housekeeping"
                className={errors.department ? styles.errorInput : ""}
              />
              {errors.department && (
                <small className={styles.errorText}>
                  {errors.department.message}
                </small>
              )}
            </div>

            {/* Position */}
            <div className={styles.field}>
              <label>Position</label>
              <input
                {...register("position", { required: "Required" })}
                placeholder="Manager"
                className={errors.position ? styles.errorInput : ""}
              />
              {errors.position && (
                <small className={styles.errorText}>
                  {errors.position.message}
                </small>
              )}
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label>Email Address</label>
              <input
                type="email"
                {...register("email", {
                  required: "Required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email",
                  },
                })}
                placeholder="john@evolvix.com"
                className={errors.email ? styles.errorInput : ""}
              />
              {errors.email && (
                <small className={styles.errorText}>
                  {errors.email.message}
                </small>
              )}
            </div>

            {/* Phone */}
            <div className={styles.field}>
              <label>Phone Number</label>
              <input
                type="tel"
                minLength={8}
                {...register("phone", {
                  required: "Required",
                  pattern: {
                    value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g,
                    message: "Invalid format",
                  },
                })}
                placeholder="+1 234 567"
                className={errors.phone ? styles.errorInput : ""}
              />
              {errors.phone && (
                <small className={styles.errorText}>
                  {errors.phone.message}
                </small>
              )}
            </div>

            {/* Start Date */}
            <div className={styles.field}>
              <label>Start Date</label>
              <input
                type="date"
                {...register("startDate", { required: "Required" })}
                className={errors.startDate ? styles.errorInput : ""}
              />
              {errors.startDate && (
                <small className={styles.errorText}>
                  {errors.startDate.message}
                </small>
              )}
            </div>

            {/* Password */}
            {!isEdit && (
              <div className={styles.field}>
                <label>Initial Password</label>
                <input
                  type="text"
                  {...register("password", {
                    required: "Required",
                    minLength: { value: 6, message: "Min 6 symbols" },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message: "Need 1 uppercase & 1 digit",
                    },
                  })}
                  placeholder="Secret123"
                  className={errors.password ? styles.errorInput : ""}
                />
                {errors.password && (
                  <small className={styles.errorText}>
                    {errors.password.message}
                  </small>
                )}
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={closePopup}
            >
              Cancel
            </button>
            <Button type="submit" color="blue" size="medium">
              {isEdit ? "Save Changes" : "Create Employee"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeePopup;
