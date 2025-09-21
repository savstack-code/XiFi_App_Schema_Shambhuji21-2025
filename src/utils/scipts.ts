import XifiVoucherModel from "../database/mongodb/models/xifiVoucher.model";
const excel = require("exceljs");

export const voucherEntry = async () => {
  let arr: any = [];
  const defString = "HBF35-";
  let identifier = 133;
  for (let i: any = 1; i <= 250; i++) {
    let voucherModel: any = {};
    var str = "" + i;
    var pad = "000";
    var ans = pad.substring(0, pad.length - str.length) + str;
    let randomString = Math.round(
      Math.pow(36, 6 + 1) - Math.random() * Math.pow(36, 6)
    )
      .toString(36)
      .slice(1);

    voucherModel.code = defString + ans + "-" + randomString.toUpperCase();
    voucherModel.description = defString + ans;
    voucherModel.expiryTime = "2023-01-01T00:00:00.000+00:00";
    voucherModel.allowCount = 100;
    voucherModel.xiKasuTokens = 500;
    voucherModel.createdOn = new Date();
    voucherModel.identifier = identifier;
    // await XifiVoucherModel.create(voucherModel);
    arr.push(voucherModel);
    identifier++;
  }
  console.log(arr);
  await XifiVoucherModel.insertMany(arr);
  let workbook = new excel.Workbook(); //creating workbook
  let worksheet = workbook.addWorksheet("Voucher Details");

  worksheet.columns = [
    { header: "identifier", key: "identifier", width: 30 },
    { header: "code", key: "code", width: 30 },
    { header: "description", key: "description", width: 30 },
    { header: "xiKasuTokens", key: "xiKasuTokens", width: 30 },
    { header: "allowCount", key: "allowCount", width: 30 },
  ];

  worksheet.addRows(arr);

  worksheet.eachRow(function (row: any, rowNumber: any) {
    row.eachCell((cell: any, colNumber: any) => {
      if (rowNumber == 1) {
        // First set the background of header row
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "f5b914" },
        };
      }
      // Set border of each cell
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    //Commit the changed row to the stream
    row.commit();
  });
  try {
    await workbook.xlsx.writeFile(`public/voucher-list.xlsx`).then(function () {
      console.log("file saved!");
    });

    // console.log(workbook);
  } catch (error) {
    console.log(error);
  }
};
