import SSIDModel from "../../database/mongodb/models/ssid.model";

console.log(`Running ssid update script`);

SSIDModel.updateMany(
  { langitude: { $ne: null as any }, latitude: { $ne: null as any } },
  [
    {
      $set: {
        "location.type": "Point",
        "location.coordinates": [
          { $toDecimal: "$langitude" },
          { $toDecimal: "$latitude" },
        ],
      },
    },
  ]
)
  .then((r) => {
    console.log("updated:", r);
  })
  .catch((err) => {
    console.log("error:", err);
  });
