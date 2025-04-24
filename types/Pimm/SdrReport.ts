type SdrReport = {
  Hierarchy: SdrHierarchy;
};

export type SdrHierarchy = {
  GIS: SdrGis;
  Driver: SdrDriver;
  Tractor: string;
  TrailerName: string;
  RouteName: string;
  DeliveryId: string;
};

export type SdrGis = {
  Stops: [SdrStop];
};

export type SdrStop = {
  Address: string;
  SiteId: string;
  SiteName: string;
  ArrivalTime: string;
  Departure: string;
  ExpectedArrivalTime: string;
  AddressComponents: AddressComponents;
  StopProduct: [SdrStopProduct];
  DeliveryOrder: number;
  Contact: SdrContact;
  SalesRepName: string;
  DeliveryInstructions: string;
  ArmCode: string;
  DisarmCode: string;
  KeyNumber: string;
  SpecialInstructions: string;
};

export type AddressComponents = {
  Address1: string;
  Address2: string;
  City: string;
  Province: string;
  Postal: string;
  CountryCode: string;
};

export type SdrContact = {
  Name: string;
  PhoneNumber: string;
  Email: string;
};

export type SdrStopProduct = {
  RouteShipmentProductID: string;
  PO: string;
};

export type SdrDriver = {
  UserId: string;
  FullName: string;
  Username: string;
};

const getTotalPOs = (StopProduct: [SdrStopProduct]) => {
  var total = 0;
  StopProduct.map((product) => {
    if (product.PO) {
      total = total + 1;
    }
  });
  return total;
};

export default SdrReport;
