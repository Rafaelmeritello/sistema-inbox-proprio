'use client'
import { useState } from "react";
import { login } from "@/app/actions/auth";
import { useRouter } from 'next/navigation'
export default function PaginaLogin() {
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);
const router = useRouter()
    async function aoSubmeter(dados: FormData) {
        setErro(null);
        setCarregando(true);
        
    
        const resultado = await login(dados);
       if(resultado.sucesso){
    router.push('/')
       }
        if (resultado?.error) {
            setErro(resultado.error);
            setCarregando(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4 text-white">
            <form action={aoSubmeter} className="w-full max-w-[400px] rounded-xl border border-zinc-800 bg-[#141414] p-8 shadow-2xl">
                <h2 className="mb-6 text-center text-2xl font-bold">Entrar</h2>

                {erro && (
                    <div className="mb-4 rounded border border-red-500/50 bg-red-500/10 p-3 text-center text-sm text-red-500">
                        {erro}
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-zinc-400">E-mail</label>
                        <input 
                            name="email"
                            type="email" 
                            placeholder="exemplo@teste.com"
                            className="rounded-lg border border-zinc-800 bg-black p-3 outline-none focus:border-blue-500 transition-colors"
                            required 
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-zinc-400">Senha</label>
                        <input 
                            name="senha" 
                            type="password" 
                            placeholder="......."
                            className="rounded-lg border border-zinc-800 bg-black p-3 outline-none focus:border-blue-500 transition-colors"
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={carregando}
                        className="mt-2 w-full rounded-lg bg-white p-3 font-bold text-black hover:bg-zinc-200 disabled:bg-zinc-700 transition-all"
                    >
                        {carregando ? "Carregando..." : "Sign In"}
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-zinc-500">
                    Esqueceu a senha? <a href="#" className="text-blue-500 hover:underline">Clique aqui</a>
                </p>
            </form>
        </div>
    );
}