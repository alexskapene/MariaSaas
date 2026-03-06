import React from 'react'

interface CategoryBadgeProps {
  category: string
  isActive?: boolean
}

// Palette originale avec les vrais noms
const categoryColors: Record<string, string> = {
  tous: 'bg-green-600 hover:bg-green-500 text-white border-none',
  antibiotique: 'bg-red-600 hover:bg-red-500 text-white border-none',
  analgesique: 'bg-blue-600 hover:bg-blue-500 text-white border-none',
  antiinflammation: 'bg-purple-500 hover:bg-purple-500 text-white border-none',
  vitamine: 'bg-green-600 hover:bg-green-500 text-white border-none',
  supplement: 'bg-teal-600 hover:bg-teal-500 text-white border-none',
  generique: 'bg-yellow-600 hover:bg-yellow-500 text-white border-none',
  autre: 'bg-slate-300 hover:bg-slate-400 text-slate-700 border-none'
}

// Fonction pour normaliser la catégorie
const normalizeCategory = (cat: string) => {
  return cat
    .toLowerCase() // minuscules
    .normalize('NFD') // séparer les accents
    .replace(/[\u0300-\u036f]/g, '') // supprimer les accents
    .replace(/[-\s]/g, '') // enlever tirets et espaces
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, isActive }) => {
  const key = normalizeCategory(category)
  const colorClass = categoryColors[key] || categoryColors['autre']

  return (
    <span
      className={`
        flex-none px-6 py-4 mb-2  rounded-xl
        text-[8px] font-black uppercase tracking-widest
        transition-all border
        ${isActive ? colorClass : 'border-slate-600 text-slate-400 bg-white dark:bg-slate-900'}
      `}
    >
      {category}
    </span>
  )
}

export default CategoryBadge
