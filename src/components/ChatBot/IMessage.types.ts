export interface IMessage {
  id: number;
  sender: "You" | "Bot";
  text: string;
}

export  interface IChatBotMessage extends IMessage {
  links?: Array<{
    type: "training" | "topic";
    data: any;
  }>;
}