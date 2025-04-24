import LocalStorage from "../../utils/LocalStorage";

type SiteSettings = {
  settings: [PropertyValue];
};

export type PropertyValue = {
  property: string;
  value: string;
};

export const saveSiteSettings = (siteSettings: SiteSettings) => {
  let json = JSON.stringify(siteSettings);
  LocalStorage.saveData("siteSettings", json);

  let apiKey = getSiteSetting("Std:TMS:Messaging:Amity:ApplicationKey");
  let region = getSiteSetting("Std:TMS:Messaging:Amity:Region");

  LocalStorage.saveData("amityApiKey", apiKey!);
  LocalStorage.saveData("amityRegion", region!);
};

export const getSiteSetting = (siteSetting: string) => {
  let json = LocalStorage.getData("siteSettings")!;
  let siteSettings = JSON.parse(json) as SiteSettings;
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
