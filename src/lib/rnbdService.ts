import db from '@/lib/db';

export class RnbdService {
  /**
   * Registra manualmente una renovación (o inscripción) en el RNBD.
   * Reemplaza la lógica de radicación automática.
   * @param tenantId Identificador del tenant
   * @param numeroRadicado Número de radicado asignado por la SIC
   * @param fechaRadicacion Fecha en que se realizó la radicación
   * @param urlEvidencia (Opcional) URL del archivo de evidencia
   */
  static async registrarRenovacionManual(
    tenantId: string,
    numeroRadicado: string,
    fechaRadicacion: Date,
    urlEvidencia?: string
  ) {
    // Calcular fecha de vencimiento (Fecha radicación + 180 días)
    const fechaVencimiento = new Date(fechaRadicacion);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 180);

    // Se asume RENOVACION dado el nombre del método, pero podría ser INSCRIPCION si no existe previo.
    // Por simplicidad y siguiendo el nombre 'registrarRenovacionManual', usaremos 'RENOVACION' 
    // o podríamos intentar deducirlo, pero el requerimiento no pide lógica compleja de deducción aquí.
    // Sin embargo, para ser consistente con los tipos permitidos en BD ('INSCRIPCION', 'RENOVACION', etc.),
    // lo ideal sería que el frontend o quien llame esto sepa qué es. 
    // Pero dado que la firma no pide 'tipo', usaremos 'RENOVACION' por defecto 
    // o consultaremos si existe alguno previo? 
    // El usuario pidió "registrarRenovacionManual", así que 'RENOVACION' es lo más seguro.
    const tipo = 'RENOVACION'; 

    const respuestaSic = {
      mensaje: 'Registro manual exitoso',
      url_evidencia: urlEvidencia || null,
      fecha_carga: new Date().toISOString()
    };

    const query = `
      INSERT INTO core.rnbd_registros 
      (tenant_id, tipo_novedad, numero_radicado, fecha_registro, fecha_vencimiento, estado, respuesta_sic)
      VALUES ($1, $2, $3, $4, $5, 'RADICADO', $6)
      RETURNING *
    `;

    // fecha_registro en BD suele ser el momento del insert (NOW()), 
    // pero si es un registro manual de algo pasado, tal vez deberíamos usar fechaRadicacion?
    // La instrucción dice: "usando los datos reales recibidos".
    // El INSERT original usaba NOW() para fecha_registro.
    // Usaremos NOW() para fecha_registro (audit del sistema) y fechaRadicacion para calcular vencimiento.
    // OJO: Si fechaRadicacion es muy antigua, el vencimiento podría estar próximo o pasado.

    const values = [
      tenantId,
      tipo,
      numeroRadicado,
      new Date(), // fecha_registro (cuándo se guardó en el sistema)
      fechaVencimiento,
      JSON.stringify(respuestaSic)
    ];

    const { rows: [nuevoRegistro] } = await db.query(query, values);

    return nuevoRegistro;
  }

  /**
   * Verifica qué tenants tienen pendientes (Inscripción o Renovación).
   * Retorna una lista de objetos { tenantId, tipo }.
   * No realiza ninguna acción de renovación automática.
   */
  static async verificarRenovacionesPendientes() {
    // Consulta para obtener el último vencimiento por tenant
    const query = `
      SELECT t.tenant_id, r.fecha_vencimiento
      FROM core.tenants t
      LEFT JOIN LATERAL (
        SELECT fecha_vencimiento
        FROM core.rnbd_registros
        WHERE tenant_id = t.tenant_id
        ORDER BY fecha_registro DESC
        LIMIT 1
      ) r ON true
    `;
    
    const { rows } = await db.query(query);
    
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + 30); // Alerta 30 días antes

    const pendientes = [];

    for (const row of rows) {
      // Caso 1: Nunca ha tenido registro -> INSCRIPCION
      if (!row.fecha_vencimiento) {
        pendientes.push({
          tenantId: row.tenant_id,
          tipo: 'INSCRIPCION'
        });
      } 
      // Caso 2: Tiene registro y vence pronto (o ya venció) -> RENOVACION
      else if (new Date(row.fecha_vencimiento) <= limite) {
        pendientes.push({
          tenantId: row.tenant_id,
          tipo: 'RENOVACION'
        });
      }
    }

    return pendientes;
  }

  /**
   * Simula el envío de alertas de correo para los tenants pendientes.
   * @param pendientes Lista de tenants con renovaciones/inscripciones pendientes
   */
  static async enviarAlertasVencimiento(pendientes: { tenantId: string, tipo: string }[]) {
    if (pendientes.length === 0) {
      console.log('No hay alertas de vencimiento para enviar.');
      return;
    }

    console.log(`Procesando envío de alertas para ${pendientes.length} tenants...`);
    
    for (const item of pendientes) {
      // Aquí iría la lógica real de envío de correo (e.g., usando nodemailer o servicio externo)
      console.log(`[SIMULACION EMAIL] Para: ${item.tenantId} | Asunto: Recordatorio de ${item.tipo} RNBD | Mensaje: Su registro RNBD requiere ${item.tipo}. Por favor realice el trámite en la SIC y registre la evidencia.`);
    }
  }
}