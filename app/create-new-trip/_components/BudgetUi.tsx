"use client"
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { PiggyBank, Wallet, Gem } from 'lucide-react'

export const SelectBudgetOptions = [
    {
        id: 'budget',
        title: 'Budget',
        desc: 'Save money with affordable options',
        icon: <PiggyBank className="w-5 h-5" />,
        gradient: 'from-green-500 to-emerald-600',
    },
    {
        id: 'moderate',
        title: 'Moderate',
        desc: 'Best balance between comfort and price',
        icon: <Wallet className="w-5 h-5" />,
        gradient: 'from-blue-500 to-indigo-600',
    },
    {
        id: 'luxury',
        title: 'Luxury',
        desc: 'Premium experiences without compromises',
        icon: <Gem className="w-5 h-5" />,
        gradient: 'from-purple-500 to-violet-600',
    },
]

function BudgetUi({ onSelectedOption, compact = false }: any) {
    const [selectedOption, setSelectedOption] = useState<typeof SelectBudgetOptions[0] | null>(null);

    const handleOptionClick = (option: typeof SelectBudgetOptions[0]) => {
        setSelectedOption(option);
        onSelectedOption(option.title + ":" + option.desc);
    };

    return (
        <div className={compact ? 'space-y-2' : 'space-y-4'}>
            {!compact && (
                <div className="text-center">
                    <h3 className="text-lg font-bold text-deep dark:text-white">
                        What is your budget?
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        This helps us recommend hotels, restaurants, and activities within your budget.
                    </p>
                </div>
            )}

            <div className={`grid ${compact ? 'grid-cols-3 gap-2' : 'grid-cols-1 sm:grid-cols-3 gap-3'}`}>
                {SelectBudgetOptions.map((mode) => {
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
                                    layoutId="budget-indicator"
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

export default BudgetUi;