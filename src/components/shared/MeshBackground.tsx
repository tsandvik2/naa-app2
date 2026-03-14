"use client";

export function MeshBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(255,45,85,.45), transparent 70%)",
          top: -150,
          left: -100,
          filter: "blur(90px)",
          opacity: 0.22,
          animation: "d1 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(0,240,255,.18), transparent 70%)",
          bottom: -100,
          right: -80,
          filter: "blur(90px)",
          opacity: 0.22,
          animation: "d2 15s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 280,
          height: 280,
          background:
            "radial-gradient(circle, rgba(255,214,10,.12), transparent 70%)",
          top: "40%",
          left: "25%",
          filter: "blur(90px)",
          opacity: 0.22,
          animation: "d3 10s ease-in-out infinite",
        }}
      />
    </div>
  );
}
