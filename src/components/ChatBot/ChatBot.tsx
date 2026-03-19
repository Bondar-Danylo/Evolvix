import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import styles from "./ChatBot.module.scss";
import { faqData } from "./faqData";
import type { IMessage } from "./IMessage.types";
import type { IChatBotProps } from "./IChatBotProps.types";
import closeIcon from "@/assets/close_icon.svg";

const ChatBot = ({ closeChatbot }: IChatBotProps) => {
  const [messages, setMessages] = useState<IMessage[]>([
    { id: 1, sender: "Bot", text: "Hello! How can I help you today?" },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.scrollTop = windowRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (sender: "You" | "Bot", text: string): void => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), sender, text },
    ]);
  };

  const getBotResponse = (input: string): void => {
    const lowerInput = input.toLowerCase();
    const foundItem = faqData.find((item) =>
      item.keywords.some((keyword) => lowerInput.includes(keyword)),
    );

    const response = foundItem
      ? foundItem.answer
      : "I'm not sure I understand. Could you please rephrase your question?";

    addMessage("Bot", response);
  };

  const handleSend = (): void => {
    const trimmedText = inputValue.trim();
    if (!trimmedText) return;

    addMessage("You", trimmedText);
    setInputValue("");

    setTimeout(() => {
      getBotResponse(trimmedText);
    }, 600);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSend();
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
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <input
            type="text"
            className={styles.input}
            placeholder="Ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className={styles.sendBtn} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
