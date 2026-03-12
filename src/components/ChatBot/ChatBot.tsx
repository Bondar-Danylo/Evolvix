import { useState, useEffect, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import styles from "./ChatBot.module.scss";
import { faqData } from "./faqData";
import type { IMessage } from "./IMessage.types";
import type { IChatBotProps } from "./IChatBotProps.types";

const ChatBot = ({ closeChatbot }: IChatBotProps) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
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
      : "Sorry, I don't understand that. Could you try asking something else?";

    addMessage("Bot", response);
  };

  const handleSend = (): void => {
    const trimmedText = inputValue.trim();
    if (!trimmedText) return;

    addMessage("You", trimmedText);
    setInputValue("");

    setTimeout(() => {
      getBotResponse(trimmedText);
    }, 500);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className={styles.wrapper} onClick={closeChatbot}>
      <div className={styles.chatbot} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>ChatBot</h3>

        <div className={styles.window} ref={windowRef}>
          {messages.map((msg) => (
            <p
              key={msg.id}
              className={msg.sender === "You" ? styles.user : styles.bot}
            >
              <span>{msg.sender}:</span> {msg.text}
            </p>
          ))}
        </div>

        <div className={styles.footer}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type your message..."
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button className={styles.button} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
