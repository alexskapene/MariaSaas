// src/renderer/src/components/EditProfile.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@renderer/app/store/store'
import { updateProfile, clearAuthError } from '@renderer/app/store/slice/authSlice'

interface FormData {
  name: string
  email: string
  phone: string
  avatar: string
  password: string
  passwordConfirm: string
}

interface LocalErrors {
  name?: string
  email?: string
  phone?: string
  password?: string
  passwordConfirm?: string
}

// ── Déclaré EN DEHORS du composant parent ────────────────────────────────────
interface FieldProps {
  label: string
  name: keyof FormData
  type?: string
  placeholder?: string
  value: string
  error?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Field: React.FC<FieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  error,
  onChange
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder ?? label}
      autoComplete={type === 'password' ? 'new-password' : 'off'}
      className={`w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none dark:text-white transition-colors
        ${error ? 'ring-2 ring-red-400' : 'focus:ring-2 focus:ring-green-400'}`}
    />
    {error && <span className="text-xs text-red-500 pl-1">{error}</span>}
  </div>
)

// ── Composant principal ───────────────────────────────────────────────────────
const EditProfile: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState<FormData>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    avatar: user?.avatar ?? '',
    password: '',
    passwordConfirm: ''
  })

  const [localErrors, setLocalErrors] = useState<LocalErrors>({})
  const [success, setSuccess] = useState(false)

  if (!user) return null

  const validate = (): boolean => {
    const errs: LocalErrors = {}

    if (formData.name.trim() && formData.name.trim().length < 2)
      errs.name = 'Le nom doit contenir au moins 2 caractères'

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Email invalide'

    if (formData.phone && !/^[+\d\s\-().]{6,20}$/.test(formData.phone))
      errs.phone = 'Numéro de téléphone invalide'

    if (formData.password) {
      if (formData.password.length < 6)
        errs.password = 'Le mot de passe doit contenir au moins 6 caractères'
      else if (formData.password !== formData.passwordConfirm)
        errs.passwordConfirm = 'Les mots de passe ne correspondent pas'
    }

    setLocalErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setLocalErrors((prev) => ({ ...prev, [name]: undefined }))
    dispatch(clearAuthError())
    setSuccess(false)
  }

  const handleSave = async () => {
    if (!validate()) return

    const result = await dispatch(
      updateProfile({
        userId: user.id,
        name: formData.name.trim() || undefined,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim(),
        avatar: formData.avatar.trim(),
        password: formData.password,
        passwordConfirm: formData.passwordConfirm
      })
    )

    if (updateProfile.fulfilled.match(result)) {
      setSuccess(true)
      setFormData((prev) => ({ ...prev, password: '', passwordConfirm: '' }))
      setTimeout(() => navigate(-1), 1500)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-slate-900 p-12 rounded-[1rem] shadow">
      <h1 className="text-xl font-bold mb-1 dark:text-white">Modifier le profil</h1>
      <p className="text-sm text-slate-400 mb-6">Laissez un champ vide pour ne pas le modifier.</p>

      <div className="space-y-3">
        <Field
          label="Nom"
          name="name"
          value={formData.name}
          error={localErrors.name}
          onChange={handleChange}
          placeholder="Votre nom complet"
        />
        <Field
          label="Email"
          name="email"
          value={formData.email}
          error={localErrors.email}
          onChange={handleChange}
          type="email"
          placeholder="votre@email.com"
        />
        <Field
          label="Téléphone"
          name="phone"
          value={formData.phone}
          error={localErrors.phone}
          onChange={handleChange}
          placeholder="+33 6 00 00 00 00"
        />
        <Field
          label="Avatar (URL)"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
        <p className="text-sm font-medium text-slate-500">Changer le mot de passe (optionnel)</p>
        <Field
          label="Nouveau mot de passe"
          name="password"
          type="password"
          value={formData.password}
          error={localErrors.password}
          onChange={handleChange}
          placeholder="••••••••"
        />
        <Field
          label="Confirmer mot de passe"
          name="passwordConfirm"
          type="password"
          value={formData.passwordConfirm}
          error={localErrors.passwordConfirm}
          onChange={handleChange}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="mt-4 px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 px-4 py-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl text-sm">
          ✅ Profil mis à jour avec succès !
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => navigate(-1)}
          disabled={isLoading}
          className="w-[140px] py-2 text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-[140px] py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Envoi…
            </>
          ) : (
            'Sauvegarder'
          )}
        </button>
      </div>
    </div>
  )
}

export default EditProfile
