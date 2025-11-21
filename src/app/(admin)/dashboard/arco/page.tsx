"use client";

import React from "react";
import Breadcrumb from "@/components/common/PageBreadCrumb";
import ArcoRequestsTable from "@/components/privacy/admin/ArcoRequestsTable";

export default function ArcoAdminPage() {
  return (
    <div>
      <Breadcrumb pageTitle="Gestión de Derechos ARCO" />
      <div className="mt-6">
        <ArcoRequestsTable />
      </div>
    </div>
  );
}
