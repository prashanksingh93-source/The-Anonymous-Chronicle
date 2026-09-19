const mongoose = require("mongoose");

const fundingSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    upiId: {
      type: String,
      required: true,
      trim: true,
    },

    qrImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Funding = mongoose.model("Funding", fundingSchema);

module.exports = Funding;