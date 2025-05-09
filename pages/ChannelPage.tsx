import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  ActionSheetIOS,
} from "react-native";
import ImageButton from "../components/controls/ImageButton";
import ChatListItem from "../components/views/ChatListItem";
import useGetChannels, {
  sortChannelsByContact,
  sortChannelsByRecent,
} from "../hooks/useGetChannels";
import { useCallback, useEffect, useState } from "react";
import { Channel } from "../types/Chat/Channel";
import { router } from "expo-router";
import useRemoveLoginCredentials from "../hooks/useRemoveLoginCredentials";
import useSearchMessage from "../hooks/useSearchMessage";
import { useFocusEffect } from "@react-navigation/native";
import SearchListItem from "../components/views/SearchListItem";
import { Search } from "../types/Chat/Search";
import useFilterMessage from "../hooks/useFilterMessage";
import useGetActiveRouteShipment from "../hooks/useGetActiveRouteShipment";
import LocalStorage from "../utils/LocalStorage";
import Log from "../utils/Log";

const btn_new_message = require("../assets/button/new_message_button.png");

const btn_menu = require("../assets/button/menu_button.png");

const btn_recent = require("../assets/button/sort_recent.png");
const btn_contacts = require("../assets/button/sort_contacts.png");
const btn_store_tag = require("../assets/button/sort_store_tag.png");
const btn_tractor_tag = require("../assets/button/sort_tractor_tag.png");
const btn_trailer_tag = require("../assets/button/sort_trailer_tag.png");

