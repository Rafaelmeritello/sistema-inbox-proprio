'use client'
import { useState, useEffect ,useRef} from "react";
import { buscarmensageminbox,inserirmensageminbox } from "./actions/mensagem";
import BoxMensagem from "@/components/box_mensagem";

export default function Pagina(){

    //variavies

    var [Mensagens,setMensagens] = useState<any[]>([])
// funcoes
async function criar_mensagem(){
    await inserirmensageminbox('Testeinsert',1,2)
    alert('mensagem criada')
}

useEffect(()=>{
async function carregar_mensagens_teste() {
    const dados = await buscarmensageminbox()
    console.log('dados')
    console.log(dados)
    setMensagens(dados)
}
carregar_mensagens_teste()
},[])
    // pagina
    return (
        <>
        <div className="flex flex-col   items-center mt-10 justify-center p-3">
<div className="border-1 border-solid p-3 rounded-xl w-200 flex flex-col items-center justify-center">

 <h1 className="text-center text-xl">Histórico de mensagens de <a className="text-blue-500 mt-2" href="#">Rafael Delmas</a></h1>
<select name="enviadas_recebidas" id="enviadas_recebidas">
    <option value="enviadas">Enviadas</option>
        <option value="recebidas">Recebidas</option>
</select>
<a href="#" className="text-blue-500 mt-2" onClick={async ()=>{ await criar_mensagem()}}>Criar nova mensagem</a>
{Mensagens.map((mensagem,i)=>(
    
   <BoxMensagem key={i} texto={mensagem.texto} remetente_id={1} destinatario_id={2} ></BoxMensagem>

 ))}
</div>


 </div>

 </>
    )
}