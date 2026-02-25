'use client';

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Home, UserCircle, Stethoscope, Hospital, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const allNavLinks = [
  { href: "/dashboard", label: "Dashboard Hub", icon: Home, role: 'any' },
  { href: "/dashboard/patient", label: "Patient", icon: UserCircle, role: 'patient' },
  { href: "/dashboard/responder", label: "First Responder", icon: Stethoscope, role: 'responder' },
  { href: "/dashboard/hospital", label: "Hospital Staff", icon: Hospital, role: 'hospital' },
  { href: "/dashboard/admin", label: "Admin", icon: Shield, role: 'admin' },
];

export function NavLinks({ role }: { role?: string }) {
  const pathname = usePathname();

  const navLinks = role
    ? allNavLinks.filter(link => link.role === 'any' || link.role === role)
    : allNavLinks;

  return (
    <SidebarMenu>
      {navLinks.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton asChild isActive={pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))}>
            <Link href={link.href}>
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