const ChannelPage = () => {
  const [allChannels, setAllChannels] = useState<Channel[]>([]);
  const [, updateState] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchMessages, setSearchMessages] = useState<Search[]>([]);
  const [selectedSort, setSelectedSort] = useState(1);

  const onClick_btnSortRecent = () => {
    Log.info("Sort Recent button clicked!");
    setSelectedSort(1);
    getChannels();
  };

  const onClick_btnSortContact = () => {
    Log.info("Sort Contact button clicked!");
    setSelectedSort(2);
    getChannels();
  };

  const onClick_btnSortStore = () => {
    Log.info("Sort Store button clicked!");
    setSelectedSort(3);
    // getChannels();
  };

  const onClick_btnSortTractor = () => {
    Log.info("Sort Tractor button clicked!");
    setSelectedSort(4);
    // getChannels();
  };

  const onClick_btnSortTrailer = () => {
    Log.info("Sort Trailer button clicked!");
    setSelectedSort(5);
    // getChannels();
  };

  const onClick_btnNewMessage = () => {
    Log.info("New Message button clicked!");
    router.push(`/contact/list`);
  };

  const onClick_btnMenu = () => {
    Log.info("Menu button clicked!");
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Logout"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          useRemoveLoginCredentials();
          router.dismissAll();
        }
      }
    );
  };

  const getActiveRouteShipment = async () => {
    let siteId = LocalStorage.getData("siteId");
    let activeRouteShipments = await useGetActiveRouteShipment(siteId!);
    await LocalStorage.saveData(
      "activeRouteShipments",
      JSON.stringify(activeRouteShipments)
    );
  };

  const getChannels = () => {
    useGetChannels((channels) => {
      console.log("SORT: " + selectedSort);
      if (selectedSort == 1) {
        setAllChannels(sortChannelsByRecent(channels));
      } else if (selectedSort == 2) {
        setAllChannels(sortChannelsByContact(channels));
      } else if (selectedSort == 3) {
        useFilterMessage(channels, "Store:", (tagMessages) => {
          setAllChannels(tagMessages);
        });
      } else if (selectedSort == 4) {
        useFilterMessage(channels, "Tractor:", (tagMessages) => {
          setAllChannels(tagMessages);
        });
      } else if (selectedSort == 5) {
        useFilterMessage(channels, "Trailer:", (tagMessages) => {
          setAllChannels(tagMessages);
        });
      }
    });
  };

  useEffect(() => {
    getChannels();
  }, [selectedSort]);

  useFocusEffect(
    useCallback(() => {
      updateState(undefined);
      getActiveRouteShipment();
    }, [])
  );

  useEffect(() => {
    const searchMessage = async () => {
      await useSearchMessage(allChannels, searchText, (searchMessages) => {
        setSearchMessages(searchMessages);
      });
    };

    searchMessage();
  }, [searchText]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ImageButton
          image={btn_menu}
          styles={menuButtonStyle}
          onClick={onClick_btnMenu}
        />
        <Text style={styles.textContainer}>TMS Chat</Text>
        <ImageButton
          image={btn_new_message}
          styles={newMessageButtonStyle}
          onClick={onClick_btnNewMessage}
        />
      </View>
      <TextInput
        style={styles.txtSearch}
        placeholder="Search here..."
        onChangeText={setSearchText}
        clearButtonMode="while-editing"
      />
      {searchText.length > 0 ? (
        <View style={styles.searchContainer}>
          <FlatList
            data={searchMessages}
            renderItem={({ item }) => (
              <SearchListItem
                key={item.channelId}
                messageCategory={item.type}
                messagePreview={item.message}
                channelId={item.channelId}
              />
            )}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.viewSort}>
            <ImageButton
              image={btn_recent}
              styles={imageButtonStyles}
              onClick={onClick_btnSortRecent}
              selected={selectedSort == 1 ? true : false}
              selectedStyles={selectedImageButtonStyles}
            />
            <ImageButton
              image={btn_contacts}
              styles={imageButtonStyles}
              onClick={onClick_btnSortContact}
              selected={selectedSort == 2 ? true : false}
              selectedStyles={selectedImageButtonStyles}
            />
            <ImageButton
              image={btn_store_tag}
              styles={imageButtonStyles}
              onClick={onClick_btnSortStore}
              selected={selectedSort == 3 ? true : false}
              selectedStyles={selectedImageButtonStyles}
            />
            <ImageButton
              image={btn_tractor_tag}
              styles={imageButtonStyles}
              onClick={onClick_btnSortTractor}
              selected={selectedSort == 4 ? true : false}
              selectedStyles={selectedImageButtonStyles}
            />
            <ImageButton
              image={btn_trailer_tag}
              styles={imageTrailerButtonStyles}
              onClick={onClick_btnSortTrailer}
              selected={selectedSort == 5 ? true : false}
              selectedStyles={selectedImageTrailerButtonStyles}
            />
          </View>
          <View style={styles.container}>
            <FlatList
              data={allChannels}
              renderItem={({ item }) => (
                <ChatListItem
                  key={item.channelId}
                  channelId={item.channelId}
                  userId={item.userId}
                  initial={item.initials}
                  displayName={item.displayName}
                  routeName={item.route}
                  time={item.timestamp}
                  message={item.message}
                  unreadCount={item.unreadCount}
                />
              )}
            />
          </View>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#555",
  },
  searchContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  textContainer: {
    width: "70%",
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    paddingTop: 5,
    marginLeft: 10,
  },
  imgNewMessage: {
    height: 40,
    width: 20,
    resizeMode: "contain",
  },
  header: {
    marginLeft: 20,
    marginTop: 70,
    flexDirection: "row",
  },
  txtSearch: {
    height: 40,
    margin: 20,
    backgroundColor: "#aaa",
    borderRadius: 10,
    padding: 5,
    fontSize: 15,
  },
  viewSort: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const imageButtonStyles = StyleSheet.create({
  background: {
    width: 60,
    height: 50,
    borderRadius: 10,
  },
  button: {
    width: 50,
    height: 50,
  },
  image: {
    width: 40,
    height: 40,
    margin: 5,
    marginLeft: 10,
    resizeMode: "contain",
  },
});

const selectedImageButtonStyles = StyleSheet.create({
  background: {
    width: 60,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#fff3",
  },
  button: {
    width: 50,
    height: 50,
  },
  image: {
    width: 40,
    height: 40,
    margin: 5,
    marginLeft: 10,
    resizeMode: "contain",
  },
});

const imageTrailerButtonStyles = StyleSheet.create({
  background: {
    width: 60,
    height: 50,
    borderRadius: 10,
  },
  button: {
    width: 60,
    height: 50,
  },
  image: {
    width: 50,
    height: 40,
    margin: 5,
    marginLeft: 10,
    resizeMode: "contain",
  },
});

const selectedImageTrailerButtonStyles = StyleSheet.create({
  background: {
    width: 60,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#fff3",
  },
  button: {
    width: 60,
    height: 50,
  },
  image: {
    width: 50,
    height: 40,
    margin: 5,
    marginLeft: 10,
    resizeMode: "contain",
  },
});

const menuButtonStyle = StyleSheet.create({
  background: {
    width: "10%",
    height: 30,
  },
  button: {
    width: "auto",
    height: "auto",
  },
  image: {
    width: 30,
    height: 30,
    margin: 5,
    marginTop: 10,
    marginRight: 15,
    resizeMode: "contain",
  },
});

const newMessageButtonStyle = StyleSheet.create({
  background: {
    width: "15%",
    height: 40,
  },
  button: {
    width: "auto",
    height: "auto",
  },
  image: {
    width: 40,
    height: 40,
    margin: 5,
    marginTop: 5,
    resizeMode: "contain",
  },
});

export default ChannelPage;
