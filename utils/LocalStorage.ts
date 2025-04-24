import AsyncStorage from "@react-native-async-storage/async-storage";

class Storage {
  private static instance: Storage;
  private map!: Map<string, string>;
  private constructor() {}

  public static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
      Storage.instance.map = new Map();
    }
    return Storage.instance;
  }

  public setItem(key: string, value: string) {
    this.map.set(key, value);
  }

  public getItem(key: string) {
    return this.map.get(key);
  }
}

const LocalStorage = {
  saveData: (key: string, value: string) => {
    Storage.getInstance().setItem(key, value);
  },

  getData: (key: string) => {
    return Storage.getInstance().getItem(key);
  },

  removePersistentData: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("removeData Error: " + error);
    }
  },

  savePersistentData: async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
  },

  getPersistentData: async (key: string) => {
    let value = await AsyncStorage.getItem(key);
    return value;
  },
};

export default LocalStorage;
