import LocalStorage from "../utils/LocalStorage";
import {
  ChannelRepository,
  Client,
  FileRepository,
  MessageContentType,
  MessageRepository,
  ReactionRepository,
} from "@amityco/ts-sdk";
import Log from "../utils/Log";
import { Platform } from "react-native";
import User, { getFullName } from "../types/Pimm/User";

type ChannelCallbackFunction = (result: Amity.Channel[]) => void;
type MessageCallbackFunction = (result: Amity.Message[]) => void;
type SearchCallbackFunction = (
  message: Amity.Message[],
  tag: Amity.Message[],
  sender: Amity.Message[]
) => void;

class AmityClient {
  private static instance: AmityClient;

  private client?: Amity.Client;

  private amityChannels?: Amity.Channel[];
  private amityChannelsUnsubscriber?: Amity.Unsubscriber;

  private amityMessages?: Amity.Message[];
  private amityMessagesUnsubscriber?: Amity.Unsubscriber;

  private amitySearchMessages?: Amity.Message[];
  private amitySearchMessagesUnsubscriber?: Amity.Unsubscriber;

  private constructor() {}

  public static getInstance(): AmityClient {
    if (!AmityClient.instance) {
      AmityClient.instance = new AmityClient();
    }
    return AmityClient.instance;
  }

  public async initClient(userId: string) {
    let apiKey = LocalStorage.getData("amityApiKey");
    let region = LocalStorage.getData("amityRegion");

    Log.info("Amity Login APIKey" + apiKey);

    this.client = Client.createClient(apiKey!, region?.toLowerCase());

    let isConnected = await Client.login({ userId: userId }, sessionHandler);
    Log.info("Amity Login " + isConnected);
    return isConnected;
  }

  public getChannels(callback: ChannelCallbackFunction) {
    this.amityChannelsUnsubscriber = ChannelRepository.getChannels(
      {
        isDeleted: false,
        sortBy: "lastActivity",
        membership: "member",
        types: ["conversation"],
        limit: 100,
      },
      ({ data: channels, onNextPage, hasNextPage, loading, error }) => {
        if (error) {
          Log.error(`Failed to get channels with error: ${error}`);
        }

        if (loading) {
          // Log.debug(`Downloading all channels`);
        }

        if (channels) {
          Log.debug(`Successfully downloaded ${channels.length} channels`);
          this.amityChannels = channels;
          callback(channels);
        }
      }
    );
  }

  public async markChannelRead(channelId: string) {
    this.amityChannels?.map(async (amityChannel) => {
      if (amityChannel.channelId == channelId) {
        await amityChannel.markAsRead();
      }
    });
  }

  public getMessages(channelId: string, callback: MessageCallbackFunction) {
    this.amityMessagesUnsubscriber = MessageRepository.getMessages(
      { subChannelId: channelId, sortBy: "segmentDesc", limit: 100 },
      ({ data: messages, onNextPage, hasNextPage, loading, error }) => {
        if (error) {
          Log.error(`Failed to get messages with error: ${error}`);
        }

        if (loading) {
          // Log.debug(`Downloading all messages`);
        }

        if (messages) {
          Log.info(
            `Successfully downloaded ${messages.length} messages for channelId: ${channelId}`
          );
          this.amityMessages = messages;
          callback(messages.reverse());
        }
      }
    );
  }

  public unsubcscribeGetMessages() {
    if (this.amityMessagesUnsubscriber) {
      this.amityMessagesUnsubscriber();
      this.amityMessagesUnsubscriber = undefined;
    }
  }

  public searchMessages(
    channelId: string,
    search: string,
    callback: SearchCallbackFunction
  ) {
    this.amitySearchMessagesUnsubscriber = MessageRepository.getMessages(
      { subChannelId: channelId, sortBy: "segmentDesc", limit: 100 },
      ({ data: messages, onNextPage, hasNextPage, loading, error }) => {
        if (error) {
          Log.error(`Failed to get messages with error: ${error}`);
        }

        if (loading) {
          // Log.debug(`Searching all messages`);
        }

        if (messages) {
          var searchMessages = Array();
          var searchTags = Array();
          var searchSenders = Array();

          messages.map((message) => {
            if (message.data?.text != null) {
              let text: string = message.data?.text;
              if (text.toLowerCase().indexOf(search.toLocaleLowerCase()) >= 0) {
                searchMessages.push(message);
              }
            }

            if (message.tags!.length > 0) {
              let tag = message.tags![0];
              if (
                tag.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >= 0
              ) {
                searchTags.push(message);
              }
            }

            let object = LocalStorage.getData(message.creatorId);
            let user = JSON.parse(object!) as User;
            if (
              getFullName(user)
                .toLowerCase()
                .indexOf(search.toLocaleLowerCase()) >= 0
            ) {
              searchSenders.push(message);
            }
          });
          callback(searchMessages, searchTags, searchSenders);
        }
      }
    );
  }

  public filterMessages(
    channelId: string,
    tag: string,
    callback: MessageCallbackFunction
  ) {
    this.amitySearchMessagesUnsubscriber = MessageRepository.getMessages(
      { subChannelId: channelId, sortBy: "segmentDesc", limit: 100 },
      ({ data: messages, onNextPage, hasNextPage, loading, error }) => {
        if (error) {
          Log.error(`Failed to get messages with error: ${error}`);
        }

        if (loading) {
          // Log.debug(`Searching all messages`);
        }

        if (messages) {
          var searchTags = Array();

          messages.map((message) => {
            if (message.tags!.length > 0) {
              if (
                message
                  .tags![0].toLocaleLowerCase()
                  .indexOf(tag.toLocaleLowerCase()) >= 0
              ) {
                searchTags.push(message);
              }
            }
          });
          callback(searchTags);
        }
      }
    );
  }

