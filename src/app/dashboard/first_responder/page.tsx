'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
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

export default function ResponderDashboard() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  // 🔐 Route Protection
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login/first_responder');
      } else if (role !== 'first_responder') {
        router.push('/');
      }
    }
  }, [user, role, loading, router]);

  if (loading || role !== 'first_responder') return null;

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return (
          <Badge variant="secondary" className="bg-yellow-400 text-black">
            Medium
          </Badge>
        );
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            First Responder Dashboard
          </h1>
          <p className="text-muted-foreground">
            Create and manage patient cases.
          </p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Cases</CardTitle>
          <CardDescription>
            A list of current cases you are handling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map(alert => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">
                    {alert.patientName}
                  </TableCell>
                  <TableCell>{alert.location}</TableCell>
                  <TableCell>
                    {getPriorityBadge(alert.priority)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(
                      new Date(alert.timestamp),
                      { addSuffix: true }
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                          Add Complication/Note
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          View Full History
                        </DropdownMenuItem>
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