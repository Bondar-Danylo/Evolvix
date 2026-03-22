import { useState, useEffect } from "react";
import { TablePageLayout } from "@/layouts/TablePageLayout/TablePageLayout";
import type { IColumn } from "@/components/Table/Table.types";
import { TableActions } from "@/components/TableAction/TableActions";
import type { Topics } from "./ITopicsPage.types";
import AddTopicPopup from "@/components/AddTopicPopup/AddTopicPopup";
import SmallPopup from "@/components/SmallPopup/SmallPopup";
import attentionIcon from "@/assets/attention-triangle_icon.svg";
import TopicViewPopup from "@/components/TopicViewPopup/TopicViewPopup";

const SEARCH_KEYS: (keyof Topics)[] = ["title", "department"];

const TopicsPage = () => {
  const [topics, setTopics] = useState<Topics[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<Topics | null>(null);
  const [topicToDelete, setTopicToDelete] = useState<Topics | null>(null);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);
  const [viewTopic, setViewTopic] = useState<Topics | null>(null);

  const fetchTopics = async (): Promise<void> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/get_topics.php`);
      const result = await res.json();
      if (result.success) setTopics(result.topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchDepartments = async (): Promise<void> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/get_departments.php`,
      );
      const result = await res.json();
      if (result.success) setDepartmentOptions(result.departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect((): void => {
    fetchTopics();
    fetchDepartments();
  }, []);

  const handleRowClick = async (topic: Topics): Promise<void> => {
    const storageKey = "viewed_topics_ids";
    const viewedIds: number[] = JSON.parse(
      sessionStorage.getItem(storageKey) || "[]",
    );

    const isAlreadyViewed: boolean = viewedIds.includes(topic.id);

    const displayTopic = {
      ...topic,
      views_count: isAlreadyViewed
        ? topic.views_count
        : Number(topic.views_count) + 1,
    };
    setViewTopic(displayTopic);

    if (!isAlreadyViewed) {
      try {
        viewedIds.push(topic.id);
        sessionStorage.setItem(storageKey, JSON.stringify(viewedIds));

        await fetch(`${import.meta.env.VITE_API_URL}/increment_views.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: topic.id }),
        });

        fetchTopics();
      } catch (error) {
        console.error("Error incrementing views:", error);
      }
    }
  };

  const handleEdit = (topic: Topics): void => {
    setActiveTopic(topic);
    setIsModalOpen(true);
  };

  const handleAdd = (): void => {
    setActiveTopic(null);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!topicToDelete) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/delete_topic.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: topicToDelete.id }),
        },
      );

      const result = await res.json();

      if (result.success) {
        fetchTopics();
        setTopicToDelete(null);
      } else {
        alert(result.message || "Error deleting topic");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error");
    }
  };

  const columns: IColumn<Topics>[] = [
    { header: "Title", key: "title" },
    { header: "Department", key: "department" },
    { header: "Views", key: "views_count" },
    {
      header: "Actions",
      key: "actions",
      render: (_, record) => (
        <TableActions
          onView={() => handleRowClick(record)}
          onEdit={() => handleEdit(record)}
          onDelete={() => setTopicToDelete(record)}
        />
      ),
    },
  ];

  return (
    <>
      <TablePageLayout<Topics>
        data={topics}
        columns={columns}
        searchKeys={SEARCH_KEYS}
        dropdownOptions={departmentOptions}
        addButtonText="Add Topics"
        onAddClick={handleAdd}
        onRowClick={handleRowClick}
      />

      {isModalOpen && (
        <AddTopicPopup
          closePopup={() => setIsModalOpen(false)}
          onSuccess={fetchTopics}
          editData={activeTopic}
        />
      )}

      {topicToDelete && (
        <SmallPopup
          icon={attentionIcon}
          title="Delete Topic"
          subtitle={`Delete "${topicToDelete.title}"?`}
          text="This action cannot be undone."
          closePopup={() => setTopicToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}

      {viewTopic && (
        <TopicViewPopup
          topic={viewTopic}
          closePopup={() => setViewTopic(null)}
        />
      )}
    </>
  );
};

export default TopicsPage;
