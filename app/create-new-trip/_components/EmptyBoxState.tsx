import React from 'react'
import { Sparkles, MapPin, Globe, Compass, Sunrise } from 'lucide-react'

interface EmptyBoxStateProps {
    onSelectOption: (option: string) => void;
}

const quickStarts = [
    {
        title: "5 days exploring Tokyo",
        subtitle: "Culture, food & nightlife",
        icon: <Globe className="w-4 h-4" />,
        gradient: "from-rose-500 to-pink-600"
    },
    {
        title: "Weekend getaway to Paris",
        subtitle: "Romance & art",
        icon: <Sunrise className="w-4 h-4" />,
        gradient: "from-violet-500 to-purple-600"
    },
    {
        title: "7 days backpacking Bali",
        subtitle: "Adventure & beaches",
        icon: <Compass className="w-4 h-4" />,
        gradient: "from-emerald-500 to-teal-600"
    },
    {
        title: "3 days in Dubai on luxury budget",
        subtitle: "Premium experiences",
        icon: <MapPin className="w-4 h-4" />,
        gradient: "from-amber-500 to-orange-600"
    },
]

const EmptyBoxState = ({ onSelectOption }: EmptyBoxStateProps) => {
    return (
        <div className='h-full flex flex-col justify-center p-6 max-w-2xl mx-auto'>
            <div className='flex-1 flex flex-col justify-center'>
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="relative w-16 h-16 mx-auto mb-5">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-deep to-ocean animate-pulse-glow" />
                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-deep to-ocean flex items-center justify-center shadow-lg shadow-ocean/20">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h2 className='font-bold text-2xl md:text-3xl text-deep dark:text-white'>
                        Where to{' '}
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-ocean to-deep'>next?</span>
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-3 max-w-md mx-auto leading-relaxed'>
                        Tell me your dream destination, budget, and how many days — I&apos;ll craft the perfect itinerary.
                    </p>
                </div>

                {/* Quick start cards */}
                <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 text-center">Popular trips</p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        {quickStarts.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => onSelectOption(item.title)}
                                className='group flex items-center gap-3 rounded-xl p-3.5 cursor-pointer bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:border-ocean/30 hover:shadow-lg hover:shadow-ocean/5 transition-all duration-300 hover:-translate-y-0.5 text-left'
                            >
                                <div className={`shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow`}>
                                    {item.icon}
                                </div>
                                <div className="min-w-0">
                                    <h3 className='text-sm font-medium text-deep dark:text-white group-hover:text-ocean transition-colors truncate'>
                                        {item.title}
                                    </h3>
                                    <p className="text-[11px] text-gray-400 mt-0.5">{item.subtitle}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmptyBoxState