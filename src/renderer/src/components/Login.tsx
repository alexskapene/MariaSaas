import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginSchema, LoginInput } from '@shared/schemas/authSchema'
import { loginUser, clearAuthError } from '@renderer/app/store/slice/authSlice'
import { RootState, AppDispatch } from '@renderer/app/store/store'
import loginBg from '@renderer/assets/black-physician-looking-clinical-records-find-treatment-her-cabinet.jpg'

// On étend le type du formulaire pour inclure la checkbox locale
type LoginFormType = LoginInput

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth)

  // État local pour l'affichage du mot de passe
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema), // Note: Zod ne valide que email/password, rememberMe est géré à part
    defaultValues: {
      email: 'admin@mariasaas.com',
      password: 'password123',
      rememberMe: false
    }
  })

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  const onSubmit = (data: LoginFormType) => {
    // On passe tout au Thunk (email, password, rememberMe)
    dispatch(
      loginUser({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe || false
      })
    )
  }

  return (
    <div
      className="h-screen w-screen flex items-center justify-center relative overflow-hidden font-sans"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
        // backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-sky-600/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-emerald-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

      {/* Main Card - Compactée pour éviter le scroll */}
      <div className="w-full max-w-[400px] z-10 px-4">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg shadow-slate-900/10 p-8">
          {/* Header Compact */}
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div
              className="w-14 h-14 bg-sky-600 rounded-2xl 
        flex items-center justify-center 
        text-white font-black text-2xl 
        shadow-lg shadow-sky-600/30 mb-3"
            >
              M
            </div>

            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              MariaSaas
            </h1>

            <p className="text-slate-500 text-xs font-medium">Gestion de Pharmacie</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in-95">
              <svg
                className="w-4 h-4 text-red-500 flex-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p className="text-xs text-red-600 font-medium flex-1 leading-tight">{error}</p>
              <button
                onClick={() => dispatch(clearAuthError())}
                className="text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1 uppercase tracking-wide">
                Email
              </label>
              <div className="relative group">
                <input
                  {...register('email')}
                  type="email"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-sm text-slate-900 dark:text-white font-medium ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-sky-500'}`}
                  placeholder="nom@pharmacie.com"
                />
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input avec Toggle */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Mot de passe
                </label>
              </div>
              <div className="relative group">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-sm text-slate-900 dark:text-white font-medium ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-sky-500'}`}
                  placeholder="••••••••"
                />
                {/* Icone Cadenas Gauche */}
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>

                {/* Bouton Toggle Oeil Droite */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none p-1"
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password.message}</p>
              )}
            </div>

            {/* Checkbox Remember Me */}
            <div className="flex items-center gap-2 ml-1">
              <input
                {...register('rememberMe')}
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer select-none"
              >
                Se souvenir de moi
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black rounded-xl transition-all shadow-lg shadow-sky-600/20 active:scale-[0.98] flex items-center justify-center gap-2 text-sm mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Connexion</span>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 font-bold tracking-widest">
              MariaSaaS v1.0 • Développé par Tacite WK
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
