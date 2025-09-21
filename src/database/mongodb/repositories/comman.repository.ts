import { GenerateModel } from "../models/generate.model";

export class CommandRepository {
  generateKey = async (collectionType: string, userPrefix: string = "") => {
    let incrementValue = await GenerateModel.findOneAndUpdate(
      { collectionType: collectionType },
      { $inc: { key: 1 } },
      { new: true }
    );

    if (incrementValue === null) {
      let updateData = {
        collectionType,
        key: 1,
      };

      incrementValue = await new GenerateModel(updateData).save();
    }
    if (userPrefix && userPrefix !== "") {
      return `${userPrefix}_${incrementValue.key}`;
    } else {
      return incrementValue.key;
    }
  };
}
