import { DataTable } from "@/components/data-table";
import data from "@/app/dashboard/data.json";
import DashboardCards from "@/components/dashboard-cards";

export default function DashboardPage() {
  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DashboardCards />
            <div className="px-4 lg:px-6"></div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
