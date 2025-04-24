import LocalStorage from "../../utils/LocalStorage";

export type Message = {
  messageId: string;
  isDriver: boolean;
  type: string;
  text?: string;
  fileId?: string;
  reactions: any;
  timestamp: string;
  tag?: string | null;
  acknowledge: boolean;
  delivered: boolean;
  read: boolean;
};

export const getMessage = (amityMessage: Amity.Message) => {
  let loginId = LocalStorage.getData("loginId");

  let isDriver = amityMessage.creatorId == loginId ? true : false;
  let text = amityMessage.data?.text;

  if (amityMessage.data?.caption != null) {
    text = amityMessage.data?.caption;
  }

  let acknowledge = false;
  if (amityMessage.reactions["acknowledge"] > 0) {
    acknowledge = true;
  }

  let read = false;
  if (amityMessage.readCount > 0) {
    read = true;
  }

  if (amityMessage.reactions["read"] > 0) {
    read = true;
  }

  let message: Message = {
    messageId: amityMessage.messageId!,
    isDriver: isDriver,
    type: amityMessage.dataType,
    text: text,
    fileId: amityMessage.data?.fileId,
    reactions: amityMessage.reactions,
    timestamp: amityMessage.createdAt,
    tag: amityMessage.tags ? amityMessage.tags[0] : null,
    acknowledge: acknowledge,
    delivered: amityMessage.syncState == "synced" ? true : false,
    read: read,
  };

  return message;
};

export const getLastReadMessage = (messages: Message[]) => {
  let messageId;
  console.log(`GET LAST READ MESSAGE COUNT: ${messages.length}`);
  messages.map((message) => {
    if (message.isDriver && message.read) {
      messageId = message.messageId;
    }
  });
  console.log(`GET LAST READ MESSAGE ID: ${messageId}`);
  return messageId;
};
