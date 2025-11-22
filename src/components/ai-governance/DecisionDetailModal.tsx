import React from 'react';
import { AiDecision } from '@/types/ai-governance';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DecisionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  decision: AiDecision | null;
}

const DecisionDetailModal: React.FC<DecisionDetailModalProps> = ({
  isOpen,
  onClose,
  decision,
}) => {
  if (!isOpen || !decision) return null;

  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    // Header - Logo Placeholder
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Ethics & Governance Center', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Reporte de Decisión Automatizada', 14, 28);

    // Linea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 35, 196, 35);

    // Info General
    let yPos = 45;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`ID Decisión:`, 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(decision.id, 50, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Modelo:`, 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(decision.model_name, 50, yPos);

    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Tipo:`, 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(decision.decision_type, 50, yPos);

    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Fecha:`, 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(decision.created_at).toLocaleString(), 50, yPos);

    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Resultado:`, 14, yPos);
    doc.setFont('helvetica', 'normal');
    const resultado = decision.is_vetoed ? 'VETADO' : 'APROBADO';
    doc.setTextColor(decision.is_vetoed ? 220 : 0, decision.is_vetoed ? 53 : 128, decision.is_vetoed ? 69 : 0);
    doc.text(resultado, 50, yPos);
    doc.setTextColor(0, 0, 0); // Reset color

    // Justificación
    yPos += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('Justificación Algorítmica', 14, yPos);
    
    yPos += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(decision.explanation, 180);
    doc.text(splitText, 14, yPos);
    
    yPos += (splitText.length * 5) + 10;

    // Variables de entrada
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Variables de Entrada Evaluadas', 14, yPos);

    yPos += 5;

    // Preparar datos para la tabla
    const tableData = Object.entries(decision.input_variables).map(([key, value]) => [
      key,
      typeof value === 'object' ? JSON.stringify(value) : String(value)
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Variable', 'Valor']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [60, 80, 224] }, // Primary color approximate
      styles: { fontSize: 10 },
    });

    doc.save(`decision-${decision.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 outline-none backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-lg dark:bg-boxdark m-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
          <div>
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Detalle de Decisión
            </h3>
            <p className="text-sm text-bodydark">
              ID: <span className="font-mono">{decision.id}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Model & Risk Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-meta-4">
              <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Modelo</span>
              <span className="text-lg font-semibold text-black dark:text-white">{decision.model_name}</span>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-meta-4">
              <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Risk Score</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-strokedark flex-1">
                  <div
                    className={`h-2.5 rounded-full ${
                      decision.risk_score >= 75 ? 'bg-danger' : 
                      decision.risk_score >= 50 ? 'bg-orange-500' :
                      decision.risk_score >= 25 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${decision.risk_score}%` }}
                  ></div>
                </div>
                <span className="font-bold text-black dark:text-white">{decision.risk_score}%</span>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">Justificación Algorítmica</h4>
            <div className="rounded-lg border border-stroke p-4 dark:border-strokedark bg-gray-50 dark:bg-meta-4">
              <p className="text-black dark:text-white whitespace-pre-wrap">
                {decision.explanation}
              </p>
            </div>
          </div>

          {/* Input Variables */}
          <div>
            <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">Variables de Entrada</h4>
            <div className="overflow-x-auto rounded-lg border border-stroke dark:border-strokedark">
              <table className="min-w-full divide-y divide-stroke dark:divide-strokedark">
                <thead className="bg-gray-100 dark:bg-meta-4">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">Variable</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-black dark:text-white">Valor Evaluado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke dark:divide-strokedark bg-white dark:bg-boxdark">
                  {Object.entries(decision.input_variables).map(([key, value]) => (
                    <tr key={key}>
                      <td className="px-4 py-2 text-sm font-medium text-black dark:text-white">{key}</td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 font-mono">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 border-t border-stroke px-6 py-4 dark:border-strokedark">
            <button
                onClick={onClose}
                className="rounded px-6 py-2 font-medium text-black hover:bg-gray-100 dark:text-white dark:hover:bg-meta-4 border border-stroke dark:border-strokedark"
            >
                Cerrar
            </button>
            <button
                onClick={handleDownloadPdf}
                className="flex items-center justify-center gap-2 rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
            >
                <svg className="fill-current w-4 h-4" viewBox="0 0 20 20">
                   <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
                </svg>
                Descargar PDF
            </button>
        </div>
      </div>
    </div>
  );
};

export default DecisionDetailModal;
