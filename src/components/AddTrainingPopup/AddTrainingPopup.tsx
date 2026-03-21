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
  const [aiLoading, setAiLoading] = useState(false); // Отдельный лоадер для ИИ

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

  // --- Логика Конструктора ---

  const addQuestion = (): void => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        answers: [{ answer_text: "", is_correct: false }],
      },
    ]);
  };

  const removeQuestion = (qIdx: number): void => {
    setQuestions(questions.filter((_, index) => index !== qIdx));
  };

  const addAnswer = (qIdx: number): void => {
    const newQs = [...questions];
    newQs[qIdx].answers.push({ answer_text: "", is_correct: false });
    setQuestions(newQs);
  };

  const removeAnswer = (qIdx: number, aIdx: number): void => {
    const newQs = [...questions];
    newQs[qIdx].answers = newQs[qIdx].answers.filter(
      (_, index) => index !== aIdx,
    );
    setQuestions(newQs);
  };

  const toggleCorrect = (qIdx: number, aIdx: number): void => {
    const newQs = [...questions];
    newQs[qIdx].answers[aIdx].is_correct =
      !newQs[qIdx].answers[aIdx].is_correct;
    setQuestions(newQs);
  };

  // --- ИИ Генерация ---

  const generateAIQuestions = async (): Promise<void> => {
    if (!description || description.length < 30) {
      alert("Please add some training material first so AI can analyze it.");
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/generate_questions.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: description }),
        },
      );

      const result = await response.json();

      if (result.success && Array.isArray(result.questions)) {
        const aiQs: Question[] = result.questions.map((q: any) => ({
          question_text: q.question_text,
          answers: q.answers.map((a: any) => ({
            answer_text: a.answer_text,
            is_correct: Boolean(Number(a.is_correct)),
          })),
        }));
        setQuestions([...questions, ...aiQs]);
      } else {
        alert(result.message || "AI failed to generate questions.");
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("Failed to connect to AI service.");
    } finally {
      setAiLoading(false);
    }
  };

  // --- Сохранение ---

  const handleSubmit = async (): Promise<void> => {
    if (!name || !dept || !description || questions.length === 0) {
      alert("Please fill all fields and add at least one question.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    if (initialData?.id) formData.append("id", initialData.id.toString());
    formData.append("name", name);
    formData.append("department", dept);
    formData.append("description", description);
    if (image) formData.append("image", image);
    formData.append("questions", JSON.stringify(questions));

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
      if (result.success) onSuccess();
      else alert("Error: " + result.message);
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
              <Button
                type="button"
                color="light"
                size="medium"
                onClick={generateAIQuestions}
              >
                {aiLoading ? "AI is thinking..." : "✨ Generate by AI"}
              </Button>
            </div>

            {questions.map((q, qIdx) => (
              <div key={qIdx} className={styles.qCard}>
                <div className={styles.qHeader}>
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
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeQuestion(qIdx)}
                  >
                    ✕
                  </button>
                </div>

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
                      {q.answers.length > 1 && (
                        <button
                          className={styles.removeAns}
                          onClick={() => removeAnswer(qIdx, aIdx)}
                        >
                          ✕
                        </button>
                      )}
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
