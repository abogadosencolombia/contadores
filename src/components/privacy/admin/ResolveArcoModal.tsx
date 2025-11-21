import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import { AdminArcoRequest } from "@/types/privacy";
import { resolveArcoRequest } from "@/lib/privacyService";

interface ResolveArcoModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: AdminArcoRequest | null;
  onSuccess: () => void;
}

export default function ResolveArcoModal({
  isOpen,
  onClose,
  request,
  onSuccess,
}: ResolveArcoModalProps) {
  const [status, setStatus] = useState<"RESUELTO" | "RECHAZADO">("RESUELTO");
  const [evidence, setEvidence] = useState("");
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when request changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus("RESUELTO");
      setEvidence("");
      setDetail("");
      setError(null);
    }
  }, [isOpen, request]);

  if (!request) return null;

  const handleSubmit = async () => {
    if (!status) {
      setError("Seleccione un estado.");
      return;
    }
    
    // Validar que haya al menos un detalle o evidencia si se rechaza (opcional, pero buena práctica)
    if (status === 'RECHAZADO' && !detail) {
         setError("Por favor explique el motivo del rechazo en el detalle.");
         return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await resolveArcoRequest(request.id, {
        estado: status,
        evidencia_respuesta: evidence, // Puede ser URL o texto
        detalle_resolucion: detail
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error al guardar la resolución. Intente nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
      <ModalHeader title={`Resolver Solicitud #${request.id}`} onClose={onClose} />
      <ModalBody>
        <div className="space-y-5">
          {/* Request Details */}
          <div className="bg-gray-50 dark:bg-white/[0.03] p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">Solicitante:</span>
                <span className="font-medium text-gray-800 dark:text-white/90">
                    {request.nombre_solicitante || request.email_solicitante}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">Tipo:</span>
                <span className="font-medium text-gray-800 dark:text-white/90">{request.tipo_solicitud}</span>
              </div>
              <div className="col-span-2">
                 <span className="text-gray-500 dark:text-gray-400 block">Detalle:</span>
                 <p className="text-gray-800 dark:text-white/90 mt-1">{request.detalle}</p>
              </div>
            </div>
          </div>

          {/* Resolution Form */}
          <div className="space-y-4 border-t border-gray-100 dark:border-white/[0.05] pt-4">
             <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                Resolución
             </h4>
             
             {error && (
                <div className="p-3 text-sm bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                    {error}
                </div>
             )}

             <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                    Estado
                </label>
                <Select
                    options={[
                        { value: "RESUELTO", label: "Aprobar (Resuelto)" },
                        { value: "RECHAZADO", label: "Rechazar" }
                    ]}
                    value={status}
                    onChange={(val) => setStatus(val as any)}
                    className="w-full"
                />
             </div>

             <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                    Detalle de Resolución (Explicación)
                </label>
                <TextArea
                    rows={3}
                    placeholder="Explique la decisión tomada..."
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                />
             </div>

             <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                    Evidencia / Link de Respuesta (Opcional)
                </label>
                <TextArea
                    rows={2}
                    placeholder="URL del documento o evidencia..."
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                />
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar Resolución"}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
