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

const items = [
  { id: "1", name: "Arjun Mehta", email: "arjun.mehta@company.com", location: "Bangalore, IN", status: "Active", balance: 1250 },
  { id: "2", name: "Hannah Park", email: "hannah.park@company.com", location: "Seoul, KR", status: "Active", balance: 600 },
  { id: "3", name: "Oliver Scott", email: "oliver.scott@company.com", location: "Manchester, UK", status: "Inactive", balance: 650 },
  { id: "4", name: "Camila Torres", email: "camila.torres@company.com", location: "Bogotá, CO", status: "Active", balance: 0 },
  { id: "5", name: "Kenji Tanaka", email: "kenji.tanaka@company.com", location: "Osaka, JP", status: "Active", balance: -1000 },
  { id: "6", name: "Michael Adams", email: "m.adams@company.com", location: "Chicago, US", status: "Active", balance: 1500 },
  { id: "7", name: "Elena Petrova", email: "elena.petrova@company.com", location: "Moscow, RU", status: "Inactive", balance: 200 },
  { id: "8", name: "Carlos Mendes", email: "carlos.mendes@company.com", location: "Rio de Janeiro, BR", status: "Active", balance: 1000 },
  { id: "9", name: "Yuki Sato", email: "yuki.sato@company.com", location: "Nagoya, JP", status: "Active", balance: 500 },
  { id: "10", name: "Meera Iyer", email: "meera.iyer@company.com", location: "Chennai, IN", status: "Inactive", balance: 300 },
  { id: "11", name: "Tomás Rivera", email: "t.rivera@company.com", location: "Santiago, CL", status: "Active", balance: 800 },
  { id: "12", name: "Sophia White", email: "sophia.white@company.com", location: "Auckland, NZ", status: "Active", balance: 1200 },
  { id: "13", name: "Nina Krüger", email: "nina.kruger@company.com", location: "Munich, DE", status: "Active", balance: 400 },
  { id: "14", name: "Jacob Harris", email: "jacob.harris@company.com", location: "Vancouver, CA", status: "Inactive", balance: 600 },
  { id: "15", name: "Maya Hassan", email: "maya.hassan@company.com", location: "Cairo, EG", status: "Active", balance: 1800 },
  { id: "16", name: "Ethan Clarke", email: "ethan.clarke@company.com", location: "Melbourne, AU", status: "Active", balance: 2200 },
  { id: "17", name: "Giulia Bianchi", email: "giulia.bianchi@company.com", location: "Milan, IT", status: "Inactive", balance: -200 },
  { id: "18", name: "Lars Jensen", email: "lars.jensen@company.com", location: "Copenhagen, DK", status: "Active", balance: 950 },
  { id: "19", name: "Amélie Dupont", email: "amelie.dupont@company.com", location: "Paris, FR", status: "Active", balance: 720 },
  { id: "20", name: "Rafael Costa", email: "rafael.costa@company.com", location: "Lisbon, PT", status: "Inactive", balance: 150 },
];


export default function FixedHeaderFooterTable() {
  return (
    <div className="bg-background w-full max-w-4xl mx-auto">
      <div className="h-96 flex flex-col">
        {/* Table header */}
        <div className="flex-none">
          <Table className="w-full border-separate border-spacing-0">
            <TableHeader className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <Table className="w-full border-separate border-spacing-0 [&_td]:border-border [&_tr:not(:last-child)_td]:border-b">
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell className="text-right">{item.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Table footer */}
        <div className="flex-none">
          <Table className="w-full border-separate border-spacing-0">
            <TableFooter className="sticky bottom-0 bg-background">
              <TableRow>
                <TableCell colSpan={4}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Table with fixed header & footer, scrollable body
      </p>
    </div>
  );
}
