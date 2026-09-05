"use client";

import React, { useEffect, useMemo, useState } from "react";

type CardState = {
  number: string;     // raw digits (no spaces)
  holder: string;     // uppercase
  month: string;      // "01".."12" or ""
  year: string;       // "2025".."2034" or ""
  cvv: string;        // up to 4
};

type CardValidity = {
  number: boolean; // passes Luhn & length >= 13
  holder: boolean; // >= 2 chars
  month: boolean;  // 01..12
  year: boolean;   // >= current year
  cvv: boolean;    // 3-4 digits
  allValid: boolean;
};

type Props = {
  /** Prefill values (optional) */
  defaultNumber?: string;
  defaultHolder?: string;
  defaultMonth?: string; // "01".."12"
  defaultYear?: string;  // "2025"
  defaultCVV?: string;

  /** Mask digits 5..12 with * on the card front */
  maskMiddle?: boolean;

  /** Override gradient accent rings (front/back :before/:after) */
  ring1?: string; // e.g. "#ff6be7"
  ring2?: string; // e.g. "#7288ff"

  /** Show a submit button */
  showSubmit?: boolean;
  /** Live change callback */
  onChange?: (state: CardState, validity: CardValidity) => void;
  /** Submit callback */
  onSubmit?: (state: CardState, validity: CardValidity) => void;

  /** Class for wrapping container */
  className?: string;
};


