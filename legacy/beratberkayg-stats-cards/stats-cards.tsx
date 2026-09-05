import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { ArrowUpRight, Users, CreditCard } from "lucide-react";

export const Component = () => {
 

  return (
        <div className="grid grid-cols-2 gap-6 w-full mx-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <div className="flex items-center pt-1 text-xs text-green-600">
            <ArrowUpRight className="mr-1 h-3 w-3" />
            <span>+20.1% from last month</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2,350</div>
          <div className="flex items-center pt-1 text-xs text-green-600">
            <ArrowUpRight className="mr-1 h-3 w-3" />
            <span>+18.2% from last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
