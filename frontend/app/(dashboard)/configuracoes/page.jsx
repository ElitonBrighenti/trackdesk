'use client'

import { useEffect, useState } from 'react'
import { getUser } from '@/lib/auth'
import { Shield, ShieldCheck, Bell, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const getInitials = (name) => {
  if (!name) return 'U'
  const parts = name.split(' ')
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export default function ConfiguracoesPage() {
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresa: 'TrackDesk Inc.', // Default falso
    cargo: ''
  })
  const [showToast, setShowToast] = useState(false)

  const carregarUsuario = () => {
    const usr = getUser()
    if (usr) {
      setUser(usr)
      setFormData({
        nome: usr.nome || '',
        email: usr.email || '',
        empresa: 'TrackDesk Inc.',
        cargo: usr.cargo || ''
      })
    }
  }

  useEffect(() => {
    carregarUsuario()
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleDescartar = () => {
    carregarUsuario()
  }

  const handleSalvar = () => {
    // Simula a persistência
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  if (!user) {
    return null // Evita flicker durante carregamento
  }

  // Data atual formatada (Membro desde)
  const today = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const memberSince = today.charAt(0).toUpperCase() + today.slice(1)

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie suas preferências e informações de perfil.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Coluna Esquerda (1/3) */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          {/* Card Perfil */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1E4FD8] to-blue-400 flex items-center justify-center text-white text-3xl font-bold shadow-md mb-4">
              {getInitials(user.nome)}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{user.nome}</h2>
            <p className="text-sm text-gray-500 mb-6">{user.email}</p>
            
            <div className="w-full border-t border-gray-100 pt-4 flex flex-col gap-3 text-left">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status da Conta</span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Ativo
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Membro desde</span>
                <span className="text-sm font-medium text-gray-900">{memberSince}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita (2/3) */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          {/* Formulário */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Informações Pessoais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Seu e-mail"
                  disabled
                  className="bg-gray-50 text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa que trabalha</Label>
                <Input
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo na empresa</Label>
                <Input
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  placeholder="Seu cargo"
                />
              </div>
            </div>

            {/* 2FA */}
            <div className="flex items-center gap-2 mb-8 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
              <ShieldCheck size={18} className="text-[#1E4FD8]" />
              <span className="text-sm font-medium text-[#1E4FD8]">Autenticação de dois fatores ativa</span>
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 relative">
              {showToast && (
                <div className="absolute left-0 flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 size={16} />
                  <span className="text-sm font-medium">Alterações salvas!</span>
                </div>
              )}
              <Button variant="outline" onClick={handleDescartar}>
                Descartar
              </Button>
              <Button onClick={handleSalvar} className="bg-[#1E4FD8] hover:bg-blue-700">
                Salvar Alterações
              </Button>
            </div>
          </div>

          {/* Cards Inferiores Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Segurança */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Shield size={20} className="text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Segurança</h3>
              <p className="text-xs text-gray-500 mb-3">
                Atualize sua senha e revise os dispositivos
              </p>
              <span className="text-sm font-semibold text-purple-600 group-hover:underline">
                Configurar segurança &rarr;
              </span>
            </div>

            {/* Notificações */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <Bell size={20} className="text-orange-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Notificações</h3>
              <p className="text-xs text-gray-500 mb-3">
                Escolha como e quando receber alertas
              </p>
              <span className="text-sm font-semibold text-orange-600 group-hover:underline">
                Gerenciar alertas &rarr;
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
