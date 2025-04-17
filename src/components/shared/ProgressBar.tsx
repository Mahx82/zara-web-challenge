type Props = {
  progress: number;
  label: string;
};

export function ProgressBar({ progress = 0, label = 'Loading' }: Props) {
  return (
    <div
      className="absolute top-0 left-0 h-2 bg-marvel-red transition-all duration-300 ease-in-out"
      role="progressbar"
      aria-label={label}
      aria-valuenow={progress}
      style={{ width: `${progress}%` }}
    ></div>
  );
}
