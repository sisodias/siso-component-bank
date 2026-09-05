import { getBadgeLabel } from "./react-cli-smoke-20260604-copy-utils/get-badge-label"

export default function ReactCliSmokeCard() {
  return (
    <div className="flex w-[320px] flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="w-fit rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
        {getBadgeLabel("react", "publish")}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-zinc-950">React CLI smoke</h3>
        <p className="mt-1 text-sm leading-6 text-zinc-600">
          Published through the React CodeSandbox flow with a local support file.
        </p>
      </div>
    </div>
  )
}
