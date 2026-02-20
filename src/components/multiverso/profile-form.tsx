
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Send, Loader2, ShieldCheck, History, Ruler, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useFirestore, useUser, useAuth } from "@/firebase"
import { doc, serverTimestamp } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"

const profileSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  identificationName: z.string().min(2, "ID é obrigatório").regex(/^[a-zA-Z0-9_]+$/, "ID deve conter apenas letras, números e sublinhados"),
  age: z.coerce.number().min(1, "Idade inválida").max(999, "Idade avançada demais para esta dimensão"),
  height: z.string().min(2, "Informe sua altura (ex: 1.80m)"),
  purpose: z.string().min(10, "Conte-nos mais sobre seu propósito"),
  story: z.string().min(20, "Sua história deve ter pelo menos 20 caracteres"),
  universeName: z.string().min(2, "Qual universo você quer criar?"),
  profileImageUrl: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { firestore } = useFirestore() ? { firestore: useFirestore() } : { firestore: null };
  const { auth } = useAuth() ? { auth: useAuth() } : { auth: null };
  const { user } = useUser();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      identificationName: "",
      age: undefined,
      height: "",
      purpose: "",
      story: "",
      universeName: "",
      profileImageUrl: "",
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    if (!firestore || !auth) return;
    
    setIsSubmitting(true)

    // Se o usuário ainda não estiver autenticado (mesmo anonimamente), tenta autenticar agora
    if (!user) {
      initiateAnonymousSignIn(auth);
      toast({
        title: "Sincronizando...",
        description: "Estabelecendo conexão segura com o multiverso.",
      })
      setIsSubmitting(false)
      return;
    }

    // Gerar um número aleatório de 7 dígitos para o NDI
    const uniqueSuffix = Math.floor(1000000 + Math.random() * 9000000);
    const ndi = `4872173 - ${uniqueSuffix}`;

    const docId = user.uid; // Usa o UID anônimo como ID do documento
    const finalData = { 
      ...data, 
      id: docId,
      ndi,
      profileImageUrl: imagePreview || `https://picsum.photos/seed/${data.identificationName}/200/200`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = doc(firestore, "explorer_profiles", docId);
    
    try {
      setDocumentNonBlocking(docRef, finalData, { merge: true });
      
      toast({
        title: "Manifestação Registrada",
        description: `Seu NDI é: ${ndi}. Perfil catalogado com sucesso.`,
      })
      form.reset()
      setImagePreview(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha na Transmissão",
        description: "Houve uma interferência dimensional. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="w-full shadow-2xl border-border/50 bg-white/80 backdrop-blur-xl">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <CardTitle className="text-3xl font-headline font-bold text-primary">Inscrição de Criador</CardTitle>
          <CardDescription className="text-sm font-medium">
            Preencha sua ficha. Não é necessário conta externa.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col items-center justify-center">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-white shadow-2xl ring-2 ring-primary/5">
                  <AvatarImage src={imagePreview || ""} className="object-cover" />
                  <AvatarFallback className="bg-secondary">
                    <Camera className="h-10 w-10 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Alterar</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              <p className="mt-4 text-[10px] text-muted-foreground uppercase font-black tracking-widest">Assinatura Visual</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-black tracking-widest opacity-70">Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} className="bg-white/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identificationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-black tracking-widest opacity-70">Identificação ID</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: explorador_01" {...field} className="bg-white/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-black tracking-widest opacity-70 flex items-center gap-2">
                      <Calendar className="h-3 w-3" /> Idade
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Anos" {...field} className="bg-white/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-black tracking-widest opacity-70 flex items-center gap-2">
                      <Ruler className="h-3 w-3" /> Altura
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="ex: 1.85m" {...field} className="bg-white/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="universeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase font-black tracking-widest opacity-70">Universo a Criar</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do seu novo mundo" {...field} className="bg-white/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase font-black tracking-widest opacity-70">Propósito</FormLabel>
                  <FormControl>
                    <Input placeholder="Qual sua missão?" {...field} className="bg-white/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="story"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase font-black tracking-widest opacity-70 flex items-center gap-2">
                    <History className="h-3 w-3" /> História
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Conte sobre sua trajetória..." 
                      className="min-h-[100px] bg-white/50 resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl transition-all active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" /> Iniciar Manifestação
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
