"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const contributors = [
  {
    id: "1",
    name: "Aarav Mehta",
    email: "aarav@ruixen.dev",
    location: "Bangalore, India",
    status: "Active",
    balance: "₹45,000",
  },
  {
    id: "2",
    name: "Elena Torres",
    email: "elena.t@ruixen.dev",
    location: "Barcelona, Spain",
    status: "Active",
    balance: "₹22,000",
  },
  {
    id: "3",
    name: "Kenji Nakamura",
    email: "kenji.n@ruixen.dev",
    location: "Tokyo, Japan",
    status: "Inactive",
    balance: "₹0",
  },
  {
    id: "4",
    name: "Leila Ahmed",
    email: "leila.a@ruixen.dev",
    location: "Cairo, Egypt",
    status: "Pending",
    balance: "₹10,000",
  },
  {
    id: "5",
    name: "Ryan Smith",
    email: "ryan.s@ruixen.dev",
    location: "Toronto, Canada",
    status: "Active",
    balance: "₹31,500",
  },
];

function ContributorsOverviewTable() {
  return (
    <div className="max-w-3xl mx-auto rounded-xl border border-border bg-background p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-foreground">Team Contributors</h2>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Payout</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contributors.map((person) => (
            <TableRow key={person.id} className="hover:bg-muted/40 transition-colors">
              <TableCell className="font-medium">{person.name}</TableCell>
              <TableCell>{person.email}</TableCell>
              <TableCell>{person.location}</TableCell>
              <TableCell>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                    person.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : person.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {person.status}
                </span>
              </TableCell>
              <TableCell className="text-right">{person.balance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right font-semibold">
              Total
            </TableCell>
            <TableCell className="text-right font-bold text-foreground">₹1,08,500</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <p className="mt-4 text-center text-sm text-muted-foreground">contributors payout summary</p>
    </div>
  );
}

export default ContributorsOverviewTable;
