'use server'
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache";

export async function buscarmensageminbox() {
    const supabase = await createClient()
    const {data, error} = await supabase.from('mensagens').select(
        `id ,
        created_at,
        texto`
    ).order('created_at', { ascending: false })

    
    if (error) {
    console.error("Erro na busca:", error.message);
    return [];
  }


  return data;
}

export async function inserirmensageminbox(texto: string, id_destinatario: number, id_remetente: number) {
    const supabase = await createClient()
  const  {data,error} = await supabase.from('mensagens').insert([{
    texto: texto,
    id_criador: id_remetente,
    id_destinatario: id_destinatario
  }])
  if (error) {
        console.error("Erro ao inserir:", error.message)
        throw new Error("Falha ao enviar mensagem")
    }
    revalidatePath('/') 
    
    return data
} 