import { useState } from "react";

export default function GlassesSizingSection({
  measurements = {},
  productImage,
}) {
  const { lens = 53, temple = 140, bridge = 19, fit = "medium" } = measurements;

  const [tab, setTab] = useState("measurements");

  return (
    <div className="w-full bg-white py-16 border-t border-black/10 mt-10">
      <div className="container mx-auto px-6">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => setTab("measurements")}
            className={`px-6 py-2 rounded-full font-semibold border transition ${
              tab === "measurements"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-black/30 hover:border-black"
            }`}
          >
            Measurements & Fit
          </button>

          <button
            onClick={() => setTab("sizeguide")}
            className={`px-6 py-2 rounded-full font-semibold border transition ${
              tab === "sizeguide"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-black/30 hover:border-black"
            }`}
          >
            Size Guide
          </button>
        </div>

        {/* ------------------------------------------------------ */}
        {/* MEASUREMENTS TAB */}
        {tab === "measurements" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 px-4 md:px-16">
            {/* LEFT COLUMN */}
            <div>
              {/* Measurements */}
              <h3 className="text-xl font-bold mb-8 text-black">
                Product Measurements
              </h3>

              <div className="flex items-start gap-10 mb-14">
                {/* Lens */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src="/front-size.avif"
                    className="w-16 h-16 object-contain mb-3"
                    alt="Lens size"
                  />
                  <p className="font-semibold text-black">Lens Size</p>
                  <p className="text-gray-600 text-sm">{lens} mm</p>
                </div>

                {/* Temple */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src="/side-size.avif"
                    className="w-16 h-16 object-contain mb-3"
                    alt="Temple size"
                  />
                  <p className="font-semibold text-black">Temple Size</p>
                  <p className="text-gray-600 text-sm">{temple} mm</p>
                </div>

                {/* Bridge */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src="/front2.svg"
                    className="w-16 h-16 object-contain mb-3"
                    alt="Bridge size"
                  />
                  <p className="font-semibold text-black">Bridge Size</p>
                  <p className="text-gray-600 text-sm">{bridge} mm</p>
                </div>
              </div>

              {/* Fit */}
              <h3 className="text-xl font-bold mb-6 text-black">Fit</h3>

              <div className="flex items-center gap-12">
                {/* Small */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src="/narrow-face.png"
                    className="w-16 h-16 object-contain mb-2"
                    alt="Small"
                  />
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border 
                    ${fit === "small" ? "border-black" : "border-black/30"}`}
                  >
                    Small
                  </span>
                </div>

                {/* Medium */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src="/mediuam-facesvg.svg"
                    className="w-16 h-16 object-contain mb-2"
                    alt="Medium"
                  />
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border 
                    ${fit === "medium" ? "border-black" : "border-black/30"}`}
                  >
                    Medium
                  </span>
                </div>

                {/* Large */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src="/wide-face.svg"
                    className="w-16 h-16 object-contain mb-2"
                    alt="Large"
                  />
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border
                    ${fit === "large" ? "border-black" : "border-black/30"}`}
                  >
                    Large
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN – PRODUCT IMAGE */}
            <div className="flex items-center justify-center">
              <img
                src={productImage || "/glasses-side.png"}
                className="w-[380px] md:w-[420px] object-contain"
                alt="Glasses side view"
              />
            </div>
          </div>
        )}

        {/* ------------------------------------------------------ */}
        {/* SIZE GUIDE TAB */}
        {tab === "sizeguide" && (
          <div className="bg-white border border-black/10 rounded-xl p-10 px-4 md:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
              {/* Existing eyeglasses guide */}
              <div className="flex flex-col gap-6">
                <h3 className="text-xl font-semibold text-black">
                  Use your existing eyeglasses
                </h3>
                <div className="flex gap-4">
                  <img
                    src="/front-size.avif"
                    className="w-[150px] object-contain"
                    alt="Guide"
                  />
                  <img
                    src="/side-size.avif"
                    className="w-[150px] object-contain"
                    alt="Guide"
                  />
                </div>
                <ol className="list-decimal ml-6 space-y-2 text-gray-700">
                  <li>Take the eyeglasses you already wear comfortably.</li>
                  <li>
                    Look at the inner side of the temple arm for printed
                    measurements.
                  </li>
                  <li>
                    You will find three numbers such as:{" "}
                    <strong>53 19 140</strong>.
                  </li>
                  <li>Interpret the numbers:</li>
                  <ul className="list-disc ml-8 space-y-1">
                    <li>First number → Lens width.</li>
                    <li>Second number → Bridge width.</li>
                    <li>Third number → Temple length.</li>
                  </ul>
                  <li>
                    Match these numbers with the product measurement chart.
                  </li>
                  <li>
                    A ±2 mm difference in lens or bridge width is still
                    considered a good fit.
                  </li>
                  <li>
                    If your existing pair fits well, choose similar
                    measurements.
                  </li>
                </ol>
              </div>

              {/* Credit card guide */}
              <div className="flex flex-col gap-6">
                <h3 className="text-xl font-semibold text-black">
                  Measure with a credit card
                </h3>
                <div className="flex">
                  {" "}
                  <img
                    src="/debit-face1.svg"
                    className="w-[100px] object-contain"
                    alt="Card sizing"
                  />
                  <img
                    src="/debit-face2.svg"
                    className="w-[100px] object-contain"
                    alt="Card sizing"
                  />
                  <img
                    src="/debit-face3.svg"
                    className="w-[100px] object-contain"
                    alt="Card sizing"
                  />
                </div>
                <ol className="list-decimal ml-6 space-y-2 text-gray-700">
                  <li>
                    Stand in front of a mirror holding a standard credit card
                    vertically.
                  </li>
                  <li>
                    Place the short edge of the card so it rests at the center
                    of your nose bridge.
                  </li>
                  <li>
                    Check where the other end of the card reaches on your face:
                  </li>
                  <ul className="list-disc ml-8 space-y-1">
                    <li>
                      If the card’s edge doesn’t reach your eye corner → Small
                      fit.
                    </li>
                    <li>
                      If the card ends exactly at your eye corner → Medium fit.
                    </li>
                    <li>
                      If the card passes beyond your eye corner → Large fit.
                    </li>
                  </ul>
                  <li>
                    The card width (~53–54 mm) helps estimate your lens size.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
