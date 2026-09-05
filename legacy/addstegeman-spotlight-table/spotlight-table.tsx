// components/ui/component.tsx
import { useState } from "react";

const data = [
  { id: 1, name: "Astra", role: "Engineer", status: "Active" },
  { id: 2, name: "Bravo", role: "Design", status: "Active" },
  { id: 3, name: "Charlie", role: "Marketing", status: "Offline" },
  { id: 4, name: "Delta", role: "Sales", status: "Active" },
];

export const Component = () => {
  const [q, setQ] = useState("");
  const lower = q.toLowerCase();
  return (
    <div className="h-screen grid place-content-center bg-background text-foreground p-8">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search name or role..."
        className="mb-4 px-4 py-2 rounded-lg border border-input bg-background max-w-sm"
      />
      <table className="min-w-[500px] border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const hit = lower && Object.values(row).some((v) => String(v).toLowerCase().includes(lower));
            return (
              <tr
                key={row.id}
                className={`transition ${hit ? "opacity-100" : q ? "opacity-20" : "opacity-100"}`}
              >
                <td className="p-3">{row.name}</td>
                <td className="p-3">{row.role}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      row.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};