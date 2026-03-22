import { useState, useEffect, useCallback } from "react";
import styles from "./EmployeeTopicsPage.module.scss";
import { TablePageLayout } from "@/layouts/TablePageLayout/TablePageLayout";
import type { IColumn } from "@/components/Table/Table.types";
import StarIcon from "@/assets/star_icon.svg?react";
import type { IEmployeeTopic } from "./IEmployeeTopic.types";
import TopicViewPopup from "@/components/TopicViewPopup/TopicViewPopup";

const EmployeeTopicsPage = () => {
  const [data, setData] = useState<IEmployeeTopic[]>([]);
  const [viewTopic, setViewTopic] = useState<IEmployeeTopic | null>(null);
  const currentUserId: string | null = sessionStorage.getItem("userID");
  const API_URL: string = import.meta.env.VITE_API_URL;
  const SEARCH_KEYS: (keyof IEmployeeTopic)[] = ["name"];
  const STATUS_OPTIONS: string[] = [
    "New",
    "Viewed",
    "Updated",
    "Saved",
    "Mandatory",
  ];

  const fetchTopics = useCallback(async (): Promise<void> => {
    if (!currentUserId) return;

    try {
      const res = await fetch(
        `${API_URL}/get_topics.php?user_id=${currentUserId}`,
      );
      const result = await res.json();

      if (result.success) {
        const mappedData: IEmployeeTopic[] = result.topics.map((t: any) => ({
          id: t.id,
          name: t.title,
          content: t.content,
          image_url: t.image_url,
          for: t.department,
          status: t.status,
          saved: Boolean(t.is_saved),
          views_count: Number(t.views_count),
        }));
        setData(mappedData);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, [currentUserId, API_URL]);

  useEffect((): void => {
    fetchTopics();
  }, [fetchTopics]);

  const handleToggleSave = async (
    e: React.MouseEvent,
    id: number | string,
  ): Promise<void> => {
    e.stopPropagation();
    if (!currentUserId) return;

    try {
      const res = await fetch(`${API_URL}/toggle_save.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic_id: id, user_id: currentUserId }),
      });

      if ((await res.json()).success) {
        setData((prev) =>
          prev.map((topic) => {
            if (topic.id === id) {
              const isNowSaved = !topic.saved;
              return {
                ...topic,
                saved: isNowSaved,
                status: isNowSaved ? "Saved" : "Viewed",
              };
            }
            return topic;
          }),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRowClick = async (topic: IEmployeeTopic): Promise<void> => {
    setViewTopic(topic);
    const shouldIncrement =
      topic.status === "New" || topic.status === "Updated";

    if (!currentUserId || !shouldIncrement) return;

    try {
      await fetch(`${API_URL}/increment_views.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: topic.id, user_id: currentUserId }),
      });

      setData((prev) =>
        prev.map((t) =>
          t.id === topic.id
            ? {
                ...t,
                status: t.saved ? "Saved" : "Viewed",
                views_count: t.views_count + 1,
              }
            : t,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const columns: IColumn<IEmployeeTopic>[] = [
    { header: "Name", key: "name" },
    { header: "For", key: "for" },
    { header: "Status", key: "status" },
    {
      header: "Save",
      key: "saved",
      render: (value, record) => (
        <button
          type="button"
          className={styles.starButton}
          onClick={(e) => handleToggleSave(e, record.id)}
        >
          <StarIcon className={`${value ? styles.saved : ""} ${styles.icon}`} />
        </button>
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <TablePageLayout<IEmployeeTopic>
        data={data}
        columns={columns}
        searchKeys={SEARCH_KEYS}
        dropdownOptions={STATUS_OPTIONS}
        addButtonText=""
        onRowClick={handleRowClick}
        editable={true}
      />

      {viewTopic && (
        <TopicViewPopup
          topic={viewTopic}
          closePopup={() => setViewTopic(null)}
        />
      )}
    </div>
  );
};

export default EmployeeTopicsPage;
