interface TimestampProps {
  seconds: number;
}

export function Timestamp(props: TimestampProps) {
  const { seconds } = props;

  const formatTime = (totalSeconds: number): string => {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
      return '0:00';
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };

  return (
    <div className="bg-neutral-950/75 text-white text-xs font-extrabold px-1 h-5 leading-5 rounded-sm">
      {formatTime(seconds)}
    </div>
  )
}