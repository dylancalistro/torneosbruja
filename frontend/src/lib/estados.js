export const ESTADO_CFG = {
  activo: {
    label: 'En curso',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    accent: 'bg-emerald-500',
  },
  proximamente: {
    label: 'Próximamente',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    accent: 'bg-amber-500',
  },
  finalizado: {
    label: 'Finalizado',
    badge: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    accent: 'bg-gray-400',
  },
}

export const estadoCfg = (estado) => ESTADO_CFG[estado] ?? ESTADO_CFG.finalizado
