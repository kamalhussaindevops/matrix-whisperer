const categoryGradients: Record<string, { gradient: string; icon: string }> = {
  Numerology: {
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  Compatibility: {
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    icon: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  },
  Forecasting: {
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    icon: "M22 12h-4l-3 9L9 3l-3 9H2",
  },
  Spirituality: {
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  },
};

const fallback = {
  gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
};

interface Props {
  category: string;
  title: string;
  ogImage?: string;
}

export default function BlogCardImage({ category, title, ogImage }: Props) {
  // If admin uploaded a real image — show it
  if (ogImage) {
    return (
      <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ogImage}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback: category gradient with icon
  const config = categoryGradients[category] ?? fallback;
  return (
    <div
      style={{
        background: config.gradient,
        height: "160px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          top: "-30px",
          right: "-20px",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          bottom: "-20px",
          left: "20px",
        }}
      />
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={config.icon} />
      </svg>
    </div>
  );
}
