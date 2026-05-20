import React, { useState } from 'react'

export const SelectTravelesList = [
{
    id: 1,
    title: 'Just Me',
    desc: 'A solo traveler in exploration',
    icon: '✈️',
    people: '1'
},
{
    id: 2,
    title: 'A Couple',
    desc: 'Two travelers in tandem',
    icon: '🥂',
    people: '2 People'
},
{
    id: 3,
    title: 'Family',
    desc: 'A group of fun loving adventurers',
    icon: '🏡',
    people: '3 to 5 People'
},
{
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seekers',
    icon: '⛵',
    people: '5 to 10 People'
},
]

function GroupSizeUi ({onSelectedOption}:any) {
  const [selectedOption, setSelectedOption] = useState<typeof SelectTravelesList[0] | null>(null);

  const handleOptionClick = (option: typeof SelectTravelesList[0]) => {
    // Update temporary selection - allows reselection
    setSelectedOption(option);
  };

  const handleConfirm = () => {
    if (selectedOption) {
      // Only commit after confirmation
      onSelectedOption(selectedOption.title + ":" + selectedOption.people);
    }
  };

  return (
    <div className='flex flex-col mt-1'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-2 items-center'>
        {SelectTravelesList.map((item, index) => (
            <div 
            key={index} 
            className={`p-3 border rounded-2xl cursor-pointer transition-colors flex flex-col items-center text-center ${
              selectedOption?.id === item.id 
                ? 'border-primary bg-primary/10' 
                : 'bg-black hover:border-primary'
            }`}
            onClick={() => handleOptionClick(item)}
            >
                <h2 className='text-2xl mb-1'>{item.icon}</h2>
                <h2 className='text-sm font-medium'>{item.title}</h2>
                <p className='text-xs text-gray-500'>{item.people}</p>
            </div>
        ))}
      </div>
      
      {selectedOption && (
        <div className='mt-4 flex justify-center'>
          <button
            className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors'
            onClick={handleConfirm}
          >
            Confirm {selectedOption.title}
          </button>
        </div>
      )}
    </div>
  )
}

export default GroupSizeUi