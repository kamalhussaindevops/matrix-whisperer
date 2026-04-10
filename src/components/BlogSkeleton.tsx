export default function BlogSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "24px",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            border: "1px solid #eef2ff",
            overflow: "hidden",
          }}
        >
          {/* Image placeholder */}
          <div
            className="shimmer"
            style={{
              width: "100%",
              aspectRatio: "16/9",
            }}
          />
          <div style={{ padding: "20px" }}>
            {/* Badge */}
            <div
              className="shimmer"
              style={{ width: "80px", height: "22px", borderRadius: "999px", marginBottom: "10px" }}
            />
            {/* Title */}
            <div
              className="shimmer"
              style={{ width: "100%", height: "20px", borderRadius: "4px", marginBottom: "8px" }}
            />
            <div
              className="shimmer"
              style={{ width: "70%", height: "20px", borderRadius: "4px", marginBottom: "12px" }}
            />
            {/* Excerpt */}
            <div
              className="shimmer"
              style={{ width: "100%", height: "14px", borderRadius: "4px", marginBottom: "6px" }}
            />
            <div
              className="shimmer"
              style={{ width: "90%", height: "14px", borderRadius: "4px", marginBottom: "6px" }}
            />
            <div
              className="shimmer"
              style={{ width: "60%", height: "14px", borderRadius: "4px", marginBottom: "16px" }}
            />
            {/* Meta */}
            <div
              className="shimmer"
              style={{ width: "40%", height: "12px", borderRadius: "4px" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
