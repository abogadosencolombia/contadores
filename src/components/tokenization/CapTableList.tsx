"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

interface Shareholder {
  name: string;
  email: string;
  percentage: number;
  tokens: number;
  firstInvestment: string;
}

interface CapTableListProps {
  data: Shareholder[];
}

export default function CapTableList({ data }: CapTableListProps) {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Detalle de Accionistas
        </h4>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader className="px-4 py-3 text-left font-medium text-black dark:text-white">
                Accionista
              </TableCell>
              <TableCell isHeader className="px-4 py-3 text-left font-medium text-black dark:text-white">
                Participación
              </TableCell>
              <TableCell isHeader className="px-4 py-3 text-left font-medium text-black dark:text-white">
                Tokens/Acciones
              </TableCell>
              <TableCell isHeader className="px-4 py-3 text-left font-medium text-black dark:text-white">
                Desde
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, key) => (
              <TableRow key={key}>
                <TableCell className="px-4 py-3">
                  <h5 className="font-medium text-black dark:text-white">
                    {item.name}
                  </h5>
                  <p className="text-sm text-gray-500">{item.email}</p>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Badge 
                    color={item.percentage > 20 ? 'success' : item.percentage > 5 ? 'warning' : 'primary'}
                    size="sm"
                  >
                    {item.percentage.toFixed(2)}%
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <span className="text-black dark:text-white font-medium">
                    {item.tokens}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500">
                  {new Date(item.firstInvestment).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
