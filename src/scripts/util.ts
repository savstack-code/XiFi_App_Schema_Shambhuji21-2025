import { Model } from "mongoose";
import { DatabaseProvider } from "../database/database.provider";

export const migrate = async <T>(entity: T, mongoModel: Model<any>) => {
  const connection = await DatabaseProvider.getConnection();
  const repo = connection.getRepository(entity as any);
  const data = await repo.find();
  await mongoModel.deleteMany({});
  console.log(`Got total data: ${data.length}`);
  for (const d of data) {
    await new mongoModel(JSON.parse(JSON.stringify(d)))
      .save()
      .catch((err: any) => {
        console.log(`Error on insert: ${err.message}`);
      });
  }
  console.log(`${mongoModel.modelName} migrated`);
};
