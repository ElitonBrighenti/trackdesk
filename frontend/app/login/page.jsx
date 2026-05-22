'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock } from 'lucide-react'

const MOCK_USER = {
  email: 'admin@trackdesk.com',
  senha: 'admin123',
  nome: 'Julian Rossi',
  cargo: 'Arquiteto Sênior'
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (email === MOCK_USER.email && password === MOCK_USER.senha) {
      localStorage.setItem('trackdesk_user', JSON.stringify(MOCK_USER))
      router.push('/dashboard')
    } else {
      setError('E-mail ou senha incorretos')
    }
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
              {/* Simulando imagem do depoimento com gradiente/cor */}
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
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h2>
            <p className="text-sm text-gray-500">
              Insira suas credenciais para acessar o workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                E-mail Corporativo
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@empresa.com"
                  className="pl-9 h-11 border-gray-200 focus:border-[#1E4FD8] focus:ring-[#1E4FD8] rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Senha
                </Label>
                <Link href="#" className="text-[11px] font-semibold text-[#1E4FD8] hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-11 border-gray-200 focus:border-[#1E4FD8] focus:ring-[#1E4FD8] rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                type="submit"
                className="w-full h-11 bg-[#1E4FD8] hover:bg-[#1a45c0] text-white font-medium rounded-lg flex items-center justify-center gap-2"
              >
                Entrar <span className="text-lg leading-none">→</span>
              </Button>
              {error && (
                <p className="text-sm text-red-500 text-center font-medium">{error}</p>
              )}
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-white px-3 text-gray-400 font-semibold">ou continue com</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                fill="#34A853"
              />
            </svg>
            Google
          </Button>

          <p className="mt-8 text-center text-sm text-gray-500">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="font-semibold text-[#1E4FD8] hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
