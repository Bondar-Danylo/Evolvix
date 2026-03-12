export interface IMessage {
  id: number;
  sender: "You" | "Bot";
  text: string;
}
