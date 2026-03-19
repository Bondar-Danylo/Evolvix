import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import styles from "./AddTopicPopup.module.scss";
import Button from "@/components/Button/Button";
import closeIcon from "@/assets/close_icon.svg";

interface AddTopicPopupProps {
  closePopup: () => void;
  onSuccess: () => void;
  editData?: any;
}

const AddTopicPopup = ({
  closePopup,
  onSuccess,
  editData,
}: AddTopicPopupProps) => {
  const isEdit: boolean = !!editData;
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const selectedFile = watch("image_file");

  useEffect(() => {
    if (editData) {
      reset({
        title: editData.title || editData.name,
        department: editData.department,
        content: editData.content,
      });
      if (editData.image_url) {
        setPreview(editData.image_url);
      }
    } else {
      reset({ title: "", department: "", content: "" });
      setPreview(null);
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editData, reset]);

  useEffect(() => {
    if (selectedFile && selectedFile.length > 0) {
      const file = selectedFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const onSubmit = async (data: any) => {
    const url = isEdit ? "update_topic.php" : "add_topic.php";
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("department", data.department);
    formData.append("content", data.content);

    if (isEdit) formData.append("id", editData.id);
    if (data.image_file?.[0]) {
      formData.append("image_file", data.image_file[0]);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/${url}`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        onSuccess();
        closePopup();
      } else {
        alert(result.message);
      }
    } catch (e) {
      alert("Network error");
    }
  };

  return (
    <div className={styles.overlay} onClick={closePopup}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>{isEdit ? "Edit Topic" : "Create New Topic"}</h2>
          <button
            type="button"
            onClick={closePopup}
            className={styles.closeBtn}
          >
            <img src={closeIcon} alt="close" />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label>Topic Title</label>
            <input
              {...register("title", { required: "Required" })}
              placeholder="Enter title..."
              className={errors.title ? styles.errorInput : ""}
            />
          </div>

          <div className={styles.field}>
            <label>Department</label>
            <input
              {...register("department", { required: "Required" })}
              placeholder="Housekeeping"
              className={errors.department ? styles.errorInput : ""}
            />
          </div>

          <div className={styles.field}>
            <label>Topic Image</label>
            <div className={styles.fileUpload}>
              {preview && (
                <div className={styles.previewWrapper}>
                  <img src={preview} alt="Preview" className={styles.preview} />
                </div>
              )}
              <input
                type="file"
                id="topic-image"
                accept="image/*"
                {...register("image_file")}
                className={styles.hiddenInput}
              />
              <label htmlFor="topic-image" className={styles.fileLabel}>
                {preview ? "Change Image" : "Upload Image"}
              </label>
            </div>
          </div>

          <div className={styles.field}>
            <label>Full Content</label>
            <textarea
              {...register("content", { required: "Required" })}
              placeholder="Detailed information..."
              className={styles.textarea}
            />
          </div>
        </form>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={closePopup}
          >
            Cancel
          </button>
          <Button type="submit" color="blue" onClick={handleSubmit(onSubmit)}>
            {isEdit ? "Save Changes" : "Create Topic"}
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default AddTopicPopup;
