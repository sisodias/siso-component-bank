"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Check, Mail, MapPin, User, DollarSign, ShieldCheck } from "lucide-react"

type ColumnKey = "name" | "email" | "location" | "status" | "balance"

const initialData = [
  {
    id: "1",
    name: "Arjun Mehta",
    email: "arjun.mehta@company.com",
    location: "Bangalore, IN",
    status: "Active",
    balance: "$1,250.00",
  },
  {
    id: "2",
    name: "Hannah Park",
    email: "hannah.park@company.com",
    location: "Seoul, KR",
    status: "Active",
    balance: "$600.00",
  },
  {
    id: "3",
    name: "Oliver Scott",
    email: "oliver.scott@company.com",
    location: "Manchester, UK",
    status: "Inactive",
    balance: "$650.00",
  },
];

const columnConfig: {
  key: ColumnKey
  label: string
  icon: React.ReactNode
  align?: string
}[] = [
  { key: "name", label: "Name", icon: <User className="h-4 w-4" /> },
  { key: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
  { key: "location", label: "Location", icon: <MapPin className="h-4 w-4" /> },
  { key: "status", label: "Status", icon: <ShieldCheck className="h-4 w-4" /> },
  {
    key: "balance",
    label: "Balance",
    icon: <DollarSign className="h-4 w-4" />,
    align: "text-right",
  },
]

export default function MinimisableTable() {
  const [minimized, setMinimized] = React.useState<ColumnKey[]>([])

  const toggleMinimise = (col: ColumnKey) => {
    setMinimized((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    )
  }

  return (
    <div className="w-full space-y-4 px-4 max-w-xl">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">Manage Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columnConfig.map((col) => (
              <DropdownMenuItem
                key={col.key}
                onClick={() => toggleMinimise(col.key)}
                className="flex justify-between"
              >
                <span>
                  {minimized.includes(col.key)
                    ? `Expand ${col.label}`
                    : `Minimise ${col.label}`}
                </span>
                {minimized.includes(col.key) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columnConfig.map((col) => (
              <TableHead
                key={col.key}
                className={`${col.align ?? ""} ${
                  minimized.includes(col.key) ? "w-12 text-center" : ""
                }`}
              >
                {minimized.includes(col.key) ? col.icon : col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialData.map((row) => (
            <TableRow key={row.id}>
              {columnConfig.map((col) => (
                <TableCell
                  key={col.key}
                  className={`${col.align ?? ""} ${
                    minimized.includes(col.key) ? "w-12 text-center" : ""
                  }`}
                >
                  {minimized.includes(col.key)
                    ? col.icon
                    : (row as any)[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
