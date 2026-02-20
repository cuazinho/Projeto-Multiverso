
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/firebase"
import { initiateEmailSignIn, initiateEmailSignUp, initiateGoogleSignIn } from "@/firebase/non-blocking-login"
import { LogIn, Loader2, Mail, Lock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const authSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

type AuthFormValues = z.infer<typeof authSchema>

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuth()

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleAuthError = (error: any, action: string) => {
    if (error.code === 'auth/operation-not-allowed') {
      toast({
        variant: "destructive",
        title: "Configuração Pendente",
        description: "Este método de login não está ativado no Console do Firebase. Por favor, ative o provedor de E-mail ou Google nas configurações de Authentication.",
      })
    } else {
      toast({
        variant: "destructive",
        title: `Erro no ${action}`,
        description: error.message || "Verifique suas credenciais ou tente novamente mais tarde.",
      })
    }
  }

  const onSignIn = async (data: AuthFormValues) => {
    setIsLoading(true)
    try {
      await initiateEmailSignIn(auth, data.email, data.password)
      toast({
        title: "Conectando...",
        description: "Sua identidade está sendo validada.",
      })
      setIsOpen(false)
    } catch (error: any) {
      handleAuthError(error, "Login")
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUp = async (data: AuthFormValues) => {
    setIsLoading(true)
    try {
      await initiateEmailSignUp(auth, data.email, data.password)
      toast({
        title: "Conta Criada",
        description: "Seja bem-vindo ao Projeto Multiverso!",
      })
      setIsOpen(false)
    } catch (error: any) {
      handleAuthError(error, "Cadastro")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await initiateGoogleSignIn(auth)
      toast({
        title: "Conectado com Google",
        description: "Acesso místico liberado.",
      })
      setIsOpen(false)
    } catch (error: any) {
      handleAuthError(error, "Login com Google")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full border-slate-200 text-slate-900 hover:bg-slate-50 font-bold gap-2">
          <LogIn className="h-4 w-4" /> Entrar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] border-slate-100 bg-white/95 backdrop-blur-xl rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline font-bold text-slate-900 text-center">Identificação Dimensional</DialogTitle>
          <DialogDescription className="text-center text-slate-500">
            Escolha seu método de entrada oficial.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12 rounded-xl flex items-center justify-center gap-3 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </Button>

          <div className="flex items-center gap-4 py-2">
            <Separator className="flex-1 bg-slate-100" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Ou use e-mail</span>
            <Separator className="flex-1 bg-slate-100" />
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-50 rounded-xl p-1 mb-4">
              <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Entrar</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSignIn)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                            <Input placeholder="seu@email.com" {...field} className="pl-10 h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-slate-900" />
                          </div>
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
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                            <Input type="password" placeholder="******" {...field} className="pl-10 h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-slate-900" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 font-bold uppercase tracking-widest rounded-xl bg-slate-900 hover:bg-black" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Acessar Rede"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSignUp)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                            <Input placeholder="seu@email.com" {...field} className="pl-10 h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-slate-900" />
                          </div>
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
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                            <Input type="password" placeholder="Mínimo 6 caracteres" {...field} className="pl-10 h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-slate-900" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 font-bold uppercase tracking-widest bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-xl border-none" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Registrar Identidade"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
