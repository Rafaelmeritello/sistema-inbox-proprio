'use client'
import { useState, useEffect ,useRef} from "react";
import { get_usuario_por_id } from "@/app/actions/usuario";
import { interface_usuario } from "@/utils/globais/interfaces";
interface Props {
texto: string
remetente_id: number
destinatario_id: number

}

export default function BoxMensagem(
    {texto,
remetente_id,
destinatario_id} : Props){
const [remetente,setremetente] = useState<interface_usuario>({
    id: 0,
    Nome: "Carregando...",
    Email: "",
    created_at: ""
})
useEffect(()=>{
async function get_remetente() {
    const dados = await get_usuario_por_id(remetente_id)
    setremetente(dados!)
}
get_remetente()
console.log(remetente)
},[])

    return (
        <>
 <div className="bg-neutral-primary-soft block max-w-sm p-6 border border-default mt-2 w-100 rounded-xl shadow-xs">
    <h5 className="mb-3  text-2xl font-semibold tracking-tight  leading-8">De: {remetente!.Nome}</h5>
    <p>Mensagem:</p>
    <p className="text-body mb-6">{texto}</p>
    <a href="#" className="inline-flex items-center text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
       {/* Marcar como lida */}
        {/* <svg className="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg> */}
    </a>
</div>
 </>
    )
}