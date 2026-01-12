'use server'
import { createClient } from "@/utils/supabase/server"
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import bcrypt from 'bcrypt'
import { redirect } from "next/navigation"
import { jwtVerify } from 'jose'





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

    if (!usuario || error) {
        return { error: "Usuário não encontrado" }
    }

    const senhaValida = await bcrypt.compare(senha_digitada + usuario.salt, usuario.senha_hash)
 
    if (!senhaValida) {
        return { error: "Senha inválida" }
    }

    
    const token = await new SignJWT({ id: usuario.id, Nome: usuario.Nome })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(SECRET)

    const cookieStore = await cookies()
    cookieStore.set('sessao_usuario', token, {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: 7200 
    })

    return { sucesso: true }
}


export async function logout() {
  const cookieStore = await cookies()
  
  cookieStore.delete('sessao_usuario')
  
  redirect('/login')
}

export async function registrar_usuario(dados_form: FormData) {
    const nome = dados_form.get('nome') as string
    const email = dados_form.get('email') as string
    const senha_pura = dados_form.get('senha') as string
    
    const supabase = await createClient()

  
    const salt_manual = crypto.randomUUID()

 
    const saltRounds = 10 
    const senha_hash = await bcrypt.hash(senha_pura + salt_manual, saltRounds)

    const { error } = await supabase
        .from('Usuarios')
        .insert([
            { 
                Nome: nome, 
                Email: email, 
                senha_hash: senha_hash, 
                salt: salt_manual       
            }
        ])

    if (error) {
        console.error("Erro no cadastro:", error.message)
        return { error: "Erro ao criar conta. O e-mail já pode estar em uso." }
    }

    redirect('/login')
}
export async function puxar_dados_sessao() {
  const cookieStore = await cookies()
  const token = cookieStore.get('sessao_usuario')?.value

  if (!token) {
    return null
  }

  try {
    const SECRET = new TextEncoder().encode(process.env.SECRET!)
    

    const { payload } = await jwtVerify(token, SECRET)
    console.log('payload aqui')
    console.log(payload)
    return {
      id: payload.id as string,
      Nome: payload.Nome as string
    }
  } catch (error) {

    console.error("Erro ao verificar token:", error)
    return null
  }
}