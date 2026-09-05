export default function RoadDivider() {
  return (
    <div
      aria-hidden="true"
      className="tread relative h-10 overflow-hidden bg-caucho sm:h-12"
    >
      <div className="road-line absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2" />
    </div>
  );
}
