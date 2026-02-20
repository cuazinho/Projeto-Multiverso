
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
import { initiateEmailSignIn, initiateEmailSignUp, initiateDiscordSignIn } from "@/firebase/non-blocking-login"
import { LogIn, UserPlus, Loader2, Mail, Lock } from "lucide-react"
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

  const onSignIn = async (data: AuthFormValues) => {
    setIsLoading(true)
    try {
      initiateEmailSignIn(auth, data.email, data.password)
      toast({
        title: "Conectando...",
        description: "Validando suas credenciais dimensionais.",
      })
      setIsOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de Acesso",
        description: "Verifique seu e-mail e senha.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUp = async (data: AuthFormValues) => {
    setIsLoading(true)
    try {
      initiateEmailSignUp(auth, data.email, data.password)
      toast({
        title: "Conta Criada",
        description: "Seja bem-vindo ao Projeto Multiverso!",
      })
      setIsOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no Cadastro",
        description: "Não foi possível criar sua conta agora.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDiscordSignIn = () => {
    setIsLoading(true)
    try {
      initiateDiscordSignIn(auth)
      setIsOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro Discord",
        description: "Falha na conexão com o servidor do Discord.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold gap-2">
          <LogIn className="h-4 w-4" /> Entrar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] border-border/50 bg-white/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline font-bold text-primary text-center">Identificação Dimensional</DialogTitle>
          <DialogDescription className="text-center">
            Escolha seu método de entrada oficial.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Button 
            onClick={handleDiscordSignIn}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12 rounded-xl flex items-center justify-center gap-3 border-[#5865F2]/20 text-[#5865F2] hover:bg-[#5865F2]/5 font-bold"
          >
            <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.48,80.21a105.73,105.73,0,0,0,32.28,16.15,77.7,77.7,0,0,0,7.37-12,67.39,67.39,0,0,1-11.87-5.65c.99-.73,2-1.48,2.92-2.26a74.35,74.35,0,0,0,64.59,0c.95.78,1.93,1.53,2.92,2.26a67.85,67.85,0,0,1-11.89,5.65,77.89,77.89,0,0,0,7.37,12,105.3,105.3,0,0,0,32.31-16.15C130.58,52.2,121.81,28.7,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.07,65.69,82.45,65.69Z"/>
            </svg>
            Entrar com Discord
          </Button>

          <div className="flex items-center gap-4 py-2">
            <Separator className="flex-1" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Ou use e-mail</span>
            <Separator className="flex-1" />
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50 rounded-xl p-1">
              <TabsTrigger value="login" className="rounded-lg">Entrar</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSignIn)} className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">E-mail</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="seu@email.com" {...field} className="pl-10 rounded-xl" />
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
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="******" {...field} className="pl-10 rounded-xl" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 font-bold uppercase tracking-widest rounded-xl" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Acessar Rede"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSignUp)} className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">E-mail</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="seu@email.com" {...field} className="pl-10 rounded-xl" />
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
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="Mínimo 6 caracteres" {...field} className="pl-10 rounded-xl" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 font-bold uppercase tracking-widest bg-accent hover:bg-accent/90 rounded-xl" disabled={isLoading}>
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
