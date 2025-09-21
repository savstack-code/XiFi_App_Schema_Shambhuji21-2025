import { accountService } from "../../services/account.service";

export const pdoaTokenAuthentication = async (wanipdoatoken: string) => {
  const result = await accountService.pdoaTokenAuthentication(wanipdoatoken);
  return result;
};
