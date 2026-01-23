import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useRoles } from "@/hooks/useRoles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function AuthPage() {
  const { user, signInWithPassword, signUpWithPassword, signOut } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from as string | undefined;

  const { data: profile } = useProfile(user?.id ?? null);
  const { data: roles } = useRoles(user?.id ?? null);

  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const postAuthTarget = useMemo(() => {
    if (from) return from;
    if ((roles ?? []).includes("dispatcher") || (roles ?? []).includes("admin")) return "/dispatch";
    if ((roles ?? []).includes("responder")) return "/responder";
    return "/";
  }, [from, roles]);

  if (user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Staff Access</CardTitle>
            <CardDescription>
              Signed in as <span className="font-medium">{user.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Profile: <span className="text-foreground">{profile?.display_name ?? "(not set)"}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Roles: <span className="text-foreground">{(roles ?? []).length ? (roles ?? []).join(", ") : "(none)"}</span>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={() => nav(postAuthTarget)}>Continue</Button>
            <Button variant="secondary" onClick={() => signOut()}>
              Sign out
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  const onSubmit = async (values: FormValues) => {
    try {
      if (mode === "signin") {
        await signInWithPassword(values.email, values.password);
        nav(postAuthTarget);
      } else {
        await signUpWithPassword(values.email, values.password);
        toast({
          title: "Account created",
          description: "You can sign in now (email is auto-confirmed in this environment).",
        });
        setMode("signin");
      }
    } catch (e: any) {
      toast({
        title: "Authentication error",
        description: e?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Staff Access</CardTitle>
          <CardDescription>Sign in to dispatch or respond.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value={mode} className="mt-4">
              <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" autoComplete="email" {...form.register("email")} />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Password</label>
                  <Input type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} {...form.register("password")} />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  {mode === "signin" ? "Sign in" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
