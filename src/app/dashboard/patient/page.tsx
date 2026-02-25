'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Siren,
  Truck,
  Zap,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { alerts, users } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';

export default function PatientDashboard() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  // 🔐 Route Protection
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login/patient');
      } else if (role !== 'patient') {
        router.push('/');
      }
    }
  }, [user, role, loading, router]);

  if (loading || role !== 'patient') return null;

  const patient = users.find(u => u.role === 'patient');
  const patientAlerts = alerts.filter(
    a => a.patientName === patient?.name
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <HelpCircle className="h-5 w-5 text-yellow-500" />;
      case 'dispatched':
        return <Siren className="h-5 w-5 text-blue-500" />;
      case 'on-site':
        return <Zap className="h-5 w-5 text-orange-500" />;
      case 'transporting':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Patient Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {patient?.name}. View your profile and medical history.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              You can edit your information here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={patient?.avatarUrl}
                alt={patient?.name}
              />
              <AvatarFallback>
                {patient?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{patient?.name}</p>
              <p className="text-sm text-muted-foreground">
                {patient?.email}
              </p>
              <Badge
                variant="secondary"
                className="mt-2 capitalize"
              >
                {patient?.role}
              </Badge>
            </div>
            <Button>Edit Profile</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
            <CardDescription>
              {patientAlerts.length > 0
                ? 'A log of your recent medical events.'
                : 'You have no medical events recorded.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {patientAlerts.length > 0 ? (
              patientAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 rounded-lg border"
                >
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    {getStatusIcon(alert.status)}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold capitalize">
                        {alert.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(alert.timestamp),
                          { addSuffix: true }
                        )}
                      </p>
                    </div>
                    <p className="text-sm">{alert.details}</p>
                    {alert.responderName && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        <span className="font-semibold">
                          Responder:
                        </span>{' '}
                        {alert.responderName}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                <CheckCircle className="h-12 w-12 mb-4" />
                <p>All clear. No recorded incidents.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}