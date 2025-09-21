import { dataUsageService } from "../../services/data.usage.service";
import { IDataUsageHistoryRequest } from "../../models/schema/dataUsage/data.usage.filter.schema";

export const
  getDataAccountingHistory = async (
    dataAccountinghistoryrequest: IDataUsageHistoryRequest
  ) => {
    const result = await dataUsageService.getDataAccountingHistory(
      dataAccountinghistoryrequest
    );
    return result;
  };
