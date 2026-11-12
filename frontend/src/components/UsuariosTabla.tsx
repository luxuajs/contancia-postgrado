import type { UsuarioListado } from '../api/client';
import Chip from './Chip';

interface Props {
  usuarios: UsuarioListado[];
  /** Id del usuario conectado: no puede desactivar su propia cuenta. */
  propioId?: number;
  onEditar: (usuario: UsuarioListado) => void;
  onCambiarEstado: (usuario: UsuarioListado) => void;
}

const formatoCedula = new Intl.NumberFormat('es-VE');

/** Lista de usuarios: una acción de edición y el cambio de estado por fila. */
export default function UsuariosTabla({ usuarios, propioId, onEditar, onCambiarEstado }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-vinotinto-50">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold text-vinotinto-800">Nombre</th>
            <th scope="col" className="px-4 py-3 font-semibold text-vinotinto-800">Cédula</th>
            <th scope="col" className="px-4 py-3 font-semibold text-vinotinto-800">Rol</th>
            <th scope="col" className="px-4 py-3 font-semibold text-vinotinto-800">Estado</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold text-vinotinto-800">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {usuarios.map((item) => (
            <tr key={item.id} className="hover:bg-vinotinto-50/40">
              <td className="px-4 py-3 font-medium text-slate-900">{item.nombre}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs tabular-nums text-slate-600">
                {item.cedula ? formatoCedula.format(Number(item.cedula)) : '—'}
              </td>
              <td className="px-4 py-3">
                <Chip tono={item.rol === 'ROOT' ? 'oscuro' : 'neutro'}>{item.rol}</Chip>
              </td>
              <td className="px-4 py-3">
                <Chip tono={item.activo ? 'ok' : 'neutro'}>{item.activo ? 'Activo' : 'Inactivo'}</Chip>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onEditar(item)}
                  aria-label={`Editar a ${item.nombre}`}
                  className="btn-text mr-2 text-vinotinto-800 hover:bg-vinotinto-50"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onCambiarEstado(item)}
                  disabled={item.id === propioId}
                  title={item.id === propioId ? 'No puede desactivar su propia cuenta' : undefined}
                  aria-label={`${item.activo ? 'Desactivar' : 'Activar'} a ${item.nombre}`}
                  className="btn-text text-slate-600 hover:bg-slate-100 disabled:hover:bg-transparent"
                >
                  {item.activo ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
