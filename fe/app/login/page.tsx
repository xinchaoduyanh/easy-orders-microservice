"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, LogIn, Github, Chrome, AlertCircle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useLogin } from "@/queries/useLogin";

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { login } = useAuth();
  const loginMutation = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          const { user, access_token, refresh_token } = data.data;
          setSuccess(data.message || "Đăng nhập thành công! Đang chuyển hướng...");
          login(user, access_token, refresh_token);
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        },
        onError: (err: any) => {
          setError(err.message || "Đăng nhập thất bại");
        },
      }
    );
  };

  const handleOAuth = (provider: "google" | "github") => {
    const redirectUri = `${window.location.origin}/login/oauth-callback`;
    const authUrl = `${process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3004"}/auth/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`;
    // Chuyển trang luôn, không mở popup
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Chào mừng trở lại</h1>
          <p className="text-muted-foreground">Đăng nhập vào tài khoản của bạn để tiếp tục</p>
        </div>

        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">Đăng nhập</CardTitle>
            <CardDescription className="text-center">Nhập thông tin đăng nhập của bạn bên dưới</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleOAuth("google")}
                className="bg-background/50 hover:bg-background/80 transition-colors"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuth("github")}
                className="bg-background/50 hover:bg-background/80 transition-colors"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Hoặc tiếp tục với</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-background/50 border-border/50 focus:bg-background transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 bg-background/50 border-border/50 focus:bg-background transition-colors"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link href="/forgot-password" className="text-primary hover:text-primary/80 transition-colors">
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loginMutation.isLoading}
                className="w-full bg-primary hover:bg-primary/90 transition-colors"
                size="lg"
              >
                {loginMutation.isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Đăng nhập
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Đăng ký ngay
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>Bằng cách đăng nhập, bạn đồng ý với</p>
          <div className="space-x-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Điều khoản dịch vụ
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
