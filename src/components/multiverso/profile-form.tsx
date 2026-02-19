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
import { Camera, Send, Sparkles, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useFirestore, useUser, useAuth } from "@/firebase"
import { doc, serverTimestamp } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"

const profileSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  identificationName: z.string().min(2, "ID é obrigatório").regex(/^[a-zA-Z0-9_]+$/, "ID deve conter apenas letras, números e sublinhados"),
  purpose: z.string().min(10, "Conte-nos mais sobre seu propósito"),
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
      purpose: "",
      universeName: "",
      profileImageUrl: "",
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    if (!firestore || !auth) return;
    
    setIsSubmitting(true)

    // Ensure user is signed in before saving
    let currentUser = user;
    if (!currentUser) {
      initiateAnonymousSignIn(auth);
      toast({
        title: "Autenticando...",
        description: "Preparando seu acesso ao multiverso.",
      })
      setIsSubmitting(false)
      return;
    }

    const docId = currentUser.uid;
    const finalData = { 
      ...data, 
      id: docId,
      profileImageUrl: imagePreview || `https://picsum.photos/seed/${data.identificationName}/200/200`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = doc(firestore, "explorer_profiles", docId);
    
    try {
      setDocumentNonBlocking(docRef, finalData, { merge: true });
      
      toast({
        title: "Manifestação Concluída!",
        description: "Seu universo e perfil foram registrados com sucesso.",
      })
      form.reset()
      setImagePreview(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro Dimensional",
        description: "Não foi possível registrar seu perfil agora.",
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
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-accent/20">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-headline font-bold">Ficha de Criador Real</CardTitle>
        <CardDescription>
          Apenas exploradores autênticos podem manifestar realidades no Projeto Multiverso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative group cursor-pointer">
                <Avatar className="h-32 w-32 border-4 border-accent ring-4 ring-accent/20">
                  <AvatarImage src={imagePreview || ""} />
                  <AvatarFallback className="bg-muted">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-xs font-bold">Mudar Foto</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Sua identidade visual no multiverso</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Real</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
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
                    <FormLabel>Nome de Identificação</FormLabel>
                    <FormControl>
                      <Input placeholder="seu_id_unico" {...field} />
                    </FormControl>
                    <FormDescription>Seu @ universal</FormDescription>
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
                  <FormLabel>Nome do Universo que deseja criar</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Nova Terra, Dimensão Alpha-X" {...field} />
                  </FormControl>
                  <FormDescription>O nome da realidade que você vai arquitetar</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual seu Propósito Criativo?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o que te motiva a dar vida a este novo universo..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-accent text-lg font-headline h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Manifestando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" /> Registrar como Criador Real
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
