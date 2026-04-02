import { useState, useEffect, useRef } from "react";
import styles from "./ChatBot.module.scss";
import { faqData } from "./faqData";
import type { IChatBotMessage } from "./IMessage.types";
import type { IChatBotProps } from "./IChatBotProps.types";
import closeIcon from "@/assets/close_icon.svg";
import TrainingViewPopup from "@/components/TrainingViewPopup/TrainingViewPopup";
import TopicViewPopup from "@/components/TopicViewPopup/TopicViewPopup";

const ChatBot = ({ closeChatbot }: IChatBotProps) => {
  const [messages, setMessages] = useState<IChatBotMessage[]>([
    { id: 1, sender: "Bot", text: "Hello! How can I help you today?" },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTraining, setActiveTraining] = useState<any>(null);
  const [activeTopic, setActiveTopic] = useState<any>(null);

  const windowRef: React.RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);

  useEffect((): void => {
    if (windowRef.current) {
      windowRef.current.scrollTop = windowRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const addMessage = (
    sender: "You" | "Bot",
    text: string,
    links?: any[],
  ): void => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), sender, text, links },
    ]);
  };

  const getBotResponse = async (input: string): Promise<void> => {
    const lowerInput = input.toLowerCase();

    const localMatch = faqData.find((item) =>
      item.keywords.some((keyword) =>
        lowerInput.includes(keyword.toLowerCase()),
      ),
    );

    if (localMatch) {
      addMessage("Bot", localMatch.answer);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      addMessage("Bot", data.answer, data.metadata);
    } catch (error) {
      addMessage("Bot", "I'm having trouble connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (): void => {
    const trimmedText = inputValue.trim();
    if (!trimmedText || isLoading) return;

    addMessage("You", trimmedText);
    setInputValue("");
    getBotResponse(trimmedText);
  };

  return (
    <div className={styles.wrapper} onClick={closeChatbot}>
      <div className={styles.chatbot} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Support Assistant</h3>
          <button className={styles.closeX} onClick={closeChatbot}>
            <img src={closeIcon} alt="Close Icon" />
          </button>
        </div>

        <div className={styles.window} ref={windowRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageRow} ${msg.sender === "You" ? styles.userRow : styles.botRow}`}
            >
              <div className={styles.bubble}>
                <div className={styles.text}>{msg.text}</div>

                {msg.links && msg.links.length > 0 && (
                  <div className={styles.linksList}>
                    {msg.links.map((link, index) => (
                      <button
                        key={index}
                        className={styles.viewLinkBtn}
                        onClick={() => {
                          if (link.type === "training")
                            setActiveTraining(link.data);
                          if (link.type === "topic") setActiveTopic(link.data);
                        }}
                      >
                        📖 View {link.type}: {link.data.name || link.data.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.messageRow} ${styles.botRow}`}>
              <div className={styles.bubble}>
                <div className={styles.text}>Typing...</div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <input
            type="text"
            className={styles.input}
            placeholder={isLoading ? "Processing..." : "Ask a question..."}
            value={inputValue}
            disabled={isLoading}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
          >
            Send
          </button>
        </div>
      </div>

      {activeTraining && (
        <TrainingViewPopup
          training={activeTraining}
          closePopup={() => setActiveTraining(null)}
        />
      )}

      {activeTopic && (
        <TopicViewPopup
          topic={activeTopic}
          closePopup={() => setActiveTopic(null)}
        />
      )}
    </div>
  );
};

export default ChatBot;
