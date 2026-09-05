import * as React from "react"
import { cn } from "../_utils/cn" // Your utility for merging class names
import { Button, type ButtonProps } from "./button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { Input } from "./input"
import { Label } from "./label"
import { Eye, EyeOff, KeyRound, Mail, Sparkles } from "lucide-react"
import {useTheme} from "next-themes"

// Simple SVG components for brand icons as placeholders
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <img src= "https://svgl.app/library/google.svg" { ...props }/>
)

const MicrosoftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <img src= "https://svgl.app/library/microsoft.svg" { ...props }/>
)

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => {
  const {theme} = useTheme();
  return <>
  <img src= {`https://svgl.app/library/apple${theme==='dark' ? '_dark': ''}.svg`} { ...props }/>

  </>
}

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onEmailSubmit?: (data: { email: string; password?: string }) => void
  onSocialSignIn?: (provider: 'google' | 'microsoft' | 'apple' | 'sso') => void
  onEmailLink?: () => void
}

const AuthForm = React.forwardRef<HTMLDivElement, AuthFormProps>(
  ({ className, onEmailSubmit, onSocialSignIn, onEmailLink, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      onEmailSubmit?.({ email, password })
    }

    return (
      <Card ref= { ref } className = { cn("w-full max-w-md mx-auto", className) } {...props}>
        <CardHeader className="text-left" >
          <CardTitle className="text-2xl" > Sign in with email < /CardTitle>
          <CardDescription>
            Make a new doc to bring your words, data, and teams together.For free.
          < /CardDescription>
  < /CardHeader>
  < CardContent >
  <div className="space-y-4" >
    {/* Social Sign-in */ }
    < div className = "space-y-2" >
      <Label className="text-xs text-muted-foreground" > Sign in with</Label>
      < div className = "grid grid-cols-4 gap-2" >
        <Button variant="outline" onClick = {() => onSocialSignIn?.('google')}>
          <GoogleIcon className="size-4 fill-primary" />
            </Button>
            < Button variant = "outline" onClick = {() => onSocialSignIn?.('microsoft')}>
              <MicrosoftIcon className="size-4 fill-primary" />
                </Button>
                < Button variant = "outline" onClick = {() => onSocialSignIn?.('apple')}>
                  <AppleIcon className="size-5" />
                    </Button>
                    < Button variant = "outline" onClick = {() => onSocialSignIn?.('sso')}>
                      <KeyRound className="h-5 w-5" />
                        <span className="ml-1.5" > SSO < /span>
                          < /Button>
                          < /div>
                          < /div>

{/* Divider */ }
<div className="relative" >
  <div className="absolute inset-0 flex items-center" >
    <span className="w-full border-t" />
      </div>
      < div className = "relative flex justify-center text-xs uppercase" >
        <span className="bg-background px-2 text-muted-foreground" > or < /span>
          < /div>
          < /div>

{/* Email Form */ }
<form onSubmit={ handleFormSubmit } className = "space-y-4" >
  <div className="space-y-2" >
    <Label htmlFor="email" > Email < /Label>
      < div className = "relative" >
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="email" name = "email" type = "email" placeholder = "jdoe.mobbin@gmail.com" className = "pl-9" required />
            </div>
            < /div>
            < div className = "space-y-2" >
              <div className="flex items-center justify-between" >
                <Label htmlFor="password" > Password < /Label>
                  < a href = "#" className = "text-sm font-medium text-primary hover:underline" > Forgot password ? </a>
                    < /div>
                    < div className = "relative" >
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="password" name = "password" type = { showPassword? "text": "password" } className = "pl-9 pr-10" required />
                          <Button 
                        type="button"
variant = "ghost"
size = "icon"
className = "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
onClick = {() => setShowPassword(!showPassword)}
                    >
  { showPassword?<EyeOff className = "h-4 w-4" /> : <Eye className="h-4 w-4" />}
</Button>
  < /div>
  < /div>
  < Button type = "submit" className = "w-full" > Sign In < /Button>
    < /form>
    < /div>
    < /CardContent>
    < CardFooter className = "flex-col items-start space-y-4" >
      <Button variant="ghost" className = "w-full text-muted-foreground" onClick = {() => onEmailLink?.()}>
        <Sparkles className="mr-2 h-4 w-4" />
          Or email me a link
            < /Button>
            < p className = "text-xs text-muted-foreground text-center w-full" >
              By logging in, you agree to our{ ' ' }
<a href="#" className = "underline hover:text-primary" >
  Terms of Service
    < /a>{' '}
    & { ' '}
    < a href = "#" className = "underline hover:text-primary" >
      Privacy Policy
        < /a>
        < /p>
        < /CardFooter>
        < /Card>
    )
  }
)
AuthForm.displayName = "AuthForm"

export { AuthForm }