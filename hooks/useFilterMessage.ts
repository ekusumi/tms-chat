import AmityService from "../services/AmityService";
import { Channel, getFilterChannel } from "../types/Chat/Channel";
import { getMessage, Message } from "../types/Chat/Message";

export type UseFilterMessagesCallback = (result: Channel[]) => void;

const useFilterMessage = async (
  channels: Channel[],
  tag: string,
  callback: UseFilterMessagesCallback
) => {
  var filterChannels = Array();
  await channels.map(async (channel) => {
    await AmityService.filterMessages(
      channel.channelId,
      tag,
      (amityMessages) => {
        amityMessages.map((amityMessage) => {
          let channel = getFilterChannel(amityMessage);
          filterChannels.push(channel);
        });
      }
    );

    callback(filterChannels);
  });
};

export default useFilterMessage;
