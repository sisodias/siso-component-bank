import { Button } from "./button";
import { getReleaseCopy } from "./release-007-smoke-20260608-204005-utils/release-copy";

export default function Release007Smoke() {
  return (
    <div className="flex items-center gap-3 rounded-md border p-4">
      <span className="text-sm font-medium">{getReleaseCopy("0.0.7")}</span>
      <Button type="button">Registry dependency installed</Button>
    </div>
  );
}
