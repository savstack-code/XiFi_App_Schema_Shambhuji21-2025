export default interface SsidUpdateRequest {
  providerID: string;
  locationName: string;
  state: string;
  type: string;
  cpUrl: string;
  latitude: string;
  langitude: string;
  address: string;
  deviceId: string;
  status: "Active" | "InActive";
  ssid: string;
  openBetween: string;
  avgSpeed: number;
  freeBand: number;
  paymentModes: string;
  description: string;
  loginScheme: string;
}
