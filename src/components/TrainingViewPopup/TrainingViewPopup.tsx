import { useState, useEffect } from "react";
import styles from "./TrainingViewPopup.module.scss";
import closeIcon from "@/assets/close_icon.svg";
import Button from "@/components/Button/Button";
import type { ViewTrainingPopupProps } from "./ITrainingViewPopup.types";

const TrainingViewPopup = ({
  training,
  closePopup,
}: ViewTrainingPopupProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number[]>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isAlreadyPassed, setIsAlreadyPassed] = useState(false);

  const sessionUserId: string | null = sessionStorage.getItem("userID");
  const totalQuestions: number = training.questions?.length || 0;
  const passThreshold: number = 0.8;
  const currentPercent: number =
    totalQuestions > 0 ? score / totalQuestions : 0;
  const IMAGE_BASE_URL: string = `${import.meta.env.VITE_API_URL}/`;

  useEffect((): void => {
    if (!sessionUserId) return;
    const checkStatus = async (): Promise<void> => {
      try {
        const res: Response = await fetch(
          `${import.meta.env.VITE_API_URL}/get_attempts.php?user_id=${sessionUserId}&training_id=${training.id}`,
        );
        const result = await res.json();
        if (
          result.success &&
          result.attempts.some((a: any) => a.status === "passed")
        ) {
          setIsAlreadyPassed(true);
        }
      } catch (error) {
        console.error("Error fetching attempts:", error);
      }
    };
    checkStatus();
  }, [training.id, sessionUserId]);

  const handleSelect = (qId: number, aId: number): void => {
    if (isSubmitted || isAlreadyPassed) return;
    setSelectedAnswers((prev) => {
      const current = prev[qId] || [];
      if (current.includes(aId)) {
        return { ...prev, [qId]: current.filter((id) => id !== aId) };
      }
      return { ...prev, [qId]: [...current, aId] };
    });
  };

  const checkQuiz = async (): Promise<void> => {
    if (!sessionUserId) return;

    let correctCount = 0;
    training.questions?.forEach((q) => {
      const userAns = selectedAnswers[q.id] || [];
      const correctAns = q.answers
        .filter((a) => Boolean(Number(a.is_correct)))
        .map((a) => a.id);
      if (
        userAns.length === correctAns.length &&
        userAns.every((id) => correctAns.includes(id))
      ) {
        correctCount++;
      }
    });

    const isPassed: boolean = correctCount / totalQuestions >= passThreshold;
    setScore(correctCount);
    setIsSubmitted(true);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/save_attempt.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: sessionUserId,
          training_id: training.id,
          score: correctCount,
          is_passed: isPassed,
        }),
      });
      if (isPassed) setIsAlreadyPassed(true);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const resetQuiz = (): void => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  return (
    <div className={styles.overlay} onClick={closePopup}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <span className={styles.deptTag}>{training.department}</span>
            <h2>{training.name}</h2>
          </div>
          <button onClick={closePopup} className={styles.closeBtn}>
            <img src={closeIcon} alt="close" />
          </button>
        </div>

        <div className={styles.body}>
          {isSubmitted &&
            !isAlreadyPassed &&
            currentPercent < passThreshold && (
              <div className={`${styles.resultBanner} ${styles.fail}`}>
                <div className={styles.bannerText}>
                  <h4>
                    📉 Not enough points ({Math.round(currentPercent * 100)}%)
                  </h4>
                  <p>
                    You need at least 80% to pass. Please review your mistakes
                    and try again.
                  </p>
                </div>
              </div>
            )}

          {isAlreadyPassed && (
            <div className={`${styles.resultBanner} ${styles.pass}`}>
              <div className={styles.bannerText}>
                <h4>🎉 Well done!</h4>
                <p>You have successfully passed the knowledge check.</p>
              </div>
              <span className={styles.statusBadge}>PASSED</span>
            </div>
          )}

          {training.image_url && (
            <div className={styles.imageWrapper}>
              <img
                src={`${IMAGE_BASE_URL}${training.image_url}`}
                alt={training.name}
                className={styles.trainingImage}
                onError={(e) => {
                  console.error("Image load error:", e.currentTarget.src);
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          <section className={styles.content}>
            <h3 className={styles.sectionTitle}>Training Material</h3>
            <div className={styles.description}>{training.description}</div>
          </section>

          {training.questions && totalQuestions > 0 && (
            <section className={styles.quiz}>
              <h3 className={styles.sectionTitle}>Knowledge Check</h3>

              {training.questions.map((q, idx) => (
                <div key={q.id} className={styles.qCard}>
                  <p className={styles.qText}>
                    <strong>Q{idx + 1}:</strong> {q.question_text}
                  </p>
                  <div className={styles.ansList}>
                    {q.answers?.map((a) => {
                      const isTrulyCorrect = Boolean(Number(a.is_correct));
                      const isSelected: boolean = selectedAnswers[
                        q.id
                      ]?.includes(a.id);

                      let itemClass: string = styles.ansItem;
                      if (isAlreadyPassed) {
                        itemClass += ` ${styles.disabled}`;
                        if (isTrulyCorrect) itemClass += ` ${styles.correct}`;
                      } else if (isSubmitted) {
                        itemClass += ` ${styles.disabled}`;
                        if (isSelected) {
                          itemClass += isTrulyCorrect
                            ? ` ${styles.correct}`
                            : ` ${styles.wrong}`;
                        }
                      } else if (isSelected) {
                        itemClass += ` ${styles.selected}`;
                      }

                      return (
                        <div
                          key={a.id}
                          className={itemClass}
                          onClick={() => handleSelect(q.id, a.id)}
                        >
                          <div className={styles.checkbox}>
                            {(isSelected ||
                              (isAlreadyPassed && isTrulyCorrect)) && (
                              <div className={styles.checkInner} />
                            )}
                          </div>
                          <span className={styles.ansText}>
                            {a.answer_text}
                          </span>
                          {isSubmitted && isSelected && (
                            <span className={styles.feedbackLabel}>
                              {isTrulyCorrect ? "✓ Correct" : "✕ Wrong"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className={styles.quizFooter}>
                {!isSubmitted && !isAlreadyPassed && (
                  <Button onClick={checkQuiz} type="button">
                    Finish & Check
                  </Button>
                )}
                {isSubmitted && !isAlreadyPassed && (
                  <Button type="button" color="light" onClick={resetQuiz}>
                    Try Again
                  </Button>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingViewPopup;