function formatNumberSpaces(num: string): string {
  return num.replace(/\s+/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
}

function clampDigits(value: string, maxLen: number) {
  return value.replace(/\D/g, "").slice(0, maxLen);
}

const CreditCardForm = ({
  defaultNumber = "",
  defaultHolder = "",
  defaultMonth = "",
  defaultYear = "",
  defaultCVV = "",
  maskMiddle = true,
  ring1 = "#ff6be7",
  ring2 = "#7288ff",
  showSubmit = true,
  onChange,
  onSubmit,
  className = "",
}: Props) => {
  const [number, setNumber] = useState(clampDigits(defaultNumber, 19));
  const [holder, setHolder] = useState(defaultHolder.toUpperCase());
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);
  const [cvv, setCVV] = useState(clampDigits(defaultCVV, 4));
  const [focusField, setFocusField] = useState<null | "number" | "holder" | "expire" | "cvv">(null);

  const flip = focusField === "cvv";
  const years = useMemo(() => {
    const start = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => String(start + i));
  }, []);

  // Validation
  const validity: CardValidity = useMemo(() => {
    const nValidLength = number.length >= 13; // allow 13..19
    const numberValid = nValidLength;
    const holderValid = holder.trim().length >= 2;
    const monthValid = !!month && +month >= 1 && +month <= 12;
    const yearValid = !!year && +year >= new Date().getFullYear();
    const cvvValid = /^\d{3,4}$/.test(cvv);
    return {
      number: numberValid,
      holder: holderValid,
      month: monthValid,
      year: yearValid,
      cvv: cvvValid,
      allValid: numberValid && holderValid && monthValid && yearValid && cvvValid,
    };
  }, [number, holder, month, year, cvv]);

  // Notify parent on change
  useEffect(() => {
    onChange?.({ number, holder, month, year, cvv }, validity);
  }, [number, holder, month, year, cvv, validity, onChange]);

  // Build 16+ slots for display (we’ll show up to 16; visual)
  const displayDigits = useMemo(() => number.slice(0, 16).split(""), [number]);

  const displayedSlots = useMemo(() => {
    const arr: { textTop: string; filed: boolean }[] = [];
    for (let i = 0; i < 16; i++) {
      let content = "#";
      if (i < displayDigits.length) {
        const d = displayDigits[i];
        const shouldMask = maskMiddle && i >= 4 && i <= 11;
        content = shouldMask ? "*" : d;
      }
      arr.push({ textTop: content, filed: i < displayDigits.length });
    }
    return arr;
  }, [displayDigits, maskMiddle]);

  const highlightClass = (() => {
    switch (focusField) {
      case "number":
        return "highlight__number";
      case "holder":
        return "highlight__holder";
      case "expire":
        return "highlight__expire";
      case "cvv":
        return "highlight__cvv";
      default:
        return "hidden";
    }
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ number, holder, month, year, cvv }, validity);
  };

  return (
    <section className={`ccp ${className}`}>
      <div className="wrap">
        {/* CARD */}
        <section id="card" className={`card ${flip ? "flip" : ""}`}>
          <div id="highlight" className={highlightClass} />

          {/* FRONT */}
          <section className="card__front" style={{ ["--ring1" as any]: ring1, ["--ring2" as any]: ring2 }}>
            <div className="card__header">
              <div>CreditCard</div>
              <svg xmlns="http://www.w3.org/2000/svg" height="40" width="60" viewBox="-96 -98.908 832 593.448">
                <path fill="#ff5f00" d="M224.833 42.298h190.416v311.005H224.833z" />
                <path
                  d="M244.446 197.828a197.448 197.448 0 0175.54-155.475 197.777 197.777 0 100 311.004 197.448 197.448 0 01-75.54-155.53z"
                  fill="#eb001b"
                />
                <path
                  d="M621.101 320.394v-6.372h2.747v-1.319h-6.537v1.319h2.582v6.373zm12.691 0v-7.69h-1.978l-2.307 5.493-2.308-5.494h-1.977v7.691h1.428v-5.823l2.143 5h1.483l2.143-5v5.823z"
                  fill="#f79e1b"
                />
                <path
                  d="M640 197.828a197.777 197.777 0 01-320.015 155.474 197.777 197.777 0 000-311.004A197.777 197.777 0 01640 197.773z"
                  fill="#f79e1b"
                />
              </svg>
            </div>

            {/* Number slots with slide animation */}
          <div id="card_number" className="card__number" aria-label="Card number">
            {displayedSlots.map((slot, idx) => (
              <span key={idx} className="slot">
                <span className={`digit ${slot.filed ? "filed" : ""}`}>
                  <span className="row placeholder">#</span>
                  <span className="row value">{slot.textTop}</span>
                </span>
              </span>
            ))}
           </div>

            <div className="card__footer">
              <div className="card__holder">
                <div className="card__section__title">Card Holder</div>
                <div id="card_holder">{holder || "NAME ON CARD"}</div>
              </div>
              <div className="card__expires">
                <div className="card__section__title">Expires</div>
                <span id="card_expires_month">{month || "MM"}</span>/
                <span id="card_expires_year">{year ? year.slice(-2) : "YY"}</span>
              </div>
            </div>
          </section>

          {/* BACK */}
          <section className="card__back" style={{ ["--ring1" as any]: ring1, ["--ring2" as any]: ring2 }}>
            <div className="card__hide_line" />
            <div className="card_cvv">
              <span>CVV</span>
              <div id="card_cvv_field" className="card_cvv_field">
                {"*".repeat(cvv.length)}
              </div>
            </div>
          </section>
        </section>

        {/* FORM */}
        <form className="form" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="number">Card Number</label>
            <input
              id="number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={formatNumberSpaces(number)}
              onChange={(e) => setNumber(clampDigits(e.target.value, 19))}
              onFocus={() => setFocusField("number")}
              onBlur={() => setFocusField(null)}
              aria-invalid={!validity.number}
            />
            {!validity.number && number.length >= 13 && (
              <small className="err">Card number looks invalid</small>
            )}
          </div>

          <div>
            <label htmlFor="holder">Card Holder</label>
            <input
              id="holder"
              type="text"
              autoComplete="cc-name"
              placeholder="JANE DOE"
              value={holder}
              onChange={(e) => setHolder(e.target.value.toUpperCase())}
              onFocus={() => setFocusField("holder")}
              onBlur={() => setFocusField(null)}
              aria-invalid={!validity.holder}
            />
          </div>

          <div className="filed__group">
            <div>
              <label>Expiration Date</label>
              <div className="filed__date">
                <select
                  id="expiration_month"
                  value={month || ""}
                  onChange={(e) => setMonth(e.target.value)}
                  onFocus={() => setFocusField("expire")}
                  onBlur={() => setFocusField(null)}
                  aria-invalid={!validity.month}
                >
                  <option value="" disabled>
                    Month
                  </option>
                  {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  id="expiration_year"
                  value={year || ""}
                  onChange={(e) => setYear(e.target.value)}
                  onFocus={() => setFocusField("expire")}
                  onBlur={() => setFocusField(null)}
                  aria-invalid={!validity.year}
                >
                  <option value="" disabled>
                    Year
                  </option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="cvv">CVV</label>
              <input
                id="cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="***"
                value={cvv}
                onChange={(e) => setCVV(clampDigits(e.target.value, 4))}
                onFocus={() => setFocusField("cvv")}
                onBlur={() => setFocusField(null)}
                aria-invalid={!validity.cvv}
              />
            </div>
          </div>

          {showSubmit && (
            <button className="submit" type="submit" disabled={!validity.allValid} aria-disabled={!validity.allValid}>
              {validity.allValid ? "Submit" : "Complete all fields"}
            </button>
          )}
        </form>
      </div>

      <style jsx>{`
        .ccp {
          width: 100vw;
          display: flex;
          justify-content: center;
          padding: 24px;
          background: #fbfcff;
          color: #0d0c22;
        }
        .wrap {
          width: 100vw;
          max-width: 1000px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 920px) {
          .wrap {
            grid-template-columns: 1fr;
          }
        }

        * {
          box-sizing: border-box;
        }

        #highlight {
          position: absolute;
          border: 1px solid #fff;
          border-radius: 12px;
          z-index: 1;
          width: 0;
          height: 0;
          top: 0;
          left: 0;
          box-shadow: 0 0 5px #fff;
          transition: 0.3s;
        }
        #highlight.highlight__number {
          width: 346px;
          height: 40px;
          top: 92px;
          left: 18px;
        }
        #highlight.highlight__holder {
          width: 264px;
          height: 56px;
          top: 156px;
          left: 18px;
        }
        #highlight.highlight__expire {
          width: 86px;
          height: 56px;
          top: 156px;
          left: 323px;
        }
        #highlight.highlight__cvv {
          width: 381px;
          height: 91px;
          top: 83px;
          left: 18px;
        }
        #highlight.hidden {
          display: none;
        }

        .card {
          position: relative;
          width: 100%;
          max-width: 420px;
          margin: 0 auto;
          transform-style: preserve-3d;
          transition: 0.8s;
          perspective: 1000px;
        }
        .card.flip {
          transform: rotateY(180deg);
        }

        .card__front,
        .card__back {
          width: 100%;
          max-width: 420px;
          height: 233px;
          border-radius: 20px;
          padding: 24px 30px 30px;
          background: linear-gradient(to right bottom, #323941, #061018);
          box-shadow: 0 33px 50px -15px rgba(50, 55, 63, 0.66);
          color: #fff;
          overflow: hidden;
          margin: 0 auto;
          backface-visibility: hidden;
          position: relative;
        }

        @media (max-width: 450px) {
          .card__front,
          .card__back {
            padding: 12px 14px 16px;
            height: 206px;
          }
          /* shrink highlight boxes for small screens */
          #highlight.highlight__number {
            width: 300px;
            left: 14px;
          }
          #highlight.highlight__holder {
            width: 220px;
            left: 14px;
          }
          #highlight.highlight__expire {
            left: 280px;
          }
          #highlight.highlight__cvv {
            width: 330px;
            left: 14px;
          }
        }

        .card__back {
          position: absolute;
          top: 0;
          left: 0;
          transform: rotateY(180deg);
          padding: 24px 0 0;
        }

        .card__front::before,
        .card__back::before {
          content: "";
          position: absolute;
          border: 16px solid var(--ring1, ${ring1});
          border-radius: 100%;
          left: -17%;
          top: -45px;
          height: 300px;
          width: 300px;
          filter: blur(13px);
        }

        .card__front::after,
        .card__back::after {
          content: "";
          position: absolute;
          border: 16px solid var(--ring2, ${ring2});
          border-radius: 100%;
          width: 300px;
          top: 55%;
          left: -200px;
          height: 300px;
          filter: blur(13px);
        }

        .card__hide_line {
          height: 40px;
          width: 100%;
          background-color: #6b7280;
          position: relative;
          z-index: 1;
        }

        .card_cvv {
          position: relative;
          z-index: 1;
          margin-top: 24px;
          padding: 0 32px;
          display: flex;
          flex-direction: column;
          align-items: end;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .card_cvv_field {
          margin-top: 6px;
          background-color: #fff;
          border-radius: 12px;
          height: 44px;
          width: 100%;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: end;
          padding: 0 12px;
          font-size: 25px;
          line-height: 21px;
        }

        .card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }

        .card__number {
          font-size: 22px;
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
          display: flex;
          height: 33px;         
          overflow: hidden;
          color: #fff;
        }

        .card__number .slot {
          display: inline-flex;
          margin-right: 0;
        }

        .card__number .slot:nth-child(4n) {
          margin-right: 10px;    /* group spacing */
        }

        .card__number .digit {
          display: flex;
          flex-direction: column;
          height: 33px;          /* one row height */
          line-height: 33px;
          transition: transform 0.2s;
        }

        .card__number .digit.filed {
          transform: translateY(-33px); /* slide to reveal the value row */
        }

        .card__number .row {
          height: 33px;
          display: block;
        }

        .card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }
        .card__holder {
          text-transform: uppercase;
        }
        .card__section__title {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .form {
          border-radius: 12px;
          background: #fff;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 24px;
          border: 1px solid #f1f1f1;
          box-shadow: 0 0 40px rgba(50, 55, 63, 0.16);
          display: grid;
          gap: 12px;
          color: #0d0c22;
        }

        label {
          display: block;
          margin: 6px 0 4px;
          color: #0d0c22;
          font-weight: 500;
        }

        input,
        select {
          height: 52px;
          display: block;
          width: 100%;
          border: 1px solid #6b7280;
          padding: 18px 20px;
          transition: outline 200ms ease, box-shadow 200ms ease;
          border-radius: 12px;
          outline: none;
          background-color: #fff;
          color: #0d0c22;
          font-size: 16px;
        }

        input:focus,
        select:focus {
          border: 1px solid #000;
          outline: 4px solid rgba(0, 0, 0, 0.1);
        }

        select {
          padding: 0 20px;
        }

        .filed__group {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        @media (max-width: 560px) {
          .filed__group {
            grid-template-columns: 1fr;
          }
        }

        .filed__date {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .err {
          color: #b42318;
          font-size: 12px;
          margin-top: 4px;
        }

        .submit {
          margin-top: 8px;
          height: 48px;
          border: none;
          border-radius: 10px;
          background: #0d0c22;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          opacity: ${validity.allValid ? 1 : 0.6};
        }
      `}</style>
    </section>
  );
};

export { CreditCardForm };
export type { CardState, CardValidity };
