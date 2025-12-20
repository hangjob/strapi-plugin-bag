import contentAPIRoutes from './content-api';
import adminRoutes from './admin';

const routes = {
  admin: {
    type: 'admin',
    routes: adminRoutes,
  },
  'content-api': {
    type: 'content-api',
    routes: contentAPIRoutes,
  },
};

export default routes;
