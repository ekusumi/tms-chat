import { StyleSheet, View, Image, Text, Pressable } from "react-native";
import { Message } from "../../types/Chat/Message";
import { useRef, useState } from "react";
import LocalStorage from "../../utils/LocalStorage";
import useAddMessageReaction from "../../hooks/useAddMessageReaction";
import Log from "../../utils/Log";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import {
  PlayerState,
  Waveform,
  type IWaveformRef,
} from "@simform_solutions/react-native-audio-waveform";

const tag_icon = require("../../assets/icon/tag_icon.png");
const like_icon = require("../../assets/icon/like_icon.png");
const path = "/Users/emmankusumi/Desktop/audio.wav"; // path to the audio file for which you want to show waveform

const MessageBubble = ({
  message,
  lastRead,
}: {
  message: Message;
  lastRead: boolean;
}) => {
  const [playerState, setPlayerState] = useState(PlayerState.stopped);

  let length = 250;
  if (message.type == "text") {
    length = message.text!.length;
    if (length < 40) {
      if (length < 10) {
        length = 80;
      } else if (length < 20) {
        length = length * 10;
      } else {
        length = length * 7;
      }
    } else {
      length = 250;
    }
  }

  let date = new Date(message.timestamp);
  let time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getFile = (fileId: string) => {
    let path = LocalStorage.getData(fileId);
    if (path) {
      return path;
    } else {
      return `https://apix.eu.amity.co/api/v3/files/${message.fileId}/download`;
    }
  };

  const onClick_btnAcknowledge = async (message: Message) => {
    if (message.isDriver == false) {
      let messageId = message.messageId;
      let clickedMessageId = await LocalStorage.getData("acknowledge");
      if (clickedMessageId == messageId) {
        Log.info(`Acknowledging Message: ${messageId}`);
        useAddMessageReaction(messageId, "acknowledge");
        await LocalStorage.saveData("acknowledge", "");
      } else {
        await LocalStorage.saveData("acknowledge", messageId);
      }
    }
  };

  const onClick_btnImage = (message: Message) => {
    let fileId = message.fileId;
    router.push(`/image/${fileId}`);
  };

  const waveFormRef = useRef<IWaveformRef>(null);

  const onClick_btnAudio = () => {
    if (playerState != PlayerState.playing) {
      waveFormRef.current?.startPlayer();
    } else {
      waveFormRef.current?.pausePlayer();
    }
  };

  return (
    <View>
      <View
        style={[
          message.isDriver ? tagStyles.outTag : tagStyles.inTag,
          message.tag ? { width: "45%" } : { backgroundColor: "#fff" },
        ]}
      >
        <Image
          style={tagStyles.tagIcon}
          source={message.tag ? tag_icon : null}
        />
        <Text style={tagStyles.tagText}>{message.tag}</Text>
      </View>
      <Pressable onPress={() => onClick_btnAcknowledge(message)}>
        <View
          style={[
            message.isDriver ? styles.outContainer : styles.inContainer,
            { width: length },
          ]}
        >
          <View style={styles.messageContainer}>
            {message.fileId ? (
              message.type == "audio" ? (
                // AUDIO
                <View style={styles.audioContainer}>
                  <Pressable onPress={onClick_btnAudio}>
                    <AntDesign
                      style={styles.playIcon}
                      name={
                        playerState == PlayerState.playing
                          ? "pausecircle"
                          : "play"
                      }
                      size={36}
                      color={message.isDriver ? "white" : "#ed8735"}
                    />
                  </Pressable>
                  <Waveform
                    mode="static"
                    ref={waveFormRef}
                    path={getFile(message.fileId)!}
                    candleSpace={1}
                    candleWidth={6}
                    waveColor={message.isDriver ? "white" : "gray"}
                    scrubColor="black"
                    candleHeightScale={7}
                    onPlayerStateChange={(state) => {
                      setPlayerState(state);
                    }}
                    containerStyle={styles.waveStyle}
                  />
                </View>
              ) : (
                // IMAGE
                <View style={styles.imageContainer}>
                  <Pressable onPress={() => onClick_btnImage(message)}>
                    <Image
                      source={{
                        uri: `https://apix.eu.amity.co/api/v3/files/${message.fileId}/download?size=medium`,
                      }}
                      style={
                        message.isDriver ? styles.outImage : styles.inImage
                      }
                    />
                  </Pressable>
                  <Text
                    style={
                      message.isDriver ? styles.outCaption : styles.inCaption
                    }
                  >
                    {message.text}
                  </Text>
                </View>
              )
            ) : (
              // TEXT
              <Text
                style={message.isDriver ? styles.outMessage : styles.inMessage}
              >
                {message.text}
              </Text>
            )}
          </View>
          <View>
            <View
              style={
                message.isDriver
                  ? styles.outTimeContainer
                  : styles.inTimeContainer
              }
            >
              {message.isDriver && message.delivered ? (
                <AntDesign
                  style={styles.checkIcon}
                  name="checkcircle"
                  size={12}
                  color="white"
                />
              ) : null}
              <Text style={message.isDriver ? styles.outTime : styles.inTime}>
                {time}
              </Text>
            </View>
            <Image
              style={
                message.isDriver
                  ? tagStyles.outAcknowledgeIcon
                  : tagStyles.inAcknowledgeIcon
              }
              source={message.acknowledge ? like_icon : null}
            />
          </View>
        </View>
      </Pressable>
      {lastRead == true && message.isDriver && message.read ? (
        <AntDesign style={styles.readIcon} name="eye" size={16} color="gray" />
      ) : null}
    </View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  inContainer: {
    backgroundColor: "#eee",
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10,
    borderBottomRightRadius: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  outContainer: {
    backgroundColor: "#ed8735",
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10,
    borderBottomLeftRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    alignSelf: "flex-end",
  },
  messageContainer: {
    flexGrow: 1,
    flexDirection: "row",
  },
  imageContainer: {
    flexGrow: 1,
    flexDirection: "column",
  },
  inMessage: {
    flex: 1,
    width: 1,
    fontSize: 14,
    color: "#333",
  },
  outMessage: {
    flex: 1,
    width: 1,
    fontSize: 14,
    color: "#fff",
  },
  inCaption: {
    marginTop: 5,
    fontSize: 14,
    color: "#333",
  },
  outCaption: {
    marginTop: 5,
    fontSize: 14,
    color: "#fff",
  },
  inTime: {
    textAlign: "left",
    fontSize: 10,
    color: "#333",
    marginTop: 10,
  },
  outTime: {
    textAlign: "right",
    fontSize: 10,
    color: "#fff",
    marginTop: 10,
  },
  inImage: {
    flex: 1,
    width: 240,
    height: 150,
    color: "#333",
    borderRadius: 10,
  },
  outImage: {
    flex: 1,
    width: 240,
    height: 150,
    color: "#fff",
    borderRadius: 10,
  },
  acknowledge: {
    backgroundColor: "#ccc",
  },
  inTimeContainer: {
    flexDirection: "row",
  },
  outTimeContainer: {
    flexDirection: "row-reverse",
  },
  checkIcon: {
    marginTop: 10,
    marginLeft: 5,
  },
  readIcon: {
    flexDirection: "row-reverse",
    alignSelf: "flex-end",
    marginRight: 10,
  },
  audioContainer: {
    flexGrow: 1,
    flexDirection: "row",
  },
  playIcon: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  waveStyle: {
    width: 180,
  },
});

const tagStyles = StyleSheet.create({
  inTag: {
    backgroundColor: "#333",
    height: 20,
    marginBottom: 1,
    padding: 5,
    borderRadius: 10,
    marginLeft: 10,
  },
  outTag: {
    backgroundColor: "#333",
    height: 20,
    marginBottom: 1,
    padding: 5,
    borderRadius: 10,
    marginLeft: 10,
    alignSelf: "flex-end",
    marginRight: 10,
  },
  tagIcon: {
    marginTop: 2,
    height: 16,
    resizeMode: "contain",
    position: "absolute",
  },
  tagText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold",
    marginLeft: 25,
    textAlignVertical: "center",
  },
  outAcknowledgeIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    position: "absolute",
    alignSelf: "flex-start",
    marginTop: 15,
    zIndex: 999,
  },
  inAcknowledgeIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    position: "absolute",
    alignSelf: "flex-end",
    marginTop: 15,
    zIndex: 999,
  },
});
