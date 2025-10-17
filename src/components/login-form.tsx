'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User,
  BookUser,
  Shield,
  GraduationCap,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { EdHubLogo } from '@/components/icons/edhub-logo';
import type { UserRole } from '@/lib/types';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(1, { message: 'Please enter your password.' }),
});

type RoleInfo = {
  value: UserRole;
  icon: React.ElementType;
  title: string;
  description: string;
};

const roles: RoleInfo[] = [
  {
    value: 'student',
    icon: GraduationCap,
    title: 'Student',
    description: 'Access your learning dashboard.',
  },
  {
    value: 'teacher',
    icon: BookUser,
    title: 'Teacher',
    description: 'Manage your classes and students.',
  },
  {
    value: 'parent',
    icon: User,
    title: 'Parent',
    description: 'View your child\'s progress.',
  },
  {
    value: 'admin',
    icon: Shield,
    title: 'Admin',
    description: 'Manage the entire EdHub system.',
  },
];

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      toast({
        title: 'Login Successful',
        description: `Welcome back!`,
      });

      router.push(`/${activeTab}`);

    } catch (error: any) {
      console.error("Firebase Auth Error:", error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Invalid credentials or role for this user.',
      });
      setIsLoading(false);
    }
  }

  const currentRole = roles.find(r => r.value === activeTab);

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg border-border/30 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      <Tabs value={activeTab} onValueChange={(v) => {
          const newRole = v as UserRole;
          setActiveTab(newRole);
      }} className="w-full">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-4">
             <EdHubLogo className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-headline font-bold text-foreground">EdHub</h1>
          </div>
          <CardTitle className="font-headline text-2xl tracking-tight">
            {currentRole?.title} Login
          </CardTitle>
          <CardDescription>{currentRole?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 mb-6">
            {roles.map(({ value, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="py-2.5">
                <Icon className="h-5 w-5" />
              </TabsTrigger>
            ))}
          </TabsList>
          {roles.map(({ value }) => (
            <TabsContent key={value} value={value}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`${value}@edhub.com`}
                            {...field}
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="••••••••"
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Sign In
                  </Button>
                </form>
              </Form>
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
    </Card>
  );
}
