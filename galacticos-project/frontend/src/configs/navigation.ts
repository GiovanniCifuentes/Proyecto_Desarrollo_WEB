// src/config/navigation.ts
import { HomeIcon, Cog6ToothIcon    } from '@heroicons/react/24/outline';
import {  CalendarIcon    } from "lucide-react";

export const navigation = [
  { name: 'Home', href: '/home', icon: HomeIcon, current: true, roles: ['User', 'admin'] },
  { name: 'Eventos', href: '/eventos', icon: CalendarIcon, current: false, roles: ['User', 'admin'] },
 
  {
    name: 'Administración',
    icon: Cog6ToothIcon,
    roles: ['admin'],
    children: [
      { name: 'Usuarios', href: '/admin/users' },
      { name: 'Eventos', href: '/admin/eventos' },
      { name: 'Colas', href: '/admin/colas' },
    ],
  },
];