'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export default function CadastroPage() {
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Lado Esquerdo - Azul */}
      <div className="hidden lg:flex w-1/2 bg-[#1E4FD8] flex-col justify-between p-12 relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <span className="text-[#1E4FD8] font-bold text-lg leading-none">A</span>
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">TrackDesk</span>
        </div>

        {/* Conteúdo Central */}
        <div className="z-10 mt-16 max-w-md">
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            A estrutura modular para o seu sucesso operacional.
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Gerencie tickets, prazos e fluxos de trabalho com a precisão de um arquiteto.
            Simples, robusto e escalável.
          </p>
        </div>

        {/* Cards Inferiores (Métricas e Depoimento) */}
        <div className="z-10 mt-20 space-y-4">
          {/* Métricas */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 grid grid-cols-3 gap-4 max-w-md">
            <div>
              <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold mb-1">Tickets Ativos</p>
              <p className="text-2xl font-bold text-white">1,284</p>
            </div>
            <div className="border-l border-white/20 pl-4">
              <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold mb-1">Tempo Resposta</p>
              <p className="text-2xl font-bold text-white">14m</p>
            </div>
            <div className="border-l border-white/20 pl-4">
              <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold mb-1">Satisfação</p>
              <p className="text-2xl font-bold text-white">98%</p>
            </div>
          </div>

          {/* Depoimento */}
          <div className="bg-[#EBF1FF] rounded-xl p-5 border border-blue-100 max-w-md flex gap-4 items-start shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-300 overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-700 italic mb-2">
                "O TrackDesk transformou nossa produtividade em menos de uma semana."
              </p>
              <p className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">
                Marcos Silva, Diretor de Ops
              </p>
            </div>
          </div>
        </div>

        {/* Fundo decorativo simulado */}
        <div className="absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 opacity-10 pointer-events-none">
          <div className="grid grid-cols-2 gap-4">
            <div className="w-32 h-32 border-8 border-white rounded-lg"></div>
            <div className="w-32 h-32 border-8 border-white rounded-lg"></div>
            <div className="w-32 h-32 border-8 border-white rounded-lg"></div>
            <div className="w-32 h-32 border-8 border-white rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Comece agora</h2>
            <p className="text-sm text-gray-500">
              Crie sua conta no Helpdesk Engine em poucos segundos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                Nome Completo
              </Label>
              <Input
                id="name"
                placeholder="Seu nome"
                className="h-11 border-gray-200 focus:border-[#1E4FD8] focus:ring-[#1E4FD8] rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                E-mail Corporativo
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@empresa.com"
                className="h-11 border-gray-200 focus:border-[#1E4FD8] focus:ring-[#1E4FD8] rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 border-gray-200 focus:border-[#1E4FD8] focus:ring-[#1E4FD8] rounded-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                  Confirmar Senha
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 border-gray-200 focus:border-[#1E4FD8] focus:ring-[#1E4FD8] rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-3 mt-4">
              <Checkbox id="terms" className="mt-1 border-gray-300 data-[state=checked]:bg-[#1E4FD8] data-[state=checked]:border-[#1E4FD8]" required />
              <Label htmlFor="terms" className="text-xs text-gray-600 leading-tight font-normal">
                Eu concordo com os <Link href="#" className="font-semibold text-[#1E4FD8] hover:underline">Termos de Uso</Link> e a <Link href="#" className="font-semibold text-[#1E4FD8] hover:underline">Política de Privacidade</Link> do TrackDesk.
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#1E4FD8] hover:bg-[#1a45c0] text-white font-medium rounded-lg flex items-center justify-center gap-2 mt-4"
            >
              Criar Minha Conta <span className="text-lg leading-none">→</span>
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-white px-3 text-gray-400 font-semibold">ou continue com</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-11 border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Já tem uma conta?{' '}
            <Link href="/login" className="font-semibold text-[#1E4FD8] hover:underline">
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
