import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/axios';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await api.post('/auth/register', {
                email,
                password,
                fullName,
            });

            navigate('/', {
                state: { successMessage: 'Registration successful! You can now login.' },
            });
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-uts-main p-4">
            <Card className="w-full max-w-sm shadow-xl bg-white border-slate-200">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                        Enter your information below to create your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="fullName" className="text-slate-700">
                                Full Name
                            </Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="border-slate-200 focus-visible:ring-uts-dark"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-slate-700">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="border-slate-200 focus-visible:ring-uts-dark"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-slate-700">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="border-slate-200 focus-visible:ring-uts-dark"
                                disabled={isLoading}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-2 bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Register'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex-col gap-4">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-400">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full border-slate-200 hover:bg-slate-50"
                        disabled={isLoading}
                    >
                        Sign up with Google
                    </Button>

                    <p className="text-xs text-center text-slate-500">
                        Already have an account?{' '}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/');
                            }}
                            className="font-semibold text-slate-900 underline-offset-4 hover:underline"
                        >
                            Sign In
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
