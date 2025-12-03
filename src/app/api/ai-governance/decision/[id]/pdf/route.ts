import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, UserPayload } from '@/lib/auth';
import { AiGovernanceService } from '@/lib/aiGovernanceService';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let decoded: UserPayload;

  try {
    decoded = verifyAuth(req);
  } catch (err: unknown) {
    return NextResponse.json(
      { message: (err instanceof Error) ? err.message : 'No autorizado.' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const tenantId = decoded.tenant;

    if (!tenantId) {
      return NextResponse.json({ message: 'Tenant ID requerido' }, { status: 400 });
    }

    const decision = await AiGovernanceService.getDecisionById(id);

    if (!decision) {
      return NextResponse.json({ message: 'Decisión no encontrada' }, { status: 404 });
    }

    if (decision.tenant_id !== tenantId) {
      return NextResponse.json({ message: 'Acceso denegado a esta decisión' }, { status: 403 });
    }

    // Generar PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const fontSize = 12;
    let yPosition = height - 50;

    const drawText = (text: string, isBold: boolean = false) => {
        page.drawText(text, {
            x: 50,
            y: yPosition,
            size: fontSize,
            font: isBold ? boldFont : font,
            color: rgb(0, 0, 0),
        });
        yPosition -= 20;
    };

    // Título
    page.drawText('Reporte de Decisión de IA', {
        x: 50,
        y: yPosition,
        size: 18,
        font: boldFont,
        color: rgb(0, 0, 0.5),
    });
    yPosition -= 40;

    // Detalles
    drawText(`ID de Decisión: ${decision.id}`, true);
    drawText(`Modelo: ${decision.model_name}`);
    drawText(`Tipo: ${decision.decision_type}`);
    drawText(`Puntaje de Riesgo: ${decision.risk_score}`);
    drawText(`Fecha: ${new Date(decision.created_at).toLocaleString()}`);
    drawText(`Vetado: ${decision.is_vetoed ? 'SÍ' : 'NO'}`);
    
    yPosition -= 10;
    drawText('Explicación:', true);
    
    // Manejo básico de texto largo para la explicación
    const words = decision.explanation.split(' ');
    let line = '';
    for (const word of words) {
        const testLine = line + word + ' ';
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (textWidth > width - 100) {
            drawText(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    }
    drawText(line);

    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);

    // Retornar PDF
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="decision-${id}.pdf"`);

    return new NextResponse(buffer, { status: 200, headers });

  } catch (error) {
    console.error(`Error en GET /api/ai-governance/decision/[id]/pdf:`, error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
