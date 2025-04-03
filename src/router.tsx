import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'
import payrollRouter from './routers/payroll.tsx'
import emsRouter from './routers/ems.tsx'

const router = createBrowserRouter([
  /// Main All Products Routes
  {
    path: '/all-products',
    lazy: async () => ({
      Component: (await import('./pages/all-products')).default,
    }),
  },

  // Payroll Routes
  ...payrollRouter,

  // EMS Routes
  ...emsRouter,

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default router
