"use client"
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { User, Heart, Home, Users } from 'lucide-react'

export const SelectTravelesList = [
    {
        id: 'solo',
        title: 'Solo',
        desc: 'Just me',
        icon: <User className="w-5 h-5" />,
        people: '1',
        gradient: 'from-violet-500 to-purple-600',
    },
    {
        id: 'couple',
        title: 'Couple',
        desc: '2 People',
        icon: <Heart className="w-5 h-5" />,
        people: '2 People',
        gradient: 'from-rose-500 to-pink-600',
    },
    {
        id: 'family',
        title: 'Family',
        desc: '3 to 5 People',
        icon: <Home className="w-5 h-5" />,
        people: '3 to 5 People',
        gradient: 'from-emerald-500 to-teal-600',
    },
    {
        id: 'group',
        title: 'Large Group',
        desc: '6+ People',
        icon: <Users className="w-5 h-5" />,
        people: '6+ People',
        gradient: 'from-amber-500 to-orange-600',
    },
]

function GroupSizeUi({ onSelectedOption, compact = false }: any) {
    const [selectedOption, setSelectedOption] = useState<typeof SelectTravelesList[0] | null>(null);

    const handleOptionClick = (option: typeof SelectTravelesList[0]) => {
        setSelectedOption(option);
        onSelectedOption(option.title + ":" + option.people);
    };

    return (
        <div className={compact ? 'space-y-2' : 'space-y-4'}>
            {!compact && (
                <div className="text-center">
                    <h3 className="text-lg font-bold text-deep dark:text-white">
                        How many people are in your group?
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        This helps us recommend suitable activities and accommodations.
                    </p>
                </div>
            )}

            <div className={`grid ${compact ? 'grid-cols-4 gap-2' : 'grid-cols-2 sm:grid-cols-4 gap-3'}`}>
                {SelectTravelesList.map((mode) => {
                    const isSelected = selectedOption?.id === mode.id;
                    return (
                        <motion.button
                            key={mode.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleOptionClick(mode)}
                            className={`relative flex flex-col items-center ${compact ? 'p-2.5' : 'p-4'} rounded-xl border-2 transition-all duration-300 ${
                                isSelected
                                    ? 'border-ocean bg-ocean/5 dark:bg-ocean/10 shadow-lg shadow-ocean/15'
                                    : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md'
                            }`}
                        >
                            {/* Selected indicator */}
                            {isSelected && (
                                <motion.div
                                    layoutId="groupsize-indicator"
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-ocean rounded-full flex items-center justify-center shadow-md"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                >
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.div>
                            )}

                            {/* Icon */}
                            <div className={`${compact ? 'w-8 h-8' : 'w-11 h-11'} rounded-xl bg-gradient-to-br ${mode.gradient} flex items-center justify-center text-white shadow-sm ${
                                isSelected ? 'shadow-md' : ''
                            }`}>
                                {mode.icon}
                            </div>

                            {/* Label */}
                            <span className={`${compact ? 'text-[10px] mt-1' : 'text-xs mt-2'} font-semibold ${
                                isSelected ? 'text-ocean' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                                {mode.title}
                            </span>

                            {/* Subtitle */}
                            {!compact && (
                                <span className="text-[10px] text-gray-400 mt-0.5 text-center leading-tight">
                                    {mode.desc}
                                </span>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

export default GroupSizeUi;