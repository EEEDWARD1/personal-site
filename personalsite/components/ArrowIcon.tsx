type ArrowIconProps = {
  direction?: "up-right" | "left";
  className?: string;
};

export default function ArrowIcon({
  direction = "up-right",
  className = "",
}: ArrowIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d={direction === "left" ? "M19 12H5m7-7-7 7 7 7" : "M7 17 17 7M7 7h10v10"} />
    </svg>
  );
}
