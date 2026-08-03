import React from "react";

export default function MapCanvas() {
  return (
    <div
      className="relative w-full h-full min-h-[460px] lg:min-h-[520px] overflow-hidden select-none flex items-center justify-center"
      style={{
        background: `
          radial-gradient(at 15% 15%, #FFA3D7 0px, transparent 55%),
          radial-gradient(at 85% 15%, #8B9DFF 0px, transparent 55%),
          radial-gradient(at 50% 45%, #FF7626 0px, transparent 60%),
          radial-gradient(at 80% 85%, #FFE270 0px, transparent 50%),
          radial-gradient(at 15% 85%, #6A79FF 0px, transparent 55%),
          #FFA566
        `,
      }}
    >
    </div>
  );
}
