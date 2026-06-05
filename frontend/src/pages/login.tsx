import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true", 
          },
        }
      )

      const data = response.data

      if (data && data.jwt) {
        localStorage.setItem("authToken", data.jwt)
        console.log("Token successfully stored in localStorage!")
      }
      navigate("/pages/dashboard") 
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-uts-main p-4">
      <Card className="w-full max-w-sm shadow-xl bg-white border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Login to your account
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-100 font-medium">
                {error}
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-slate-200 focus-visible:ring-uts-dark"
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-xs text-slate-500 underline-offset-4 hover:underline hover:text-uts-dark"
                >
                  Forgot your password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
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
              {isLoading ? "Signing in..." : "Login"}
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
          
          <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50" disabled={isLoading}>
            Login with Google
          </Button>
          
          <p className="text-xs text-center text-slate-500">
            Don&apos;t have an account?{" "}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }} 
              className="font-semibold text-slate-900 underline-offset-4 hover:underline"
            >
              Sign Up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}