import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardHeaderLoading = async () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="text-xs uppercase block">
          <Skeleton className="h-4 w-24" />
        </span>
        <h1 className="mt-8 text-3xl ">
          <Skeleton className="h-8 w-48" />
        </h1>
        <span className="mt-2 text-sm  block">
          <Skeleton className="h-4 w-64" />
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild className=" ">
          <Skeleton className="h-8 w-32" />
        </Button>

        <Button
          asChild
          variant="outline"
          className="border-white/15 bg-white/3 text-white hover:text-white/90 hover:bg-white/6"
        >
          <Skeleton className="h-8 w-32" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeaderLoading;
