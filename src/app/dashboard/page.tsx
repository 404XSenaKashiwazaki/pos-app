import { Metadata } from "next";
import React, { Suspense } from "react";
import { getDashboards } from "./queries";
import CardDashboard from "./components/card-dashboard";
import DashboardChart from "./components/chart";
export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Dashboard`,
};

const Page = async () => {
  const { data } = await getDashboards();
  if (!data) return null;

  const { totalRevenue, activeProductions, totalOrders, paidPayments } = data;
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <CardDashboard
            paidPayments={paidPayments}
            activeProductions={activeProductions}
            totalOrders={totalOrders}
            totalRevenue={totalRevenue}
          />
          <DashboardChart />   {/*  masih statik chart */}
        
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
