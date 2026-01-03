"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  displayName: z.string().min(1, "Display name is required"),
  userTier: z.enum(["ROM", "CREATOR"]),
  creatorTypes: z.array(z.string()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const creatorTypeOptions = [
  { value: "SCIENTIST", label: "Scientist", description: "Researchers, academics, educators" },
  { value: "MANGAKA", label: "Mangaka", description: "Manga artists and comic creators" },
  { value: "ARTIST", label: "Artist", description: "Digital artists, illustrators" },
  { value: "WRITER", label: "Writer", description: "Authors, journalists, bloggers" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCreatorTypes, setSelectedCreatorTypes] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userTier: "ROM",
      creatorTypes: [],
    },
  });

  const userTier = watch("userTier");

  const toggleCreatorType = (type: string) => {
    setSelectedCreatorTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          creatorTypes: userTier === "CREATOR" ? selectedCreatorTypes : [],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Registration failed",
          description: result.error || "Something went wrong",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account created",
        description: "Signing you in...",
      });

      // Sign in automatically after registration
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-muted-foreground">
            Join our community of scientists, artists, and creators
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* User Tier Selection */}
          <div className="space-y-3">
            <Label>Account Type</Label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                  userTier === "ROM"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  value="ROM"
                  {...register("userTier")}
                  className="sr-only"
                />
                <span className="text-2xl">👀</span>
                <span className="font-medium">ROM</span>
                <span className="text-xs text-muted-foreground text-center">
                  Browse and engage with content
                </span>
              </label>
              <label
                className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                  userTier === "CREATOR"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  value="CREATOR"
                  {...register("userTier")}
                  className="sr-only"
                />
                <span className="text-2xl">✨</span>
                <span className="font-medium">Creator</span>
                <span className="text-xs text-muted-foreground text-center">
                  Share your work with the world
                </span>
              </label>
            </div>
          </div>

          {/* Creator Type Selection (only if CREATOR) */}
          {userTier === "CREATOR" && (
            <div className="space-y-3">
              <Label>What type of creator are you?</Label>
              <div className="grid grid-cols-2 gap-3">
                {creatorTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleCreatorType(option.value)}
                    className={`flex flex-col items-start gap-1 rounded-lg border-2 p-3 text-left transition-colors ${
                      selectedCreatorTypes.includes(option.value)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="font-medium text-sm">{option.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="username"
              {...register("username")}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="Your Name"
              {...register("displayName")}
              disabled={isLoading}
            />
            {errors.displayName && (
              <p className="text-sm text-destructive">{errors.displayName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
