"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  UserPlus,
  Github,
  Chrome,
  AlertCircle,
  CheckCircle2,
  Shield,
} from "lucide-react"
import { useRegister } from "@/queries/useRegister";

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const registerMutation = useRegister();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) return "Vui lòng nhập họ"
    if (!formData.lastName.trim()) return "Vui lòng nhập tên"
    if (!formData.email.trim()) return "Vui lòng nhập email"
    if (!formData.password) return "Vui lòng nhập mật khẩu"
    if (formData.password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự"
    if (formData.password !== formData.confirmPassword) return "Mật khẩu xác nhận không khớp"
    if (!acceptTerms) return "Vui lòng đồng ý với điều khoản dịch vụ"
    return null
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    registerMutation.mutate(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: (data) => {
          setSuccess(data.message || "Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        },
        onError: (err: any) => {
          setError(err.message || "Đăng ký thất bại");
        },
      }
    );
  }

  const handleOAuth = (provider: "google" | "github") => {
    const redirectUri = `${window.location.origin}/login/oauth-callback`
    const authUrl = `${process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3004"}/auth/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`

    window.open(authUrl, "_blank", "width=500,height=600")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo tài khoản</h1>
          <p className="text-muted-foreground">Đăng ký để bắt đầu sử dụng hệ thống</p>
        </div>

        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">Đăng ký</CardTitle>
            <CardDescription className="text-center">Tạo tài khoản mới để truy cập hệ thống</CardDescription>
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
                <span className="bg-card px-2 text-muted-foreground">Hoặc đăng ký với email</span>
              </div>
            </div>

            {/* Register Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    Họ
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Họ"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                      className="pl-10 bg-background/50 border-border/50 focus:bg-background transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Tên
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Tên"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                      className="pl-10 bg-background/50 border-border/50 focus:bg-background transition-colors"
                    />
                  </div>
                </div>
              </div>

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
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                    placeholder="Tạo mật khẩu"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    className="pl-10 pr-10 bg-background/50 border-border/50 focus:bg-background transition-colors"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                  Tôi đồng ý với{" "}
                  <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                    Chính sách bảo mật
                  </Link>
                </Label>
              </div>

              {registerMutation.isError && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{typeof registerMutation.error === 'object' && registerMutation.error && 'message' in registerMutation.error ? (registerMutation.error as any).message : error}</AlertDescription>
                </Alert>
              )}

              {registerMutation.isSuccess && (
                <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{registerMutation.data?.message || success}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={registerMutation.isLoading}
                className="w-full bg-primary hover:bg-primary/90 transition-colors"
                size="lg"
              >
                {registerMutation.isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Tạo tài khoản
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Đăng nhập ngay
          </Link>
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
          <Shield className="w-4 h-4 mx-auto mb-1" />
          <p>Thông tin của bạn được bảo mật với mã hóa SSL 256-bit</p>
        </div>
      </div>
    </div>
  )
}
