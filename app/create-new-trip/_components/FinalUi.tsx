import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe2 } from 'lucide-react';

function FinalUi({ viewTrip, disable }: any) {
    return (
        <div className="flex flex-col items-center justify-center mt-6 p-6 bg-white rounded-lg">
            <Globe2 className="text-ocean text-4xl animate-bounce" />
            <h2 className="mt-3 text-lg font-semibold text-transparent bg-clip-text bg-linear-to-r from-deep to-ocean">
                ✈️ Planning your dream trip...
            </h2>
            <p className="text-gray-500 text-sm text-center mt-1">
                Gathering best destinations, activities, and travel details for you.
            </p>
            <Button disabled={disable} onClick={viewTrip} className='mt-2 w-full bg-linear-to-r from-deep to-ocean hover:from-deep/90 hover:to-ocean/90 text-white'>
                View Trip
            </Button>
            {/* <div className="w-48 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
                <div className="h-2 bg-ocean animate-pulse w-3/4"></div>
            </div> */}
        </div>
    )
}

export default FinalUi 