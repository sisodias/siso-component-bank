"use client";

import { useState } from "react";
import { BRANDS, waLink } from "./tiresearch-utils/site";
import { WhatsAppIcon } from "./tiresearch-utils/WhatsAppIcon";

/**
 * TireSearch — el elemento firma de la página.
 * El formulario se lee igual que el flanco de la cubierta: 205 / 55 R 16.
 *
 * Versión mobile-first: una sola línea de ayuda (en vez de tres),
 * campos compactos y separadores alineados con los selects.
 */

const ANCHOS = [165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275];
const PERFILES = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
const LLANTAS = [13, 14, 15, 16, 17, 18, 19, 20];

const selectBase =
  "w-full appearance-none rounded-xl border-2 border-grafito bg-asfalto px-1 py-3 text-center font-mono text-xl font-semibold text-hueso transition-colors hover:border-humo focus:border-amarillo sm:px-3 sm:py-4 sm:text-3xl";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-1 flex-col gap-1.5 sm:gap-2">
      <span className="font-display text-xs font-semibold uppercase tracking-widest text-amarillo sm:text-sm">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function TireSearch() {
  const [ancho, setAncho] = useState("205");
  const [perfil, setPerfil] = useState("55");
  const [llanta, setLlanta] = useState("16");
  const [marca, setMarca] = useState("Cualquier marca");

  const medida = `${ancho}/${perfil} R${llanta}`;
  const mensaje =
    marca === "Cualquier marca"
      ? `Hola! Quiero cotizar neumáticos ${medida}. ¿Qué opciones tienen?`
      : `Hola! Quiero cotizar neumáticos ${medida} marca ${marca}. ¿Tienen stock?`;

  return (
    <section
      id="buscador"
      className="relative z-10 mx-auto -mt-24 max-w-4xl scroll-mt-24 px-4 sm:-mt-28 sm:px-8 lg:-mt-32"
      aria-label="Buscador de medida de neumáticos"
    >
      <div className="rounded-3xl border border-grafito bg-caucho p-5 text-hueso shadow-2xl shadow-caucho/40 sm:p-10">
        <h2 className="font-display text-2xl font-bold uppercase leading-none sm:text-4xl">
          Buscá tu medida
        </h2>

        {/* La medida, leída como en la goma: ANCHO / PERFIL R LLANTA */}
        <div className="mt-6 flex items-end gap-1.5 sm:mt-8 sm:gap-4">
          <Field label="Ancho">
            <select
              value={ancho}
              onChange={(e) => setAncho(e.target.value)}
              className={selectBase}
            >
              {ANCHOS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </Field>

          <span
            className="pb-3 font-mono text-2xl font-semibold text-humo sm:pb-4 sm:text-4xl"
            aria-hidden="true"
          >
            /
          </span>

          <Field label="Perfil">
            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              className={selectBase}
            >
              {PERFILES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>

          <span
            className="pb-3 font-mono text-2xl font-semibold text-amarillo sm:pb-4 sm:text-4xl"
            aria-hidden="true"
          >
            R
          </span>

          <Field label="Llanta">
            <select
              value={llanta}
              onChange={(e) => setLlanta(e.target.value)}
              className={selectBase}
            >
              {LLANTAS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
        </div>

        <p className="mt-3 text-xs text-humo sm:text-sm">
          La medida está escrita en el costado de tu cubierta, tal cual:{" "}
          <span className="font-mono text-hueso">205/55 R16</span>
        </p>

        <div className="mt-5 sm:mt-6">
          <Field label="Marca">
            <select
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className={`${selectBase} px-3 text-base sm:text-xl`}
            >
              <option>Cualquier marca</option>
              {BRANDS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Resumen vivo + CTA: el lead llega a WhatsApp con la medida ya armada */}
        <div className="mt-6 flex flex-col items-stretch gap-4 rounded-2xl bg-asfalto p-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <p className="flex items-baseline justify-between gap-3 sm:block sm:text-left">
            <span className="text-xs uppercase tracking-widest text-humo sm:block">
              Tu medida
            </span>
            <span className="text-right sm:text-left">
              {/* key={...} fuerza el re-render y dispara la animación de pop al cambiar */}
              <span
                key={`${medida}-${marca}`}
                className="anim-pop inline-block font-mono text-xl font-semibold text-amarillo sm:text-2xl"
              >
                {medida}
              </span>
              <span className="block text-xs text-humo sm:text-sm">{marca}</span>
            </span>
          </p>
          <a
            href={waLink(mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-wsp px-6 py-3.5 font-semibold text-caucho transition-colors hover:bg-wsp-dark sm:px-7 sm:py-4 sm:text-lg"
          >
            <WhatsAppIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            Pedir precio
          </a>
        </div>

        <p className="mt-4 text-center text-xs text-humo sm:text-left">
          Sin vueltas: te contestamos con precio y disponibilidad en el día.
        </p>
      </div>
    </section>
  );
}
