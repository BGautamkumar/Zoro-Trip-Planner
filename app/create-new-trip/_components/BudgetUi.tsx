"use client"
import React, { useState } from 'react'

export const SelectBudgetOptions = [
    {
        id: 1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon: '💰',
        color: 'bg-green-100 text-green-600'
    },
    {
        id: 2,
        title: 'Moderate',
        desc: 'Keep cost on the average side',
        icon: '💸',
        color: 'bg-yellow-100 text-yellow-600'
    },
    {
        id: 3,
        title: 'Luxury',
        desc: "Don't worry about cost",
        icon: '🛳️',
        color: 'bg-purple-100 text-purple-600'
    },
]

function BudgetUi ({onSelectedOption}:any)  {
    const [selectedOption, setSelectedOption] = useState<typeof SelectBudgetOptions[0] | null>(null);

    const handleOptionClick = (option: typeof SelectBudgetOptions[0]) => {
        // Update temporary selection - allows reselection
        setSelectedOption(option);
    };

    const handleConfirm = () => {
        if (selectedOption) {
            // Only commit after confirmation
            onSelectedOption(selectedOption.title + ":" + selectedOption.desc);
        }
    };

    return (
        <div className='flex flex-col mt-1'>
            <div className='grid grid-cols-3 md:grid-cols-3 gap-2 items-center'>
                {SelectBudgetOptions.map((item, index) => (
                    <div
                        key={index}
                        className={`p-3 border rounded-2xl cursor-pointer flex flex-col items-center text-center transition-colors ${
                            selectedOption?.id === item.id 
                                ? 'border-primary bg-primary/10' 
                                : 'bg-black hover:border-primary'
                        }`}
                        onClick={() => handleOptionClick(item)}
                    >
                        <div className={`text-3xl p-3 rounded-full ${item.color}`}>{item.icon}</div>
                        <h2 className='text-lg font-semibold mt-2'>{item.title}</h2>
                        <p className='text-sm text-gray-500'>{item.desc}</p>
                    </div>
                ))}
            </div>
            
            {selectedOption && (
                <div className='mt-4 flex justify-center'>
                    <button
                        className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors'
                        onClick={handleConfirm}
                    >
                        Confirm {selectedOption.title} Budget
                    </button>
                </div>
            )}
        </div>
    )
}

export default BudgetUi