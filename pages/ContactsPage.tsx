import { View, TextInput, Text, StyleSheet, FlatList } from "react-native";
import common from "../styles/common";
import ImageButton from "../components/controls/ImageButton";
import image_button from "../styles/image_button";
import { router } from "expo-router";
import ContactListItem from "../components/views/ContactListItem";
import { useEffect, useState } from "react";
import User, { getFullName, getInitials, getRole } from "../types/Pimm/User";
import getUsersForSite from "../hooks/useGetUsersForSite";
import LocalStorage from "../utils/LocalStorage";
import Loader from "../components/views/Loader";
import useGetUsersByRole from "../hooks/useGetUsersByRole";

const btn_back = require("../assets/button/back_button.png");

const ContactsPage = () => {
  const [allContacts, setAllContacts] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClick_btnBack = () => {
    console.log("Back button clicked!");
    router.navigate("../");
  };

  const onChangeText_txtSearch = (text: string) => {
    let json = LocalStorage.getData("contacts");
    let contacts = JSON.parse(json!) as User[];

    let newContacts = Array();
    if (text.length > 0) {
      contacts.map((contact) => {
        if (
          getFullName(contact).toLowerCase().includes(text.toLocaleLowerCase())
        ) {
          newContacts.push(contact);
        }
      });
      setAllContacts(newContacts);
    } else {
      setAllContacts(contacts);
    }
  };

  useEffect(() => {
    const getContacts = async () => {
      setIsLoading(true);
      let siteId = LocalStorage.getData("siteId")!;
      let contacts = await useGetUsersByRole();
      // contacts.sort((a, b) => (getFullName(a) > getFullName(b) ? 1 : -1));

      let dispatchers = new Array();
      let drivers = new Array();
      let salesReps = new Array();

      contacts.map((contact) => {
        if (contact.firstName != undefined && contact.firstName.length > 0) {
          contact.roles.map((role) => {
            if (role == "RMS DISPATCHERS") {
              dispatchers.push(contact);
            } else if (role.indexOf("DRIVERS") != -1) {
              drivers.push(contact);
            } else if (role == "SALES REP") {
              salesReps.push(contact);
            }
          });
        }
      });

      let newContacts = new Array();
      newContacts.push(...dispatchers);
      newContacts.push(...drivers);
      newContacts.push(...salesReps);

      setAllContacts(newContacts!);

      dispatchers.map((contact) => {
        console.log(`DISPATCHERS: ${getFullName(contact)}`);
      });

      drivers.map((contact) => {
        console.log(`DRIVERS: ${getFullName(contact)}`);
      });

      salesReps.map((contact) => {
        console.log(`SALES REP: ${getFullName(contact)}`);
      });

      LocalStorage.saveData("contacts", JSON.stringify(newContacts));
      setIsLoading(false);
    };

    getContacts();
  }, []);

  return (
    <View style={common.container}>
      <View style={common.viewHeader}>
        <View style={common.viewNavigation}>
          <ImageButton
            image={btn_back}
            styles={image_button}
            onClick={onClick_btnBack}
          />
          <Text style={styles.txtTitle}>New Message</Text>
        </View>
      </View>
      {isLoading ? (
        <Loader />
      ) : (
        <View>
          <TextInput
            style={styles.txtSearch}
            placeholder="Seach contact..."
            onChangeText={onChangeText_txtSearch}
          />
          <FlatList
            data={allContacts}
            style={styles.tblList}
            renderItem={({ item }) => (
              <ContactListItem
                userId={item.userId}
                initial={getInitials(item)}
                displayName={getFullName(item)}
                role={getRole(item)}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  txtTitle: {
    height: "100%",
    width: "90%",
    fontSize: 22,
    marginTop: 20,
    color: "#555",
    textAlign: "center",
  },
  txtSearch: {
    height: 40,
    margin: 20,
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 5,
    fontSize: 15,
  },
  tblList: {
    height: "100%",
  },
});

export default ContactsPage;
