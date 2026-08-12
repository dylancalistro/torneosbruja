export default function Tabs({ tabs, active, onChange, size = 'md' }) {
  const padding = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'

  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`${padding} font-medium border-b-2 -mb-px transition-colors ${
            active === tab.key
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
