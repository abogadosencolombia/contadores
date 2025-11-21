import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";

interface RenovacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string | null;
  onSuccess: () => void;
}

export const RenovacionModal: React.FC<RenovacionModalProps> = ({
  isOpen,
  onClose,
  tenantId,
  onSuccess,
}) => {
  const [numeroRadicado, setNumeroRadicado] = useState("");
  const [fechaRadicacion, setFechaRadicacion] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;

    // Validación básica
    if (!numeroRadicado.trim()) {
      setError("El número de radicado es obligatorio.");
      return;
    }
    if (!archivo) {
      setError("Debe adjuntar la evidencia en PDF.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("tenantId", tenantId);
      formData.append("numeroRadicado", numeroRadicado);
      formData.append("fechaRadicacion", fechaRadicacion);
      formData.append("evidencia", archivo);

      // Nota: El endpoint debe estar preparado para recibir FormData.
      // Si el endpoint actual solo recibe JSON, habrá que ajustarlo o usar
      // un endpoint de carga de archivos separado.
      // Asumiremos por ahora que el endpoint maneja la carga o que el usuario
      // ajustará el endpoint posteriormente si falla con multipart/form-data.
      
      // IMPORTANTE: Si el endpoint espera JSON, esto fallará.
      // Requerimiento dice: "Crea un objeto FormData... Envía un POST".
      // Seguiré la instrucción al pie de la letra.

      const response = await fetch("/api/admin/rnbd/renovar-manual", {
        method: "POST",
        body: formData,
        // No establecer Content-Type manual con FormData, fetch lo hace solo
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar la renovación");
      }

      // Limpiar formulario y cerrar
      setNumeroRadicado("");
      setFechaRadicacion(new Date().toISOString().split("T")[0]);
      setArchivo(null);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <ModalHeader title="Registrar Renovación RNBD" onClose={onClose} />
      <ModalBody>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="numeroRadicado"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Número de Radicado
            </label>
            <Input
              id="numeroRadicado"
              type="text"
              placeholder="Ej: 24-123456- -000"
              required
              value={numeroRadicado}
              onChange={(e) => setNumeroRadicado(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="fechaRadicacion"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Fecha de Radicación
            </label>
            <Input
              id="fechaRadicacion"
              type="date"
              required
              value={fechaRadicacion}
              onChange={(e) => setFechaRadicacion(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="evidencia"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Evidencia PDF (SIC)
            </label>
            <FileInput
              id="evidencia"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Suba el archivo PDF generado por la plataforma de la SIC.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};