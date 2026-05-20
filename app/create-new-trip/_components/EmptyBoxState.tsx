import { suggestions } from '@/app/_components/Hero'
import React from 'react'
import { Sparkles } from 'lucide-react'

const EmptyBoxState = ({onSelectOption}:any) => {
    return (
        <div className='h-full flex flex-col justify-center p-6 max-w-2xl mx-auto'>
            <div className='flex-1 flex flex-col justify-center'>
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-deep to-ocean flex items-center justify-center mb-5 shadow-lg shadow-ocean/20">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h2 className='font-bold text-2xl md:text-3xl text-deep dark:text-white'>
                        Start Planning Your{' '}
                        <span className='text-transparent bg-clip-text bg-linear-to-r from-deep to-ocean'>Trip</span>
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-3 max-w-md mx-auto leading-relaxed'>
                        Tell Zoro where you dream of going — from a quick weekend to a month-long odyssey.
                    </p>
                </div>

                {/* Suggestion cards */}
                <div className='flex flex-col gap-3'>
                    {suggestions.map((suggestion, index) => (
                        <button key={index}
                        onClick={()=>onSelectOption(suggestion.title)}
                        className='group flex items-center gap-4 rounded-xl p-4 cursor-pointer bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:border-ocean/30 hover:shadow-lg hover:shadow-ocean/5 transition-all duration-300 hover:-translate-y-0.5 text-left'>
                            <div className='shrink-0 w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-ocean/10 transition-colors'>
                                {suggestion.icon}
                            </div>
                            <h2 className='text-base font-medium text-deep dark:text-white group-hover:text-ocean transition-colors'>{suggestion.title}</h2>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EmptyBoxState