  public async markMessageRead(messageId: string) {
    this.amityMessages!.map(async (amityMessage) => {
      if (amityMessage.messageId == messageId) {
        amityMessage.markRead();
        await AmityService.addMessageReaction(amityMessage.messageId, "read");
      }
    });
  }

  public async sendTextMessage(
    channelId: string,
    text: string,
    tags: string[]
  ) {
    Log.info(`Sending Text Message: ${text} to ChannelId: ${channelId}`);

    const textMessage = {
      subChannelId: channelId,
      dataType: MessageContentType.TEXT,
      data: {
        text: text,
      },
      tags: tags,
      metadata: {},
    };

    const { data: message } = await MessageRepository.createMessage(
      textMessage
    );

    return message;
  }

  public async downloadFile(fileId: string) {
    let file = await FileRepository.getFile(fileId);
    return file;
  }
}

const sessionHandler: Amity.SessionHandler = {
  sessionWillRenewAccessToken(renewal: Amity.AccessTokenRenewal) {
    renewal.renew();
  },
};

const AmityService = {
  initClient: async (userId: string) => {
    let isConnected = await AmityClient.getInstance().initClient(userId);
    return isConnected;
  },

  getChannels: async (callback: ChannelCallbackFunction) => {
    AmityClient.getInstance().getChannels(callback);
  },

  markChannelRead: async (channelId: string) => {
    await AmityClient.getInstance().markChannelRead(channelId);
  },

  getMessages: async (channelId: string, callback: MessageCallbackFunction) => {
    AmityClient.getInstance().getMessages(channelId, callback);
  },

  filterMessages: async (
    channelId: string,
    tag: string,
    callback: MessageCallbackFunction
  ) => {
    AmityClient.getInstance().filterMessages(channelId, tag, callback);
  },

  unsubscribeGetMessages: () => {
    AmityClient.getInstance().unsubcscribeGetMessages();
  },

  searchMessages: async (
    channelId: string,
    search: string,
    callback: SearchCallbackFunction
  ) => {
    AmityClient.getInstance().searchMessages(channelId, search, callback);
  },

  sendTextMessage: async (channelId: string, text: string, tags: string[]) => {
    let message = AmityClient.getInstance().sendTextMessage(
      channelId,
      text,
      tags
    );
    return message;
  },

  sendImageMessage: async (channelId: string, path: string, text?: string) => {
    Log.info(`Sending Image Message to ChannelId: ${channelId}`);

    const parts = path.split("/");
    const fileName = parts[parts.length - 1];
    const fileType = Platform.OS === "ios" ? "image/jpeg" : "image/jpg";
    const uri = Platform.OS === "android" ? path : path.replace("file://", "");

    const response = await fetch(uri);
    const blob = await response.blob();

    const fileObject = {
      ...blob,
      name: fileName,
      size: blob.size,
      uri: uri,
      type: fileType,
    };

    const data = new FormData();

    data.append("files", fileObject);

    console.log(`uploadImage data: ${JSON.stringify(data)}`);

    try {
      const { data: files } = await FileRepository.uploadImage(data);
      console.log(`uploaded files: ${files}`);

      const { fileId } = files[0];

      console.log(`uploaded Image: ${fileId}`);

      const imageMessage = {
        subChannelId: channelId,
        dataType: MessageContentType.IMAGE,
        fileId,
        data: {
          text: text,
          caption: text,
          fileId,
        },
      };

      console.log(`Add Image Caption: ${JSON.stringify(imageMessage)}`);

      const { data: message } = await MessageRepository.createMessage(
        imageMessage
      );

      console.log(`Create Image Message Response: ${JSON.stringify(message)}`);

      return message;
    } catch (error) {
      Log.error(`Failed with Error: ${JSON.stringify(error)}`);
      return null;
    }
  },

  markMessageRead: async (messageId: string) => {
    await AmityClient.getInstance().markMessageRead(messageId);
  },

  addMessageReaction: async (messageId: string, reaction: string) => {
    await ReactionRepository.addReaction("message", messageId, reaction);
  },

  createChannel: async (userIds: string[], siteId: string) => {
    Log.info(
      `Creating a new channel for siteId: ${siteId} userIds: ${userIds}`
    );

    let displayName = userIds[1];

    let tags = Array();
    tags.push(siteId);

    const newChannel = {
      displayName: displayName,
      tags: tags,
      type: "conversation" as Amity.ChannelType,
      userIds: userIds,
      metadata: {
        siteId: siteId,
        sdk_type: "ios",
        userIds: userIds,
      },
    };

    Log.info(`Creating channel: ${JSON.stringify(newChannel)}`);

    const { data: channel } = await ChannelRepository.createChannel(newChannel);
    console.log(`Create Channel: ${JSON.stringify(channel)}`);
    return channel;
  },

  deleteChannel: async (channelId: string) => {
    await ChannelRepository.deleteChannel(channelId);
  },

  downloadFile: async (fileId: string) => {
    return await AmityClient.getInstance().downloadFile(fileId);
  },
};

export default AmityService;
