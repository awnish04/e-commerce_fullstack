import { CreditCard, DollarSign, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { formatter } from "@/lib/utils";
import { getTotalRevenue } from "@/lib/actions/admin/get-total-revenue";
import { getSalesCount } from "@/lib/actions/admin/get-sales-count";
import { getStockCount } from "@/lib/actions/admin/get-stock-count";
import { getGraphRevenue } from "@/lib/actions/admin/get-graph-revenue";
import { Overview } from "@/components/admin/overview";

interface DashboardPageProps {
  params: Promise<{ storeId: string }>;
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const { storeId } = await params;
  const totalRevenue = await getTotalRevenue(storeId);
  const salesCount = await getSalesCount(storeId);
  const stockCount = await getStockCount(storeId);
  const graphRevenue = await getGraphRevenue(storeId);

  return (
    <div className="flex-1 space-y-4 p-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatter.format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From all paid orders
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{salesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total orders completed
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products In Stock</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available inventory
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monthly revenue breakdown for the current year
          </p>
        </CardHeader>
        <CardContent className="pl-2">
          <Overview data={graphRevenue} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
