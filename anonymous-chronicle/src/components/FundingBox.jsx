import React, { useEffect, useState } from "react";
import axios from "axios";
import { Copy, CheckCircle, Heart } from "lucide-react";

const FundingBox = () => {
  const [upiId, setUpiId] = useState("");
  const [businessName, setBusinessName] = useState(
    "Global Relief Help"
  );
  const [qrImage, setQrImage] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFunding = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/funding`
      );

      const funding = response.data.funding;

      setBusinessName(funding.businessName);
      setUpiId(funding.upiId);
      setQrImage(funding.qrImage);
    } catch (error) {
      console.error("Fetch funding error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunding();
  }, []);

  const copyUPI = async () => {
    if (!upiId) return;

    try {
      await navigator.clipboard.writeText(upiId);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy error:", error);
    }
  };

  const openUPI = () => {
    if (!upiId) return;

    const upiUrl =
      `upi://pay?pa=${encodeURIComponent(upiId)}` +
      `&pn=${encodeURIComponent(businessName)}` +
      `&cu=INR`;

    window.location.href = upiUrl;
  };

  if (loading) {
    return (
      <section className="max-w-md mx-auto mt-12 px-4 pb-12">
        <div className="bg-[oklch(56%_0.021_213.5)] border border-pink-100 rounded-2xl p-6 text-center">
          <p className="text-slate-400">
            Loading payment information...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-md mx-auto mt-12 px-4 pb-12">
      <div className="bg-[oklch(56%_0.021_213.5)] border border-[oklch(56%_0.021_213.5)] rounded-2xl p-6 text-center">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-emerald-500/10">
            <Heart
              size={30}
              className="text-emerald-400"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-100">
          Support Global Relief Help
        </h2>

        <p className="text-green-400 mt-2 mb-6">
         Your support helps Global Relief Help care for all living beings in need
        </p>

        {/* QR */}
        {qrImage ? (
          <>
            <div className="bg-white p-4 rounded-xl inline-block">
              <img
                src={qrImage}
                alt="Business payment QR code"
                className="w-56 h-56 object-contain"
              />
            </div>

            <p className="text-slate-400 text-sm mt-4">
              Scan this QR code with your UPI app
            </p>
          </>
        ) : (
          <div className="bg-slate-800 rounded-xl p-8">
            <p className="text-slate-500">
              Payment QR is not available yet.
            </p>
          </div>
        )}

        {/* UPI ID */}
        {upiId && (
          <div className="mt-6">

            <p className="text-sm text-green-500 mb-2">
              Business UPI ID
            </p>

            <div className="flex gap-2">

              <div className="flex-1 bg-gray-600 border border-blue-400 rounded-lg px-3 py-3 text-sm text-slate-300 break-all">
                {upiId}
              </div>

              <button
                onClick={copyUPI}
                className="p-3 bg-gray-600 border border-blue-600 rounded-lg hover:bg-slate-700"
                title="Copy UPI ID"
              >
                {copied ? (
                  <CheckCircle
                    size={20}
                    className="text-emerald-400"
                  />
                ) : (
                  <Copy size={20} />
                )}
              </button>

            </div>

            {copied && (
              <p className="text-emerald-400 text-sm mt-2">
                UPI ID copied!
              </p>
            )}

          </div>
        )}

        {/* Pay Button */}
        {upiId && (
          <button
            onClick={openUPI}
            className="w-full mt-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition"
          >
            Pay with UPI
          </button>
        )}

        <p className="text-xs text-slate-500 mt-5">
          Payments are processed through your UPI/payment provider.
        </p>

      </div>
    </section>
  );
};

export default FundingBox;

