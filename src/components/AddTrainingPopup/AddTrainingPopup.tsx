import { useState, useRef } from "react";
import styles from "./AddTrainingPopup.module.scss";
import closeIcon from "@/assets/close_icon.svg";
import Button from "@/components/Button/Button";
import type {
  AddTrainingPopupProps,
  Question,
} from "./IAddTrainingPopup.types";

const AddTrainingPopup = ({
  closePopup,
  onSuccess,
  initialData,
}: AddTrainingPopupProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [dept, setDept] = useState(initialData?.department || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [image, setImage] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url
      ? `${import.meta.env.VITE_API_URL}/${initialData.image_url}`
      : null,
  );

  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions?.map((q) => ({
      ...q,
      answers: q.answers.map((a) => ({
        ...a,
        is_correct: Boolean(Number(a.is_correct)),
      })),
    })) || [],
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addQuestion = (): void => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        answers: [{ answer_text: "", is_correct: false }],
      },
    ]);
  };

  const addAnswer = (qIdx: number): void => {
    const newQs = [...questions];
    newQs[qIdx].answers.push({ answer_text: "", is_correct: false });
    setQuestions(newQs);
  };

  const toggleCorrect = (qIdx: number, aIdx: number): void => {
    const newQs = [...questions];
    newQs[qIdx].answers[aIdx].is_correct =
      !newQs[qIdx].answers[aIdx].is_correct;
    setQuestions(newQs);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!name || !dept || !description || questions.length === 0) {
      alert("Please fill all fields and add at least one question.");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // Если это редактирование, добавляем ID
    if (initialData?.id) {
      formData.append("id", initialData.id.toString());
    }

    formData.append("name", name);
    formData.append("department", dept);
    formData.append("description", description);
    if (image) formData.append("image", image);
    formData.append("questions", JSON.stringify(questions));

    // Выбираем эндпоинт в зависимости от режима
    const endpoint = initialData ? "update_training.php" : "save_training.php";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/${endpoint}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();
      if (result.success) {
        onSuccess();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={closePopup}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{initialData ? "Edit Training" : "New Training & Quiz"}</h2>
          <button onClick={closePopup} className={styles.closeBtn}>
            <img src={closeIcon} alt="close" />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.mainInfo}>
            <div
              className={styles.imageUpload}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={styles.preview}
                />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <span className={styles.icon}>📸</span>
                  <p>Upload Cover</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                hidden
              />
            </div>

            <div className={styles.textInputs}>
              <div className={styles.field}>
                <label>Training Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Health & Safety"
                />
              </div>
              <div className={styles.field}>
                <label>Department</label>
                <input
                  type="text"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  placeholder="e.g. Kitchen"
                />
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <label>Training Material</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste or write the learning material here..."
            />
          </div>

          <div className={styles.quizSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.quizTitle}>
                <h3>Quiz Builder</h3>
                <p className={styles.hint}>
                  Mark one or more answers as correct
                </p>
              </div>
            </div>

            {questions.map((q, qIdx) => (
              <div key={qIdx} className={styles.qCard}>
                <input
                  className={styles.qInput}
                  value={q.question_text}
                  onChange={(e) => {
                    const n = [...questions];
                    n[qIdx].question_text = e.target.value;
                    setQuestions(n);
                  }}
                  placeholder={`Question #${qIdx + 1}`}
                />

                <div className={styles.answersList}>
                  {q.answers.map((ans, aIdx) => (
                    <div key={aIdx} className={styles.ansRow}>
                      <input
                        type="checkbox"
                        checked={ans.is_correct}
                        onChange={() => toggleCorrect(qIdx, aIdx)}
                        className={styles.checkbox}
                      />
                      <input
                        type="text"
                        value={ans.answer_text}
                        onChange={(e) => {
                          const n = [...questions];
                          n[qIdx].answers[aIdx].answer_text = e.target.value;
                          setQuestions(n);
                        }}
                        placeholder="Option text..."
                      />
                    </div>
                  ))}
                  <button
                    className={styles.addAnsBtn}
                    onClick={() => addAnswer(qIdx)}
                  >
                    + Add option
                  </button>
                </div>
              </div>
            ))}

            <button className={styles.addQBtn} onClick={addQuestion}>
              + Add Question Manually
            </button>
          </div>
        </div>

        <footer className={styles.footer}>
          <Button type="button" color="light" onClick={closePopup}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {loading
              ? "Saving..."
              : initialData
                ? "Update Training"
                : "Save Training"}
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default AddTrainingPopup;
