
"use client"

import { useState, useEffect } from "react"
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
import { Camera, Send, Loader2, ShieldCheck, History, Ruler, Calendar, Lock, Sparkles, UserCheck, LayoutDashboard, Stars, Zap } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase"
import { doc, serverTimestamp } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"

const profileSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  identificationName: z.string().min(2, "ID é obrigatório").regex(/^[a-zA-Z0-9_]+$/, "ID deve conter apenas letras, números e sublinhados"),
  age: z.coerce.number().min(1, "Idade inválida").max(999, "Idade avançada demais"),
  height: z.string().min(2, "Informe sua altura (ex: 1.80m)"),
  purpose: z.string().min(10, "Conte-nos mais sobre seu propósito"),
  story: z.string().min(20, "Sua história deve ter pelo menos 20 caracteres"),
  universeName: z.string().min(2, "Qual o nome do universo que você quer criar?"),
  profileImageUrl: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const firestore = useFirestore();
  const { user } = useUser();

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "explorer_profiles", user.uid);
  }, [firestore, user]);

  const { data: existingProfile, isLoading: isProfileLoading } = useDoc(profileRef);

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

  useEffect(() => {
    if (existingProfile) {
      form.reset({
        name: existingProfile.name,
        identificationName: existingProfile.identificationName,
        age: existingProfile.age,
        height: existingProfile.height,
        purpose: existingProfile.purpose,
        story: existingProfile.story,
        universeName: existingProfile.universeName,
        profileImageUrl: existingProfile.profileImageUrl,
      });
      setImagePreview(existingProfile.profileImageUrl || null);
    }
  }, [existingProfile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!firestore || !user) {
      toast({
        variant: "destructive",
        title: "Acesso Negado",
        description: "Entre na rede para manifestar sua presença.",
      })
      return;
    }
    
    setIsSubmitting(true)

    const ndi = existingProfile?.ndi || `4872173 - ${Math.floor(1000000 + Math.random() * 9000000)}`;
    const docId = user.uid;
    
    const finalData = { 
      ...data, 
      id: docId,
      ndi,
      profileImageUrl: imagePreview || `https://picsum.photos/seed/${data.identificationName}/400/400`,
      createdAt: existingProfile?.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = doc(firestore, "explorer_profiles", docId);
    
    try {
      setDocumentNonBlocking(docRef, finalData, { merge: true });
      toast({
        title: existingProfile ? "Manifestação Sincronizada" : "Universo Manifestado",
        description: `Protocolo ${ndi} registrado com sucesso.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de Frequência",
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
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  if (!user) {
    return (
      <Card className="w-full bg-white rounded-[2.5rem] p-12 text-center border-slate-100 shadow-2xl">
        <CardContent className="space-y-10">
          <div className="p-10 bg-slate-50 w-fit mx-auto rounded-full">
            <Lock className="h-16 w-16 text-slate-200" />
          </div>
          <div className="space-y-4">
            <h3 className="text-4xl font-headline font-bold text-slate-900">Linha Protegida</h3>
            <p className="text-xl text-slate-400 font-light max-w-sm mx-auto">
              Sua identidade dimensional precisa ser validada antes da manifestação.
            </p>
          </div>
          <Button variant="outline" className="rounded-full h-16 px-12 text-lg font-bold border-slate-200 hover:bg-slate-50" asChild>
            <a href="#navbar">Subir para Identificação</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isProfileLoading) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center bg-white rounded-[2.5rem] border-slate-100">
        <Loader2 className="h-12 w-12 animate-spin text-slate-200" />
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white rounded-[2.5rem] border-slate-100 shadow-2xl overflow-hidden">
      <div className="h-4 bg-slate-900 w-full" />
      <CardHeader className="text-center p-12 space-y-6">
        <div className="flex justify-center">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative">
            {existingProfile ? <Zap className="h-10 w-10 text-slate-900" /> : <Sparkles className="h-10 w-10 text-slate-900" />}
            <Stars className="h-5 w-5 text-slate-200 absolute -top-2 -right-2" />
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-4xl font-headline font-bold text-slate-900">
            {existingProfile ? "Painel do Arquiteto" : "Iniciar Manifestação"}
          </CardTitle>
          <CardDescription className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">
            {existingProfile ? `Editando Protocolo: ${existingProfile.ndi}` : "Sincronizando Nova Realidade"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-12 pb-16">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-40 w-40 border-[10px] border-slate-50 shadow-2xl transition-all duration-500 group-hover:scale-105">
                  <AvatarImage src={imagePreview || ""} className="object-cover" />
                  <AvatarFallback className="bg-slate-50">
                    <Camera className="h-12 w-12 text-slate-200" />
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                  <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Trocar Avatar</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Nome Civil</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus-visible:ring-slate-900" />
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
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Identificador ID</FormLabel>
                    <FormControl>
                      <Input placeholder="explorador_xyz" {...field} className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus-visible:ring-slate-900" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Idade (Ciclos)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="00" {...field} className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus-visible:ring-slate-900" />
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
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Estatura</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: 1.80m" {...field} className="h-14 bg-slate-50 border-none rounded-2xl px-6 focus-visible:ring-slate-900" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-8 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <FormField
                control={form.control}
                name="universeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Designação do Mundo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da sua realidade" {...field} className="h-14 bg-white border-none rounded-2xl px-6 shadow-sm" />
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
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Missão Primária</FormLabel>
                    <FormControl>
                      <Input placeholder="O que você busca?" {...field} className="h-14 bg-white border-none rounded-2xl px-6 shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="story"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Registros Históricos</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Sua trajetória através das dimensões..." 
                      className="min-h-[160px] bg-slate-50 border-none rounded-2xl px-6 py-4 resize-none focus-visible:ring-slate-900"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-black text-white font-black uppercase tracking-[0.4em] h-20 rounded-[1.5rem] shadow-2xl transition-all active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-4">
                  <Stars className="h-5 w-5" /> {existingProfile ? "Salvar Manifestação" : "Ativar Universo"}
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
