import { useCurrency } from '@renderer/hooks/useCurrently'
import { ProductDTO } from '@shared/types'

// On utilise strictement ProductDTO, comme l'exige Redux
interface Props {
  products: ProductDTO[]
  onAdd: (product: ProductDTO) => void
}

export function ProductGrid({ products, onAdd }: Props) {
  const { formatPrice } = useCurrency()

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => onAdd(p)}
            className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-xl hover:-translate-y-1 transition-all text-left group flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg width="60" height="60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l-5.5 9h11z" />
                <circle cx="12" cy="18" r="3" />
              </svg>
            </div>

            <div className="flex justify-between items-start w-full mb-3 relative z-10">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                {p.code}
              </span>
              <span className="bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 text-[10px] font-black px-2.5 py-1 rounded-lg">
                {p.currentStock} ut.
              </span>
            </div>

            <h3 className="font-bold text-slate-800 dark:text-white leading-tight mb-1 group-hover:text-sky-600 transition-colors line-clamp-2 text-base">
              {p.name}
            </h3>
            <p className="text-xs text-slate-400 mb-6 flex-1 font-medium">
              {p.dosage} • {p.category}
            </p>

            <div className="text-xl font-black text-slate-900 dark:text-white mt-auto">
              {formatPrice(p.sellPrice).value.toLocaleString()} {formatPrice(p.sellPrice).symbol}
              <span className="text-xs ml-1">{formatPrice(p.sellPrice).symbol}</span>
            </div>
          </button>
        ))}

        {products.length === 0 && (
          <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-400 animate-in fade-in">
            <svg
              className="w-16 h-16 mb-4 opacity-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="font-medium">Aucun produit trouvé</p>
          </div>
        )}
      </div>
    </div>
  )
}
