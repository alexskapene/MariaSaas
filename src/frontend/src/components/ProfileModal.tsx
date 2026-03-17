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
  onLogout: () => void
}

const ProfileModal: React.FC<Props> = ({ user, onClose, onLogout }) => {
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
          <div>
            {/* Button Edit profil user */}
            <button
              onClick={() => handleClickButtonEditUser()}
              className="flex items-center justify-center gap-2 mx-auto my-4 px-5 py-4 bg-sky-600 text-white uppercase font-black text-[10px] tracking-widest  rounded-xl hover:bg-sky-700 transition-colors group"
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 group-hover:translate-x-1 transition-transform "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              <span></span>Modifier le profil
            </button>

            {/* Button Logout */}
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-5 py-4 text-red-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-50 bg-red-900/15 dark:hover:bg-red-900/25 transition-colors group"
            >
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
