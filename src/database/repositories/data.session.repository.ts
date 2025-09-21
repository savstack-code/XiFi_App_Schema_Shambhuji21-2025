import { EntityRepository, EntityManager, In } from "typeorm";
import DataSession from "../../shared/database/entities/DataSession";

@EntityRepository()
export class DataSessionRepository {
  constructor(private manager: EntityManager) {}

  findDataAccountingHistory(
    userName: string,
    currentPage: number,
    pageSize: number,
    planType: string
  ) {
    let whereCondition: any = {
      userName: userName,
      status: In(["SessionComplete"]),
      category: planType,
    };

    return this.manager.find(DataSession, {
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
        "calledStation",
        "callingStation",
        "xiKasuTokens",
        "xiKasuTokenBalance",
        "createdOn",
        "locationId",
      ],
      where: whereCondition,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  }
}
