import { createClient } from '@supabase/supabase-js';

// Usamos la Service Role Key para operaciones administrativas desde el backend.
// Esto permite subir archivos a buckets privados sin necesidad de una sesión de Supabase Auth,
// confiando en que nuestra API ya validó al usuario (verifyAuth).
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '', 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const BUCKET_NAME = 'secure-uploads';

export const storageService = {
  /**
   * Sube un archivo al bucket seguro.
   * @param path Ruta dentro del bucket (ej: "tenant_123/factura.pdf")
   * @param fileBuffer El contenido del archivo
   * @param contentType Tipo MIME del archivo
   */
  async uploadFile(path: string, fileBuffer: Buffer, contentType: string) {
    const { data, error } = await supabaseAdmin
      .storage
      .from(BUCKET_NAME)
      .upload(path, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      throw new Error(`Error subiendo a Supabase: ${error.message}`);
    }

    return data;
  },

  /**
   * Genera una URL firmada (temporal) para descargar un archivo privado.
   * @param path Ruta del archivo en el bucket
   * @param expiresIn Segundos de validez (default 60s)
   */
  async getSignedUrl(path: string, expiresIn = 300) { // 5 minutos
    const { data, error } = await supabaseAdmin
      .storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new Error(`Error generando URL firmada: ${error.message}`);
    }

    return data.signedUrl;
  },

  /**
   * Elimina un archivo del bucket
   */
  async deleteFile(path: string) {
    const { error } = await supabaseAdmin
      .storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      throw new Error(`Error eliminando archivo: ${error.message}`);
    }
  },

  /**
   * Descarga un archivo del bucket y lo devuelve como Buffer.
   * @param path Ruta del archivo en el bucket
   */
  async downloadFile(path: string): Promise<Buffer> {
    const { data, error } = await supabaseAdmin
      .storage
      .from(BUCKET_NAME)
      .download(path);

    if (error) {
      throw new Error(`Error descargando archivo: ${error.message}`);
    }

    // Convertir Blob a Buffer
    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
};
