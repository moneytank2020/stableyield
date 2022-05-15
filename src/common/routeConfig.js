import { App, HomePage } from '../features/home';

const routes = [
  {
    path: '/',
    component: App,
    childRoutes: [
      { path: '/', component: HomePage, isIndex: true },
    ],
  },
];

export default routes;
