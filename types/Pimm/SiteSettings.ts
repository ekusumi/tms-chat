import LocalStorage from "../../utils/LocalStorage";

type SiteSettings = {
  settings: [PropertyValue];
};

export type PropertyValue = {
  property: string;
  value: string;
};

export const saveSiteSettings = async (siteSettings: SiteSettings) => {
  let json = JSON.stringify(siteSettings);
  await LocalStorage.saveData("siteSettings", json);

  let apiKey = await getSiteSetting("Std:TMS:Messaging:Amity:ApplicationKey");
  let region = await getSiteSetting("Std:TMS:Messaging:Amity:Region");

  await LocalStorage.saveData("amityApiKey", apiKey!);
  await LocalStorage.saveData("amityRegion", region!);
};

export const getSiteSetting = async (siteSetting: string) => {
  let json = await LocalStorage.getData("siteSettings")!;
  let siteSettings = JSON.parse(json!) as SiteSettings;
  var value: string | null = null;

  siteSettings.settings.map((setting) => {
    let property = setting.property;
    if (property == siteSetting) {
      value = setting.value;
    }
  });

  return value;
};

export default SiteSettings;
