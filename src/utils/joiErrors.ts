import { ValidationErrorItem } from "joi";

export const JoiErrors = (errors: ValidationErrorItem[]) => {
  errors.forEach((err) => {
    let context: any = err.context;
    switch (err.type) {
      case "any.required":
        err.message = `${context.label} is required.`;
        break;
      case "any.empty":
        err.message = `${context.label} should not be empty.`;
        break;
      case "string.email":
        err.message = `${context.label} must be a valid email.`;
        break;
      case "string.length":
        err.message = `${context.label} must be a ${context.limit}-digit String.`;
        break;
      case "string.min":
        err.message = `${context.label} must be a ${context.limit}-digit String.`;
        break;
      case "string.max":
        err.message = `${context.label} must be a ${context.limit}-digit String.`;
        break;
      case "string.regex.base":
        err.message = `${context.label} not in valid format.`;
        break;
      case "number.base":
        err.message = `${context.label} must be a Number.`;
        break;
      case "number.integer":
        err.message = `${context.label} must be an integer.`;
        break;
      case "number.min":
        err.message = `${context.label} must be a minimum ${
          context.limit.toString().length
        }-digit Number.`;
        break;
      case "number.max":
        err.message = `${context.label} must be a maximum ${
          context.limit.toString().length
        }-digit Number.`;
        break;
      case "object.with":
        err.message = `${context.mainWithLabel} missing required peer ${context.peerWithLabel}.`;
        break;
      case "any.allowOnly":
        let errorMessage =
          context.valids.length > 1
            ? `in ${context.valids.join(", ")}`
            : `${context.valids[0]}`;
        err.message = `${context.label} must be ${errorMessage}.`;
        break;
      case "number.positive":
        err.message = `${context.label} must be a positive Number.`;
        break;
      case "number.greater":
        err.message = `${context.label} must be greater than ${context.limit}.`;
        break;
      case "number.less":
        err.message = `${context.label} must be less than ${context.limit}.`;
        break;
      case "object.allowUnknown":
        err.message = `${context.key} is not allowed.`;
        break;
      case "object.missing":
        err.message = `${
          context.label
        } must contain at least one of [${context.peersWithLabels.join(
          ", "
        )}].`;
        break;
      case "object.xor":
        err.message = `Must contain one of [${context.peersWithLabels.join(
          ", "
        )}] in the request, but not all.`;
        break;
      default:
        break;
    }
  });
  return errors;
};
