'use client';

import React, { useState } from 'react';
import Badge from '@/components/ui/badge/Badge';
import { Modal } from '@/components/ui/modal';
import jsPDF from 'jspdf';

interface AmlAlert {
  id: number; // Changed from string to number
  userId: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  analysisSummary?: string;
  rosReportDraft?: string;
  createdAt: string; // Changed from Date | string to string
  user: {
    fullName: string;
    email: string;
  };
}

interface AmlAlertsTableProps {
  initialAlerts: AmlAlert[];
}

export default function AmlAlertsTable({ initialAlerts }: AmlAlertsTableProps) {
  const [selectedAlert, setSelectedAlert] = useState<AmlAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetail = (alert: AmlAlert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  const downloadPdf = () => {
    if (!selectedAlert || !selectedAlert.rosReportDraft) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(18);
    doc.text('Reporte de Operación Sospechosa (Borrador)', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`ID Referencia: ${selectedAlert.id}`, 20, 30);
    doc.text(`Fecha: ${new Date(selectedAlert.createdAt).toLocaleDateString()}`, 20, 36);
    
    // User Info
    doc.setFontSize(14);
    doc.text('Información del Sujeto', 20, 50);
    doc.setFontSize(10);
    doc.text(`Nombre: ${selectedAlert.user.fullName}`, 20, 58);
    doc.text(`Email: ${selectedAlert.user.email}`, 20, 64);
    doc.text(`Nivel de Riesgo: ${selectedAlert.riskLevel.toUpperCase()} (Score: ${selectedAlert.riskScore})`, 20, 70);

    // Content
    doc.setFontSize(14);
    doc.text('Detalle del Reporte', 20, 85);
    
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(selectedAlert.rosReportDraft, pageWidth - 40);
    doc.text(splitText, 20, 95);

    doc.save(`ROS_DRAFT_${selectedAlert.user.fullName.replace(/\s+/g, '_')}_${selectedAlert.id.substring(0,8)}.pdf`);
  };

  const downloadText = () => {
      if (!selectedAlert || !selectedAlert.rosReportDraft) return;
      
      const element = document.createElement("a");
      const file = new Blob([selectedAlert.rosReportDraft], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `ROS_DRAFT_${selectedAlert.id}.txt`;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
      document.body.removeChild(element);
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'critical':
      case 'high':
        return <Badge variant="solid" color="error" size="sm">{level.toUpperCase()}</Badge>;
      case 'medium':
        return <Badge variant="solid" color="warning" size="sm">{level.toUpperCase()}</Badge>;
      case 'low':
        return <Badge variant="light" color="success" size="sm">{level.toUpperCase()}</Badge>;
      default:
        return <Badge variant="light" color="light" size="sm">{level}</Badge>;
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Riesgo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Score
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Resumen IA
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {initialAlerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{alert.user.fullName}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{alert.user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRiskBadge(alert.riskLevel)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {alert.riskScore}/100
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xs" title={alert.analysisSummary || ''}>
                    {alert.analysisSummary || 'Sin resumen disponible'}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(alert.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleViewDetail(alert)}
                    className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
            {initialAlerts.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                        No hay alertas de riesgo registradas.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detalle ROS */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        className="max-w-3xl w-full mx-4"
      >
        {selectedAlert && (
          <div className="flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detalle de Alerta AML</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Usuario: {selectedAlert.user.fullName} ({selectedAlert.user.email})
                </p>
              </div>
              <div className="flex items-center gap-2">
                 {getRiskBadge(selectedAlert.riskLevel)}
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Resumen del Análisis</h4>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {selectedAlert.analysisSummary || 'No hay resumen disponible.'}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Borrador ROS (Reporte de Operación Sospechosa)</h4>
                    <div className="relative">
                        <textarea 
                            readOnly 
                            className="w-full h-64 p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200 focus:ring-brand-500 focus:border-brand-500"
                            value={selectedAlert.rosReportDraft || 'No se ha generado un borrador ROS para esta alerta.'}
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-3xl flex justify-end gap-3">
                <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                    Cerrar
                </button>
                {selectedAlert.rosReportDraft && (
                    <>
                        <button
                            onClick={downloadText}
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                        >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                           TXT
                        </button>
                        <button
                            onClick={downloadPdf}
                            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-sm"
                        >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                           Descargar PDF
                        </button>
                    </>
                )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
