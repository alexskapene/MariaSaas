import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@renderer/app/store/store'
import { User } from '../types/user'

const EditProfile: React.FC = () => {
  const navigate = useNavigate()
  const userFromStore = useSelector((state: RootState) => state.auth.user)

  // ✅ initialisation directe
  const [formData, setFormData] = useState<User>(
    userFromStore || {
      id: '',
      name: '',
      email: '',
      role: '',
      avatar: '',
      phone: '',
      address: '',
      company: ''
    }
  )

  if (!formData) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    navigate(-1)
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-slate-900 p-12 rounded-[1rem] shadow">
      <h1 className="text-xl font-bold mb-6">Modifier le profil</h1>

      <div className="space-y-3">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nom"
          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none dark:text-white"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none dark:text-white"
        />
        <input
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Rôle"
          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none dark:text-white"
        />
        <input
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          placeholder="Téléphone"
          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none dark:text-white"
        />
        <input
          name="address"
          value={formData.address || ''}
          onChange={handleChange}
          placeholder="Adresse"
          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none dark:text-white"
        />
        <input
          name="company"
          value={formData.company || ''}
          onChange={handleChange}
          placeholder="Entreprise"
          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none dark:text-white"
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="w-[140px] py-2 text-white bg-red-500 hover:bg-red-600 rounded"
        >
          Annuler
        </button>

        <button
          onClick={handleSave}
          className="w-[140px] py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  )
}

export default EditProfile
