'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { alerts } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';

const chartData = [
  { status: 'Pending', count: alerts.filter(a => a.status === 'pending').length },
  { status: 'Dispatched', count: alerts.filter(a => a.status === 'dispatched').length },
  { status: 'On-Site', count: alerts.filter(a => a.status === 'on-site').length },
  { status: 'Transporting', count: alerts.filter(a => a.status === 'transporting').length },
  { status: 'Resolved', count: alerts.filter(a => a.status === 'resolved').length },
];

export default function HospitalDashboard() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  // ✅ ALL HOOKS MUST BE DECLARED BEFORE ANY RETURN
  const [acceptedAlerts, setAcceptedAlerts] = useState<string[]>([]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login/hospital_staff');
      } else if (role !== 'hospital_staff') {
        router.push('/');
      }
    }
  }, [user, role, loading, router]);

  if (loading || role !== 'hospital_staff') return null;

  const handleAccept = (alertId: string) => {
    setAcceptedAlerts(prev => [...prev, alertId]);
  };

  const incomingPatients = alerts.filter(
    a => a.status === 'transporting' || a.status === 'on-site'
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Hospital Staff Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of incoming patients and resource status.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Incoming Patients</CardTitle>
            <CardDescription>Currently en route</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {alerts.filter(a => a.status === 'transporting').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {alerts.filter(a => a.status === 'pending').length}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alerts by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="status" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incoming Patient Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Responder</TableHead>
                <TableHead>Time</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomingPatients.map(alert => (
                <TableRow key={alert.id}>
                  <TableCell>
                    {acceptedAlerts.includes(alert.id)
                      ? alert.patientName
                      : `Patient #${alert.id.split('_')[1]}`}
                  </TableCell>
                  <TableCell>{alert.location}</TableCell>
                  <TableCell>{alert.responderName}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(alert.timestamp), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {!acceptedAlerts.includes(alert.id) ? (
                          <DropdownMenuItem
                            onClick={() => handleAccept(alert.id)}
                          >
                            Accept Case
                          </DropdownMenuItem>
                        ) : (
                          <>
                            <DropdownMenuItem>Prepare ER</DropdownMenuItem>
                            <DropdownMenuItem>
                              View Full History
                            </DropdownMenuItem>
                            <DropdownMenuItem>Add Note</DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}