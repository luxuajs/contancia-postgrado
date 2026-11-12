import { prisma } from '../lib/prisma';

export interface ConsultaRegistrada {
  id: number;
  cedula: string;
  usuarioId: number | null;
  fechaConsulta: Date;
  ipAddress: string | null;
  userAgent: string | null;
}

export async function registrarConsulta(
  cedula: string,
  usuarioId: number,
  ipAddress?: string,
  userAgent?: string,
): Promise<ConsultaRegistrada> {
  const consulta = await prisma.consultaEstudiante.create({
    data: {
      cedula,
      usuarioId,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    },
  });

  return {
    id: consulta.id,
    cedula: consulta.cedula,
    usuarioId: consulta.usuarioId,
    fechaConsulta: consulta.fechaConsulta,
    ipAddress: consulta.ipAddress,
    userAgent: consulta.userAgent,
  };
}

export async function listarConsultasEstudiante(cedula: string): Promise<ConsultaRegistrada[]> {
  const consultas = await prisma.consultaEstudiante.findMany({
    where: { cedula },
    orderBy: { fechaConsulta: 'desc' },
  });

  return consultas.map((c: { id: number; cedula: string; usuarioId: number | null; fechaConsulta: Date; ipAddress: string | null; userAgent: string | null }) => ({
    id: c.id,
    cedula: c.cedula,
    usuarioId: c.usuarioId,
    fechaConsulta: c.fechaConsulta,
    ipAddress: c.ipAddress,
    userAgent: c.userAgent,
  }));
}