// Helper function to parse geo location with validation
export const parseGeoLocation = (
  geoLoc: string
): { latitude?: string; longitude?: string } => {
  if (!geoLoc) {
    throw new Error("Geo location is required");
  }

  const latLang = geoLoc.split(",");
  if (latLang.length !== 2) {
    throw new Error(
      "Invalid geo location format: must contain latitude and longitude separated by a comma. Received: " +
        geoLoc
    );
  }

  const latitude = latLang[0]?.trim();
  const longitude = latLang[1]?.trim();

  // Validate that both values are numeric
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error(
      "Invalid geo location format: latitude and longitude must be numbers. Received: " +
        geoLoc
    );
  }

  // Validate latitude range (-90 to 90 degrees)
  if (lat < -90 || lat > 90) {
    throw new Error(
      "Invalid geo location format: latitude must be between -90 and 90 degrees. Received: " +
        geoLoc
    );
  }

  // Validate longitude range (-180 to 180 degrees)
  if (lng < -180 || lng > 180) {
    throw new Error(
      "Invalid geo location format: longitude must be between -180 and 180 degrees. Received: " +
        geoLoc
    );
  }

  return {
    latitude,
    longitude,
  };
};

// Constants to avoid magic strings
const TAG_NAMES = {
  PAYMENTMODES: "PAYMENTMODES",
  FREEBAND: "FREEBAND",
  AVGSPEED: "AVGSPEED",
  OPENBETWEEN: "OPENBETWEEN",
} as const;

// Helper function to extract tag data
export const extractTagData = (
  tagData: any[]
): {
  paymentModes: string;
  freeBand: number;
  avgSpeed: number;
  openBetween: string;
} => {
  const result = {
    paymentModes: "",
    freeBand: 0,
    avgSpeed: 0,
    openBetween: "",
  };

  if (!tagData?.length) return result;

  for (const item of tagData) {
    const tagName = item?.$?.name;
    const tagValue = item?.$?.value;

    switch (tagName) {
      case TAG_NAMES.PAYMENTMODES:
        result.paymentModes = tagValue || "";
        break;
      case TAG_NAMES.FREEBAND:
        result.freeBand = Number(tagValue) || 0;
        break;
      case TAG_NAMES.AVGSPEED:
        result.avgSpeed = Number(tagValue) || 0;
        break;
      case TAG_NAMES.OPENBETWEEN:
        result.openBetween = tagValue || "";
        break;
    }
  }
  return result;
};
