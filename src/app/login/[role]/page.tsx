'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams, notFound } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SetuLogo } from '@/components/setu-logo';
import { ArrowLeft } from 'lucide-react';

const roleDisplayNames: { [key: string]: string } = {
  patient: 'Patient',
  admin: 'Administrator',
  hospital_staff: 'Hospital Staff',
  first_responder: 'First Responder',
};

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const role = Array.isArray(params.role) ? params.role[0] : params.role;

  const roleName = role ? roleDisplayNames[role] : undefined;

  if (!roleName) {
    notFound();
  }

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    const password = (document.getElementById('password') as HTMLInputElement)?.value;

    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Authenticate user
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // 2️⃣ Fetch role from Firestore
      const userSnap = await getDoc(doc(db, 'users', uid));

      if (!userSnap.exists()) {
        throw new Error('User role not found');
      }

      const actualRole = userSnap.data().role;

      // 3️⃣ Ensure role matches URL
      if (actualRole !== role) {
        await auth.signOut();
        throw new Error('Access denied: role mismatch');
      }

      // 4️⃣ Redirect correctly
      switch (actualRole) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'patient':
          router.push('/dashboard/patient');
          break;
        case 'hospital_staff':
          router.push('/dashboard/hospital_staff');
          break;
        case 'first_responder':
          router.push('/dashboard/first_responder');
          break;
        default:
          throw new Error('Invalid role');
      }

    } catch (error: any) {
      alert(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signupUrl = `/signup/${role}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-4 left-4">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to role selection
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <SetuLogo />
          <CardTitle className="text-2xl font-bold">SETU</CardTitle>
          <CardDescription>
            Sign in as a <span className="font-semibold">{roleName}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your Email"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter Password"
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          {(role === 'patient' || role === 'admin') && (
            <Button asChild className="w-full" variant="outline">
              <Link href={signupUrl}>Sign Up</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}