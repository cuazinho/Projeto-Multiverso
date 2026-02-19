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
import { Camera, Send, Sparkles } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const profileSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  idName: z.string().min(2, "ID é obrigatório").regex(/^[a-zA-Z0-9_]+$/, "ID deve conter apenas letras, números e sublinhados"),
  purpose: z.string().min(10, "Conte-nos mais sobre seu propósito"),
  universe: z.string().min(2, "De qual universo você vem?"),
  profileImage: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  onAddExplorer: (explorer: ProfileFormValues) => void;
}

export function ProfileForm({ onAddExplorer }: ProfileFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      idName: "",
      purpose: "",
      universe: "",
      profileImage: "",
    },
  })

  const onSubmit = (data: ProfileFormValues) => {
    const finalData = { ...data, profileImage: imagePreview || `https://picsum.photos/seed/${data.idName}/200/200` }
    onAddExplorer(finalData)
    toast({
      title: "Inscrição Realizada!",
      description: "Bem-vindo ao multiverso, explorador.",
    })
    form.reset()
    setImagePreview(null)
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
        <CardTitle className="text-3xl font-headline font-bold">Sua Ficha de Explorador</CardTitle>
        <CardDescription>
          Preencha seus dados para ser catalogado no grande multiverso.
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
              <p className="mt-2 text-xs text-muted-foreground">Clique para definir sua imagem de perfil</p>
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
                name="idName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de Identificação</FormLabel>
                    <FormControl>
                      <Input placeholder="seu_id_unico" {...field} />
                    </FormControl>
                    <FormDescription>Seu @ no multiverso</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="universe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Universo de Origem</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Terra-616, Dimensão C-137" {...field} />
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
                  <FormLabel>Qual seu Propósito?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o que te motiva a explorar o multiverso..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-primary hover:bg-accent text-lg font-headline h-12">
              <Send className="mr-2 h-5 w-5" /> Inscrever no Projeto Multiverso
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
