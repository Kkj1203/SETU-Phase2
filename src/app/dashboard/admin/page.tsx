'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAuth } from 'firebase/auth';

import { MoreHorizontal } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { users } from '@/lib/data';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'hospital_staff' | 'first_responder'>('hospital_staff');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateUser = async () => {
    if (!user) return;

    setLoading(true);
    setMessage('');

    try {
      const idToken = await user.getIdToken();

      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setMessage('User created successfully!');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: 'active' | 'inactive') => {
    return status === 'active' ? (
      <Badge>Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users and system access.
        </p>
      </div>

      {/* 🔹 CREATE USER FORM */}
      <Card>
        <CardHeader>
          <CardTitle>Create User</CardTitle>
          <CardDescription>
            Create Hospital Staff or First Responder accounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Temporary Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select
            className="w-full border p-2 rounded"
            value={role}
            onChange={(e) =>
              setRole(e.target.value as 'hospital_staff' | 'first_responder')
            }
          >
            <option value="hospital_staff">Hospital Staff</option>
            <option value="first_responder">First Responder</option>
          </select>

          <Button onClick={handleCreateUser} disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </Button>

          {message && (
            <p className="text-sm mt-2">{message}</p>
          )}
        </CardContent>
      </Card>

      {/* 🔹 Existing Table (Dummy Data) */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Existing users overview (mocked for now).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={u.avatarUrl} alt={u.name} />
                        <AvatarFallback>
                          {u.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {u.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(u.status ?? 'inactive')}
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}