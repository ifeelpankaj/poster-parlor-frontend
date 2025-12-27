import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

const orders = [
  {
    id: "#1023",
    customer: "Theodore Bell",
    product: "Tire Doodad",
    amount: "$300.00",
    status: "Processing",
  },
  {
    id: "#2045",
    customer: "Amelia Grant",
    product: "Engine Kit",
    amount: "$450.00",
    status: "Paid",
  },
  {
    id: "#3067",
    customer: "Eleanor Ward",
    product: "Brake Pad",
    amount: "$200.00",
    status: "Success",
  },
  {
    id: "#4089",
    customer: "Henry Carter",
    product: "Fuel Pump",
    amount: "$500.00",
    status: "Processing",
  },
  {
    id: "#5102",
    customer: "Olivia Harris",
    product: "Steering Wheel",
    amount: "$350.00",
    status: "Failed",
  },
];

const statusColor = {
  Processing: "bg-blue-100 text-blue-800",
  Paid: "bg-green-100 text-green-800",
  Success: "bg-green-100 text-green-800",
  Failed: "bg-red-100 text-red-800",
};

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      statusColor[order.status as keyof typeof statusColor]
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
