// Composables
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store/index';
import User from '@/types/User';
import checkValidWorkspace from '@/modules/checkValidWorkspace';
import { log } from 'console';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
    ],
  },
  {
    path: '/workspaces',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Workspaces',
        component: () => import('@/views/Workspace.vue'),
      },
    ],
  },
  {
    path: '/:workspaceId/items',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Items',
        component: () => import('@/views/Item.vue'),
      },
    ],
  },
  {
    path: '/:workspaceId/invitation',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Invitation',
        component: () => import('@/views/Invitation.vue'),
      },
    ],
  },
  {
    path: '/:workspaceId/members',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Members',
        component: () => import('@/views/Member.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
