import React from "react";

const fmt = new Intl.NumberFormat("en-US");

function useLiveNumber(start: number, perSecond: number) {
  const [value, setValue] = React.useState(start);
  React.useEffect(() => {
    const t0 = Date.now();
    const id = setInterval(() => {
      const dt = (Date.now() - t0) / 1000;
      setValue(start + dt * perSecond);
    }, 60);
    return () => clearInterval(id);
  }, [start, perSecond]);
  return value;
}

function SplitFlapNumber({ value }: { value: number }) {
  const text = React.useMemo(() => fmt.format(Math.floor(value)), [value]);
  const prevTextRef = React.useRef(text);
  const prevText = prevTextRef.current;
  const chars = React.useMemo(() => text.split(""), [text]);
  const prevChars = React.useMemo(() => prevText.split(""), [prevText]);

  React.useEffect(() => {
    prevTextRef.current = text;
  }, [text]);
  return (
    <div className="tiles" aria-label={text} role="img">
      {chars.map((ch, i) => {
        const changed = prevChars[i] !== ch;
        const isComma = ch === ",";
        return (
          <div
            key={`${i}-${ch}`}
            className={`tile ${isComma ? "comma" : "digit"} ${changed ? "changed flip" : ""}`}
            aria-hidden="true"
          >
            <span className="char">{ch}</span>
            <span className="split" />
          </div>
        );
      })}
    </div>
  );
}

function StatRow({
  label,
  start,
  rate,
}: {
  label: string;
  start: number;
  rate: number;
}) {
  const value = useLiveNumber(start, rate);
  return (
    <div className="row">
      <div className="label">{label}</div>
      <div className="number">
        <SplitFlapNumber value={value} />
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <div className="app">
      <div className="backdrop" />
      <section className="container">
        <header className="header">
          <h1>14.9M+ deploys per month (and counting)</h1>
          <p>
            Real-time usage showing totals for users and services, along with
            30-day deploys, requests, and logs.
          </p>
        </header>

        <div className="board">
          <StatRow label="USERS" start={1_807_890} rate={0.7} />
          <StatRow label="SERVICES" start={5_247_069} rate={0.5} />
          <StatRow label="DEPLOYS" start={14_938_793} rate={1.2} />
          <StatRow label="REQUESTS" start={55_503_077_000} rate={22} />
          <StatRow label="LOGS" start={247_380_891_723} rate={55} />
        </div>

        <div className="fineprint">
          Numbers update continuously; refresh resets starting points.
        </div>
      </section>
    </div>
  );
}
