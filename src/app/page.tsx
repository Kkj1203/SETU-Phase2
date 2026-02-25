import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Hospital, Shield, Stethoscope, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SetuLogo } from '@/components/setu-logo';

const roleCards = [
  {
    title: 'Patient',
    description: 'Login or create an account to manage your emergency profile.',
    href: '/login/patient',
    icon: UserCircle,
  },
  {
    title: 'First Responder',
    description: 'Login to view and respond to assigned emergency cases.',
    href: '/login/first_responder',
    icon: Stethoscope,
  },
  {
    title: 'Hospital Staff',
    description: 'Login to manage incoming patient cases and treatment status.',
    href: '/login/hospital_staff',
    icon: Hospital,
  },
  {
    title: 'Admin',
    description: 'Login to manage users, permissions, and system settings.',
    href: '/login/admin',
    icon: Shield,
  },
];

export default function SelectRolePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <div className="flex flex-col items-center text-center">
        <SetuLogo className="size-12" />
        <h1 className="text-3xl font-bold mt-4">Welcome to SETU</h1>
        <p className="mt-2 text-muted-foreground max-w-lg">
          A unified platform for emergency medical coordination. Please select
          your role to continue.
        </p>
      </div>

      <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roleCards.map((card) => (
          <Card key={card.title} className="flex flex-col">
            <CardHeader className="flex-1">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <card.icon className="h-6 w-6" />
                </div>
                <CardTitle>{card.title}</CardTitle>
              </div>
              <CardDescription className="pt-2">
                {card.description}
              </CardDescription>
            </CardHeader>

            <div className="p-6 pt-0">
              <Button asChild className="w-full">
                <Link href={card.href}>
                  Login <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Access is role-based. Signup is available only for patients and system
        administrators.
      </p>
    </main>
  );
}
