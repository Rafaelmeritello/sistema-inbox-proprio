'use server'
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache";
import { interface_usuario } from "@/utils/globais/interfaces";

export async function get_usuario_por_id(id: number) {
    const supabase = await createClient()
    console.log('id buscado')
    console.log(id)
   const {data, error} = await supabase.from('Usuarios').select(
        `id ,
        Email,
        Nome`
    ).eq('id',id). order('created_at', { ascending: false }).maybeSingle()


    return data as unknown as interface_usuario
} 