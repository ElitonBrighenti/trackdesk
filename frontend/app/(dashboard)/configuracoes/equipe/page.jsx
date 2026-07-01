'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { getProfiles, updateRole } from '@/lib/api'
import { ArrowLeft, UserPlus, Shield, ShieldCheck, User } from 'lucide-react'
import toast from 'react-hot-toast'

const roleDetails = {
  admin: { icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Administrador' },
  gestor: { icon: Shield, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Gestor' },
  membro: { icon: User, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Membro' }
}

export default function EquipePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const usr = await getUser()
      if (!usr || (usr.role !== 'admin' && usr.role !== 'gestor')) {
        router.push('/configuracoes')
        return
      }
      setCurrentUser(usr)
      
      try {
        const perfis = await getProfiles()
        setProfiles(perfis)
      } catch (err) {
        toast.error('Erro ao carregar equipe.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router])

  const handleRoleChange = async (profileId, newRole) => {
    if (currentUser?.role !== 'admin') {
      toast.error('Apenas Administradores podem alterar permissões.')
      return
    }

    // Se o user estiver tentando tirar o proprio admin, alerta (basico)
    if (profileId === currentUser.id && newRole !== 'admin') {
      if (!confirm('Você está removendo seu próprio acesso de Admin. Tem certeza?')) return
    }

    try {
      await updateRole(profileId, newRole)
      setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, role: newRole } : p))
      toast.success('Permissão atualizada com sucesso!')
    } catch (err) {
      toast.error('Erro ao atualizar permissão.')
    }
  }

  if (loading) return null

  return (
    <div className="max-w-5xl">
      {/* Header com botão voltar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/configuracoes')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Equipe e Acessos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie quem tem acesso ao seu workspace.
            </p>
          </div>
        </div>
        
        {/* Gestores e Admins podem convidar (apenas visual por enquanto) */}
        <button className="flex items-center gap-2 bg-[#1E4FD8] hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
          <UserPlus size={16} />
          Convidar Membro
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuário</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nível de Acesso</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Membro desde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {profiles.map((profile) => {
              const RoleIcon = roleDetails[profile.role]?.icon || User
              const isCurrentUser = profile.id === currentUser.id
              const isAdmin = currentUser.role === 'admin'

              return (
                <tr key={profile.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${isCurrentUser ? 'bg-[#1E4FD8] text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {profile.email.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          {profile.email}
                          {isCurrentUser && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">VOCÊ</span>}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${roleDetails[profile.role]?.bg} ${roleDetails[profile.role]?.color}`}>
                        <RoleIcon size={14} />
                      </div>
                      
                      {/* Se for Admin, mostra select, senão mostra apenas texto */}
                      {isAdmin ? (
                        <select 
                          value={profile.role}
                          onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                          className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer hover:bg-gray-100 px-1 py-1 rounded"
                        >
                          <option value="admin">Administrador (Acesso Total)</option>
                          <option value="gestor">Gestor (Acesso Parcial)</option>
                          <option value="membro">Membro (Visualização/Operação)</option>
                        </select>
                      ) : (
                        <span className="text-sm font-medium text-gray-700">
                          {roleDetails[profile.role]?.label || 'Membro'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-500 font-medium">
                    {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {profiles.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            Nenhum membro encontrado.
          </div>
        )}
      </div>
    </div>
  )
}
