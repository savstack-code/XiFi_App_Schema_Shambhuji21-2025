import { now } from "lodash";
import dateFns from "date-fns";

export default class DataPlanUsageModel {
  startDate: string = "";
  remainingBandWidth: number = 0;
  remainingTime: string = "";
  ExpiresOn: string = "";
}
