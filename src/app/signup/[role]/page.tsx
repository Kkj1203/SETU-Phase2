'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound, useParams } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import Link from 'next/link';

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

const roleDisplayNames: Record<string, string> = {
  patient: 'Patient',
  admin: 'Administrator',
};

// 🔐 Hardcoded bootstrap key (move to env later if needed)
const ADMIN_BOOTSTRAP_KEY = 'SETU-2026';                                       //ADMIN BOOTSTRAPP KEY 

export default function SignupPage() {
  const params = useParams();
  const role = Array.isArray(params.role) ? params.role[0] : params.role;

  // 🔒 Only Patient & Admin are allowed here
  if (role !== 'patient' && role !== 'admin') {
    notFound();
  }

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const roleName = roleDisplayNames[role];
  const loginUrl = `/login/${role}`;

  // ---------------------------
  // PATIENT SIGNUP
  // ---------------------------
  const handlePatientSignup = async () => {
    const firstName = (document.getElementById('first-name') as HTMLInputElement)?.value;
    const lastName = (document.getElementById('last-name') as HTMLInputElement)?.value;
    const aadhar = (document.getElementById('aadhar') as HTMLInputElement)?.value;
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    const password = (document.getElementById('password') as HTMLInputElement)?.value;
    const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement)?.value;

    if (!firstName || !lastName || !aadhar || !email || !password || !confirmPassword) {
      alert('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create Auth user
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // 2️⃣ Create patient document
      await setDoc(doc(db, 'patients', uid), {
        uid,
        firstName,
        lastName,
        aadhar,
        email,
        createdAt: serverTimestamp(),
      });

      // 3️⃣ Create IAM user record
      await setDoc(doc(db, 'users', uid), {
        uid,
        role: 'patient',
        name: `${firstName} ${lastName}`,
        email,
        createdAt: serverTimestamp(),
      });

      router.push('/dashboard/patient');
    } catch (error: any) {
      console.error('Patient signup failed:', error);
      alert(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // ADMIN BOOTSTRAP SIGNUP
  // ---------------------------
  const handleAdminSignup = async () => {
    const firstName = (document.getElementById('first-name') as HTMLInputElement)?.value;
    const lastName = (document.getElementById('last-name') as HTMLInputElement)?.value;
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    const password = (document.getElementById('password') as HTMLInputElement)?.value;
    const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement)?.value;
    const bootstrapKey = (document.getElementById('bootstrap-key') as HTMLInputElement)?.value;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !bootstrapKey) {
      alert('Please fill all fields');
      return;
    }

    if (bootstrapKey !== ADMIN_BOOTSTRAP_KEY) {
      alert('Invalid admin bootstrap key');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Check if admin already exists
      const bootstrapRef = doc(db, 'system', 'bootstrap');
      const bootstrapSnap = await getDoc(bootstrapRef);

      if (bootstrapSnap.exists() && bootstrapSnap.data().adminCreated === true) {
        alert('Admin is already configured');
        return;
      }

      // 2️⃣ Create Auth user
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // 3️⃣ Create admin role document
      await setDoc(doc(db, 'hospital_administrators', uid), {
        uid,
        firstName,
        lastName,
        email,
        createdAt: serverTimestamp(),
      });

      // 4️⃣ Create IAM user record
      await setDoc(doc(db, 'users', uid), {
        uid,
        role: 'admin',
        name: `${firstName} ${lastName}`,
        email,
        createdAt: serverTimestamp(),
      });

      // 5️⃣ Lock bootstrap forever
      await setDoc(bootstrapRef, {
        adminCreated: true,
        createdAt: serverTimestamp(),
      });

      router.push('/dashboard/admin');
    } catch (error: any) {
      console.error('Admin signup failed:', error);
      alert(error.message || 'Admin signup failed');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // UI
  // ---------------------------
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
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Sign up as a <span className="font-semibold">{roleName}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" required />
            </div>
          </div>

          {role === 'patient' && (
            <div className="grid gap-2">
              <Label htmlFor="aadhar">Aadhar Number</Label>
              <Input id="aadhar" required />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" required />
          </div>

          {role === 'admin' && (
            <div className="grid gap-2">
              <Label htmlFor="bootstrap-key">Admin Bootstrap Key</Label>
              <Input id="bootstrap-key" required />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full"
            onClick={role === 'patient' ? handlePatientSignup : handleAdminSignup}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button asChild variant="link" className="p-0 h-auto">
              <Link href={loginUrl}>Login</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Signup is restricted. Hospital staff and responders are created by administrators.
      </p>
    </main>
  );
}
