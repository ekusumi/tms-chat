import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import { router } from "expo-router";

import ImageButton from "../components/controls/ImageButton";
import AssetBlock from "../components/views/AssetBlock";
import MessageBubble from "../components/views/MessageBubble";
import { useState, useEffect, useRef } from "react";
import useGetMessages from "../hooks/useGetMessages";
import { getUserIdForChannel, saveChannel } from "../types/Chat/Channel";
import User, { getFullName, getInitials, getUser } from "../types/Pimm/User";
import useSendTextMessage from "../hooks/useSendTextMessage";
import { getLastReadMessage, Message } from "../types/Chat/Message";
import MessageSeparator from "../components/views/MessageSeparator";
import {
  getDeliveryId,
  getRouteName,
  getStops,
  getTractorName,
  getTrailerName,
} from "../types/Pimm/ActiveRouteShipment";
import React from "react";
import image_button from "../styles/image_button";
import useMarkMessageRead from "../hooks/useMarkMessageRead";
import useImagePicker from "../hooks/useImagePicker";
import Popover from "react-native-popover-view";
import TagListItem from "../components/views/TagListItem";
import { SdrStop } from "../types/Pimm/SdrReport";
import Log from "../utils/Log";
import useSendImageMessage from "../hooks/useSendImageMessage";
import useCreateChannel from "../hooks/useCreateChannel";
import LocalStorage from "../utils/LocalStorage";
import useUnsubscribeGetMessages from "../hooks/useUnsubscribeGetMessages";
import useMarkChannelRead from "../hooks/useMarkChannelRead";
import {
  FinishMode,
  PlayerState,
  RecorderState,
  UpdateFrequency,
  Waveform,
  type IWaveformRef,
} from "@simform_solutions/react-native-audio-waveform";
import useGetAudioPermission, {
  getAudioPermission,
} from "../hooks/useGetAudioPermission";
import AntDesign from "@expo/vector-icons/AntDesign";

const btn_back = require("../assets/button/back_button.png");
const btn_route_manifest = require("../assets/button/route_manifest_button.png");
const btn_audio = require("../assets/button/audio_button.png");
const btn_audio_recording = require("../assets/button/audio_recording_button.png");
const btn_camera = require("../assets/button/camera_button.png");
const btn_send = require("../assets/button/send_button.png");
const btn_tag = require("../assets/button/tag_button.png");
const btn_close = require("../assets/button/close_button.png");

const btn_store_tag = require("../assets/button/store_tag_button.png");
const btn_tractor_tag = require("../assets/button/tractor_tag_button.png");
const btn_trailer_tag = require("../assets/button/trailer_tag_button.png");

