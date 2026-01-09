'use server'
import { createClient } from "@/utils/supabase/server"
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import bcrypt from 'bcrypt'
import { redirect } from "next/navigation"
export async function login(dados_form: FormData) {
const email = dados_form.get('email') as string
const senha_digitada = dados_form.get('senha') as string
const supabase = await createClient()
const SECRET = new TextEncoder().encode(process.env.SECRET!)

  const { data: usuario, error } = await supabase
    .from('Usuarios')
    .select('*')
    .eq('Email', email)
    .maybeSingle()
    if (!usuario || error) return { error: "Usuário não encontrado" }
    const senhaValida = await bcrypt.compare(senha_digitada, usuario.senha)
    if (!senhaValida) {
    return { error: "Senha inválida" }
}
const token = await new SignJWT({ id: usuario.id, nome: usuario.nome })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET)

    const cookieStore = await cookies()
    cookieStore.set('inbox_session', token, {
    httpOnly: true, // (pelo que entendi. é bom para segurança)
    secure: true,
    path: '/',
    maxAge: 7200 
  })
return { sucesso: true }


} 





export async function registrar_usuario(dados_form: FormData) {
    const nome = dados_form.get('nome') as string
    const email = dados_form.get('email') as string
    const senha_pura = dados_form.get('senha') as string
    
    const supabase = await createClient()

    const saltRounds = 10 
    const senha_hash = await bcrypt.hash(senha_pura, saltRounds)

const { data, error } = await supabase
        .from('Usuarios')
        .insert([
            { 
                nome: nome, 
                Email: email, 
                senha: senha_hash 
            }
        ])
        .select()

        if (error) {
        console.error("Erro no cadastro:", error.message)
        return { error: "Erro ao criar conta. O e-mail já pode estar em uso." }
    }

   
    redirect('/login')
}