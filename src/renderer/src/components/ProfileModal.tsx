import React from 'react'
import { useNavigate } from 'react-router-dom'

export interface UserDTO {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  phone?: string
  address?: string
  company?: string
}

interface Props {
  user: UserDTO | null
  onClose: () => void
}

const ProfileModal: React.FC<Props> = ({ user, onClose }) => {
  const navigate = useNavigate()
  const handleClickButtonEditUser = () => {
    navigate('/editprofile')
    onClose()
  }
  //  Sécurité : si user est null on ne rend rien
  if (!user) return null

  return (
    <div className="absolute top-[130%] right-10  flex items-center justify-center z-50">
      <div className="bg-slate-50 dark:bg-slate-900  rounded-[1rem] p-6 w-96 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-6 right-8 text-gray-500 hover:rotate-45 transition ease-in-out duration-300"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-sky-600 flex items-center justify-center text-white text-xl">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <h2 className="font-bold text-lg">{user.name}</h2>
          <p>{user.email}</p>
          <p className="text-sky-600 text-sm uppercase">{user.role}</p>

          {user.phone && <p>{user.phone}</p>}
          {user.address && <p>{user.address}</p>}
          {user.company && <p>{user.company}</p>}

          <button
            onClick={() => handleClickButtonEditUser()}
            className="mt-4 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            Modifier le profil
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
