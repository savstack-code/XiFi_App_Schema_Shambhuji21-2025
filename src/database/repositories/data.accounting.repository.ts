import {
  EntityRepository,
  EntityManager,
  MoreThanOrEqual,
  Equal,
  Not,
  In,
} from "typeorm";
import DataAccounting from "../../shared/database/entities/DataAccounting";
import dateFns from "date-fns";
import DataAccountingModel from "../../shared/models/data.accounting.model";

@EntityRepository()
export class DataAccountingRepository {
  constructor(private manager: EntityManager) {}

  findDataAccountingHistory(
    userName: string,
    currentPage: number,
    pageSize: number,
    userPlanId?: number,
    planType?: string
  ) {
    const whereCondition: any = {
      userName: userName,
      status: Not(In(["SessionPending", "SessionStart"])),
    };
    if (userPlanId) {
      whereCondition.userPlanId = userPlanId;
    }
    if (planType) {
      whereCondition.category = planType;
    }

    return this.manager.find(DataAccounting, {
      order: {
        createdOn: "DESC",
      },
      select: [
        "identifier",
        "userName",
        "startTime",
        "sessionTime",
        "dataUsed",
        "planId",
        "status",
        "userPlanId",
        "category",
        "referenceId",
        "calledStation",
        "callingStation",
        "createdOn",
        "locationId",
      ],
      where: whereCondition,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  }

  createAndSave = (model: DataAccountingModel) => {
    const dataAccounting = new DataAccounting();
    if (model.hasOwnProperty("userName"))
      dataAccounting.userName = model.userName;
    if (model.hasOwnProperty("startTime"))
      dataAccounting.startTime = model.startTime;
    if (model.hasOwnProperty("sessionTime"))
      dataAccounting.sessionTime = model.sessionTime;
    if (model.hasOwnProperty("dataUsed"))
      dataAccounting.dataUsed = model.dataUsed;
    if (model.hasOwnProperty("calledStation"))
      dataAccounting.calledStation = model.calledStation;
    if (model.hasOwnProperty("callingStation"))
      dataAccounting.callingStation = model.callingStation;
    if (model.hasOwnProperty("locationId"))
      dataAccounting.locationId = model.locationId;
    if (model.hasOwnProperty("stopTime"))
      dataAccounting.stopTime = model.stopTime;
    if (model.hasOwnProperty("terminateCause"))
      dataAccounting.terminateCause = model.terminateCause;
    if (model.hasOwnProperty("planId")) dataAccounting.planId = model.planId;
    if (model.hasOwnProperty("userPlanId"))
      dataAccounting.userPlanId = model.userPlanId;
    if (model.hasOwnProperty("status")) dataAccounting.status = model.status;
    dataAccounting.modifiedOn = new Date();
    return this.manager.save(dataAccounting);
  };

  findByUserNamePlanIdStatus = (userName: string, planId: string) => {
    let findOptions: any = {
      where: {
        userName: userName,
        status: In(["SessionStart", "SessionUpdate", "SessionPending"]),
        planId: planId,
      },
    };
    return this.manager.findOne(DataAccounting, findOptions);
  };
}
