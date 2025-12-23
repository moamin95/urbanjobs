import type { ColumnDef } from "@tanstack/react-table";
import type { Job } from "../../../../shared/types/job";

export const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "job_id",
      header: "Job Id",
      size: 100,
    },
    {
      accessorKey: "posting_type",
      header: "Posting Type",
      size: 120,
    },
    {
      accessorKey: "business_title",
      header: "Business Title",
      size: 250,
    },
    {
      accessorKey: "civil_service_title",
      header: "Civil Service Title",
      size: 200,
    },
    {
      accessorKey: "agency",
      header: "Agency",
      size: 200,
    },
    {
      accessorKey: "job_category",
      header: "Job Category",
      size: 180,
    },
    {
      accessorKey: "posting_date",
      header: "Date Posted",
      size: 120,
      cell: ({ row }) => {
        return new Date(row.getValue("posting_date")).toLocaleDateString();
      },
    },
    {
      accessorKey: "salary_range_from",
      header: "Salary From",
      size: 130,
      cell: ({ row }) => {
        const amount = parseInt(row.getValue("salary_range_from"));
        return new Intl.NumberFormat('en-US', { style: "currency", currency: "USD" }).format(amount);
      },
    },
    {
      accessorKey: "salary_range_to",
      header: "Salary To",
      size: 130,
      cell: ({ row }) => {
        const amount = parseInt(row.getValue("salary_range_to"));
        return new Intl.NumberFormat('en-US', { style: "currency", currency: "USD" }).format(amount);
      },
    },
  ]