const MessagePage = ({ channelId }: { channelId: string | null }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User>();
  const [text, setText] = useState<string>();

  const [routeName, setRouteName] = useState<string>();
  const [tractorName, setTractorName] = useState<string>();
  const [trailerName, setTrailerName] = useState<string>();
  const [deliveryId, setDeliveryId] = useState<string>();
  const [stops, setStops] = useState<SdrStop[]>();

  const [tag, setTag] = useState<string>();
  const [imagePreviewPath, setImagePreviewPath] = useState<string | null>(null);
  const [lastReadMessage, setLastReadMessage] = useState<string | null>(null);

  const [showTag, setShowTag] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [showAudio, setShowAudio] = useState<boolean>(false);

  // const recordWaveFormRef = useRef<IWaveformRef>(null);
  // const previewWaveFormRef = useRef<IWaveformRef>(null);
  const waveFormRef = useRef<IWaveformRef>(null);

  const [recorderState, setRecorderState] = useState(RecorderState.stopped);
  const [playerState, setPlayerState] = useState(PlayerState.stopped);
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState<string | undefined>(undefined);

  let timestamp: string;

  useEffect(() => {
    const getMessages = async () => {
      await useGetMessages(channelId!, (messages: Message[]) => {
        messages.map(async (message) => {
          await useMarkMessageRead(message);
        });

        setAllMessages(messages);
        let lastRead = getLastReadMessage(messages);
        if (lastRead) {
          setLastReadMessage(lastRead);
        }
      });
    };

    const getUserData = () => {
      let userId;

      if (channelId?.includes(`NEW_`)) {
        userId = channelId.split(`_`)[1];
      } else {
        userId = getUserIdForChannel(channelId!);
      }

      let user = getUser(userId);
      if (user != null) {
        setUser(user);
        getRouteDetails(userId);
      }
    };

    const getRouteDetails = (userId: string) => {
      setRouteName(getRouteName(userId));
      setTractorName(getTractorName(userId));
      setTrailerName(getTrailerName(userId));
      setDeliveryId(getDeliveryId(userId));
      setStops(getStops(userId));
    };

    const requestAudioPermission = async () => {
      await useGetAudioPermission();
    };

    getMessages();
    getUserData();
    requestAudioPermission();
  }, []);

  const getDateSeparator = (dateString: string) => {
    let newDate = new Date(dateString);
    let newDateString = newDate.toLocaleDateString();
    if (timestamp == null || timestamp != newDateString) {
      timestamp = newDateString;
      return newDateString;
    } else {
      return null;
    }
  };

  const onClick_btnBack = async () => {
    Log.info("Back button clicked!");
    await useMarkChannelRead(channelId!);
    useUnsubscribeGetMessages();
    waveFormRef.current?.stopRecord();
    waveFormRef.current?.stopPlayer();
    router.dismiss();
  };

  const onClick_btnRouteManifest = () => {
    Log.info("Route Manifest button clicked!");
    router.push(`/route-manifest/${deliveryId}`);
  };

  const onClick_btnStartRecording = async () => {
    Log.info("Audio button clicked. Will start audio recording");
    setShowAudio(true);
    setIsRecording(true);

    let permission = await getAudioPermission();
    if (permission.granted) {
      if (recorderState == RecorderState.stopped) {
        console.log(`START RECORD`);
        waveFormRef.current?.startRecord({
          updateFrequency: UpdateFrequency.high,
        });
        setIsRecording(true);
      }
    }
  };

  const onClick_btnStopRecording = () => {
    Log.info("Stop recording");
    if (recorderState == RecorderState.recording) {
      waveFormRef.current?.stopRecord().then((path) => {
        console.log(`STOP RECORD: ${JSON.stringify(path)}`);
        setAudioPath(path);
        setIsRecording(false);
      });
    }
  };

  const onClick_btnPlayRecording = async () => {
    Log.info("Playing recording");
    if (audioPath != undefined) {
      if (playerState != PlayerState.playing) {
        await waveFormRef.current?.startPlayer({
          finishMode: FinishMode.stop,
        });
      } else {
        waveFormRef.current?.pausePlayer();
      }
      console.log(`isRecording: ${JSON.stringify(isRecording)}`);
      console.log(`waveFormRef: ${JSON.stringify(waveFormRef)}`);
    }
  };

  const onClick_btnCamera = async () => {
    Log.info("Camera button clicked!");
    setShowCamera(true);
  };

  const onClick_btnChooseFromLibrary = async () => {
    await useImagePicker(1, (path) => {
      setImagePreviewPath(path);
      setShowCamera(false);
    });
  };

  const onClick_btnTakeAPhoto = async () => {
    await useImagePicker(2, (path) => {
      setImagePreviewPath(path);
      setShowCamera(false);
    });
  };

  const onClick_btnSend = async () => {
    Log.info("Send button clicked");

    if (channelId?.includes(`NEW_`)) {
      Log.info(
        `Sending message to empty channelId. Will create a new channelId for userId: ${user?.userId}`
      );
      let login = LocalStorage.getData("loginId");
      let userIds: string[] = Array<string>();
      userIds.push(login!);
      userIds.push(user?.userId!);

      let amityChannel = await useCreateChannel(userIds);
      saveChannel(amityChannel.channelId, user?.userId!);
      channelId = amityChannel.channelId;
    }

    if (imagePreviewPath) {
      console.log("sending image message");
      let message = await useSendImageMessage(
        channelId!,
        imagePreviewPath,
        text
      );
      allMessages.push(message);
      setImagePreviewPath(null);
    } else {
      console.log("sending text message");
      let message = await useSendTextMessage(
        channelId!,
        text!,
        tag ? [tag!] : []
      );
      allMessages.push(message);
    }
    setText("");
    Keyboard.dismiss();
  };

  const onClick_btnStoreTag = (stopName: string) => {
    Log.info(`Store Tag clicked ${stopName}`);
    setTag(`Store: ${stopName}`);
    setShowTag(false);
  };

  const onClick_btnTractorTag = () => {
    Log.info("Tractor Tag clicked");
    setTag(`Tractor: ${tractorName}`);
    setShowTag(false);
  };

  const onClick_btnTrailerTag = () => {
    Log.info("Trailer Tag clicked");
    setTag(`Trailer: ${trailerName}`);
    setShowTag(false);
  };

  const onClick_btnRemoveTag = () => {
    Log.info(`Remove Tag`);
    setTag(undefined);
  };

  const onClick_btnCancelImagePreview = () => {
    Log.info(`User removed selected image`);
    setImagePreviewPath(null);
  };

  return (
    <View style={styles.container}>
      <View style={routeName ? styles.viewHeader : styles.viewEmptyHeader}>
        <View style={styles.viewNavigation}>
          <ImageButton
            image={btn_back}
            styles={image_button}
            onClick={onClick_btnBack}
          />
          <Text style={styles.txtUser}>{getInitials(user!)}</Text>
          <Text style={styles.txtName}>{getFullName(user!)}</Text>
          {routeName ? (
            <ImageButton
              image={btn_route_manifest}
              styles={routeManifestButtonStyles}
              onClick={onClick_btnRouteManifest}
            />
          ) : (
            <View />
          )}
        </View>
        <View style={styles.viewRouteDetails}>
          {trailerName ? (
            <AssetBlock label="TRAILER" text={trailerName!} />
          ) : (
            <View />
          )}
          {tractorName ? (
            <AssetBlock label="TRACTOR" text={tractorName!} />
          ) : (
            <View />
          )}
          {routeName ? (
            <AssetBlock label="ROUTE" text={routeName!} />
          ) : (
            <View />
          )}
        </View>
      </View>
      <View style={styles.viewMessage}>
        <ScrollView
          style={styles.scrollMessage}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: false })
          }
          ref={scrollViewRef}
        >
          {allMessages.map((message) =>
            getDateSeparator(message.timestamp) != null ? (
              <>
                <MessageSeparator
                  key={message.timestamp}
                  text={`${new Date(message.timestamp).toLocaleDateString([], {
                    dateStyle: "medium",
                  })}`}
                />
                <MessageBubble
                  key={message.messageId}
                  message={message}
                  lastRead={
                    lastReadMessage! == message.messageId ? true : false
                  }
                />
              </>
            ) : (
              <>
                <MessageBubble
                  key={message.messageId}
                  message={message}
                  lastRead={
                    lastReadMessage! == message.messageId ? true : false
                  }
                />
              </>
            )
          )}
        </ScrollView>
      </View>

      {imagePreviewPath ? (
        <View style={imagePreviewStyles.viewImagePreview}>
          <Image
            source={{ uri: imagePreviewPath! }}
            style={imagePreviewStyles.imagePreview}
          ></Image>
          <ImageButton
            image={btn_close}
            styles={closeButtonStyles}
            onClick={onClick_btnCancelImagePreview}
          ></ImageButton>
        </View>
      ) : null}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={tagViewStyles.container}>
          <Popover
            isVisible={showTag}
            onRequestClose={() => setShowTag(false)}
            popoverStyle={{ backgroundColor: "#333", borderRadius: 10 }}
            from={
              <TouchableOpacity
                style={tagButtonStyles.background}
                onPress={() => (routeName ? setShowTag(true) : null)}
              >
                <Image source={btn_tag} style={tagButtonStyles.image} />
              </TouchableOpacity>
            }
          >
            <View style={tagPopOverStyles.background}>
              <View style={tagPopOverStyles.navigation}>
                <Text style={tagPopOverStyles.label}>Link to:</Text>
                <ImageButton
                  image={btn_store_tag}
                  styles={tagPopOverButtonStyles}
                  onClick={onClick_btnTractorTag}
                />
                <ImageButton
                  image={btn_tractor_tag}
                  styles={tagPopOverButtonStyles}
                  onClick={onClick_btnTractorTag}
                />
                <ImageButton
                  image={btn_trailer_tag}
                  styles={tagPopOverButtonStyles}
                  onClick={onClick_btnTrailerTag}
                />
              </View>
              <View style={tagPopOverStyles.stopList}>
                <FlatList
                  data={stops}
                  renderItem={({ item, index }) => (
                    <TagListItem
                      key={index}
                      stopNo={`Stop ${String(index + 1)}`}
                      stopName={item.SiteName}
                      onClick={onClick_btnStoreTag}
                    />
                  )}
                />
              </View>
            </View>
          </Popover>

          {tag ? (
            <Pressable onPress={() => onClick_btnRemoveTag()}>
              <View style={selectedTagStyles.background}>
                <Text style={selectedTagStyles.text}>{tag}</Text>
              </View>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.viewFooter}>
          {audioPath == undefined ? (
            <ImageButton
              image={showAudio ? btn_audio_recording : btn_audio}
              onClick={
                showAudio ? onClick_btnStopRecording : onClick_btnStartRecording
              }
              styles={audioButtonStyles}
            />
          ) : (
            <Pressable onPress={onClick_btnPlayRecording}>
              <AntDesign
                style={styles.playIcon}
                name={
                  playerState == PlayerState.playing ? "pausecircle" : "play"
                }
                size={36}
                color={"#ed8735"}
              />
            </Pressable>
          )}

          {showAudio ? (
            <View style={audioStyles.background}>
              {isRecording ? (
                <Waveform
                  mode="live"
                  ref={waveFormRef}
                  waveColor="white"
                  candleSpace={2}
                  candleWidth={4}
                  candleHeightScale={1}
                  onRecorderStateChange={(state) => {
                    setRecorderState(state);
                    console.log(
                      `STATE: ${JSON.stringify(
                        state
                      )} RECORDERSTATE: ${JSON.stringify(recorderState)}`
                    );
                  }}
                  containerStyle={audioStyles.waveStyle}
                />
              ) : (
                <Waveform
                  mode="static"
                  ref={waveFormRef}
                  path={audioPath!}
                  candleSpace={2}
                  candleWidth={4}
                  candleHeightScale={7}
                  waveColor={"white"}
                  scrubColor="black"
                  onPlayerStateChange={(state) => {
                    setPlayerState(state);
                    console.log(
                      `STATE: ${JSON.stringify(
                        state
                      )} PLAYERSTATE: ${JSON.stringify(playerState)}`
                    );
                  }}
                  onPanStateChange={(isMoving) => console.log(isMoving)}
                  containerStyle={audioStyles.waveStyle}
                />
              )}
            </View>
          ) : (
            <View style={styles.viewInput}>
              <Popover
                isVisible={showCamera}
                onRequestClose={() => setShowCamera(false)}
                popoverStyle={{ backgroundColor: "#fff", borderRadius: 10 }}
                from={
                  <TouchableOpacity
                    style={cameraButtonStyles.background}
                    onPress={onClick_btnCamera}
                  >
                    <Image
                      source={btn_camera}
                      style={cameraButtonStyles.image}
                    />
                  </TouchableOpacity>
                }
              >
                <View style={cameraPopOverStyles.container}>
                  <Pressable
                    style={cameraPopOverStyles.button}
                    onPress={onClick_btnChooseFromLibrary}
                  >
                    <Text style={cameraPopOverStyles.text}>
                      {"Choose from Library"}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={cameraPopOverStyles.button}
                    onPress={onClick_btnTakeAPhoto}
                  >
                    <Text style={cameraPopOverStyles.text}>
                      {"Take a Photo"}
                    </Text>
                  </Pressable>
                </View>
              </Popover>
              <TextInput
                style={styles.textInput}
                value={text}
                placeholder="Type message here..."
                onChangeText={(newText) => setText(newText)}
              />
            </View>
          )}
          <ImageButton
            image={btn_send}
            onClick={onClick_btnSend}
            styles={audioButtonStyles}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewHeader: {
    backgroundColor: "#eee",
    width: "100%",
    height: 160,
  },
  viewEmptyHeader: {
    backgroundColor: "#eee",
    width: "100%",
    height: 120,
  },
  viewNavigation: {
    height: 50,
    marginTop: 50,
    flexDirection: "row",
  },
  txtUser: {
    height: 54,
    width: 54,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    padding: 5,
    paddingTop: 8,
    paddingLeft: 5,
    borderColor: "#888",
    borderRadius: 27,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#aaa",
    overflow: "hidden",
    marginLeft: 10,
    marginTop: 7,
  },
  txtName: {
    height: "100%",
    width: 220,
    fontSize: 22,
    marginLeft: 20,
    marginTop: 20,
    color: "#555",
  },
  viewRouteDetails: {
    flexDirection: "row-reverse",
    marginRight: 10,
  },
  viewMessage: {
    flex: 1,
  },
  viewFooter: {
    height: 100,
    backgroundColor: "#eee",
    flexDirection: "row",
  },
  scrollMessage: {
    flex: 1,
    marginBottom: 5,
  },
  textInput: {
    margin: 15,
    height: 50,
    width: "100%",
  },
  viewInput: {
    width: "72.5%",
    flexDirection: "row",
  },
  playIcon: {
    marginTop: 25,
    marginLeft: 10,
  },
  waveStyle: {
    width: 180,
  },
});

