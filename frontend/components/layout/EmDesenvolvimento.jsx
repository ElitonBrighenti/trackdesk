import { Construction } from 'lucide-react'

export default function EmDesenvolvimento({ titulo, descricao }) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center max-w-md mx-auto">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <Construction size={40} className="text-[#1E4FD8]" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {titulo || 'Em Desenvolvimento'}
      </h1>
      <p className="text-gray-500">
        {descricao || 'Esta funcionalidade está no nosso roadmap e será liberada em breve nas próximas atualizações do sistema.'}
      </p>
    </div>
  )
}
