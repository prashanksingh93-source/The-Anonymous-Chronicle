const Funding = require("../models/funding.model");

const saveFunding = async (req, res) => {
  try {
    const {
      businessName,
      upiId,
      qrImage,
    } = req.body;

    if (!businessName || !upiId || !qrImage) {
      return res.status(400).json({
        success: false,
        message:
          "Business name, UPI ID and QR image are required",
      });
    }

    let funding = await Funding.findOne();

    if (funding) {
      funding.businessName = businessName;
      funding.upiId = upiId;
      funding.qrImage = qrImage;

      await funding.save();
    } else {
      funding = await Funding.create({
        businessName,
        upiId,
        qrImage,
      });
    }

    res.status(200).json({
      success: true,
      message: "Funding settings saved successfully",
      funding,
    });
  } catch (error) {
    console.error("Save funding error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save funding settings",
    });
  }
};

const getFunding = async (req, res) => {
  try {
    const funding = await Funding.findOne();

    if (!funding) {
      return res.status(404).json({
        success: false,
        message: "Funding settings not found",
      });
    }

    res.status(200).json({
      success: true,
      funding,
    });
  } catch (error) {
    console.error("Get funding error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get funding settings",
    });
  }
};

module.exports = {
  saveFunding,
  getFunding,
};