const imagePreviewStyles = StyleSheet.create({
  viewImagePreview: {
    height: 100,
    backgroundColor: "#eee",
    flexDirection: "row",
  },
  imagePreview: {
    width: 120,
    height: 90,
    margin: 5,
    borderRadius: 10,
    resizeMode: "contain",
  },
});

const audioButtonStyles = StyleSheet.create({
  background: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  button: {
    width: 40,
    height: 40,
  },
  image: {
    width: 40,
    height: 40,
    margin: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    resizeMode: "contain",
  },
});

const cameraButtonStyles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    marginTop: 20,
    resizeMode: "contain",
  },
  background: {
    height: 10,
    width: 30,
    marginLeft: 10,
    zIndex: 999,
  },
});

const closeButtonStyles = StyleSheet.create({
  background: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  button: {
    width: 20,
    height: 20,
  },
  image: {
    width: 20,
    height: 20,
    marginLeft: -15,
    marginRight: 10,
    marginTop: 10,
    resizeMode: "contain",
  },
});

const routeManifestButtonStyles = StyleSheet.create({
  background: {
    width: 40,
    height: 40,
  },
  button: {
    width: 40,
    height: 40,
  },
  image: {
    width: 40,
    height: 40,
    margin: 5,
    marginTop: 5,
    resizeMode: "contain",
  },
});

const tagViewStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});

const tagButtonStyles = StyleSheet.create({
  background: {
    height: 10,
    width: 30,
    marginLeft: 70,
    zIndex: 999,
  },
  image: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
    resizeMode: "contain",
  },
});

const tagPopOverStyles = StyleSheet.create({
  background: {
    width: 250,
    height: 300,
    backgroundColor: "#333",
  },
  label: {
    fontSize: 20,
    color: "#fff",
    marginLeft: 5,
    marginTop: 10,
  },
  navigation: {
    flexDirection: "row",
  },
  stopList: {
    width: 230,
    height: 230,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
  },
});

const cameraPopOverStyles = StyleSheet.create({
  container: {
    width: 250,
    height: 140,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  button: {
    width: 250,
    height: 70,
    borderColor: "#ccc",
    borderWidth: 0.5,
  },
  text: {
    width: 250,
    height: 70,
    fontSize: 18,
    padding: 20,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

const tagPopOverButtonStyles = StyleSheet.create({
  background: {
    width: 45,
    height: 30,
    marginLeft: 10,
  },
  button: {
    width: 40,
    height: 40,
  },
  image: {
    width: 40,
    height: 40,
    margin: 5,
    marginTop: 5,
    resizeMode: "contain",
  },
});

const selectedTagStyles = StyleSheet.create({
  background: {
    backgroundColor: "#333",
    zIndex: 999,
    width: 200,
    marginLeft: 20,
    borderRadius: 5,
    padding: 2,
    flexDirection: "row",
  },
  text: {
    color: "#fff",
    fontSize: 12,
  },
});

const audioStyles = StyleSheet.create({
  background: {
    backgroundColor: "#14cad1",
    width: 270,
    height: 50,
    marginTop: 15,
    marginLeft: 15,
    borderRadius: 5,
  },
  waveStyle: {
    width: 270,
    padding: 5,
  },
});

export default MessagePage;
