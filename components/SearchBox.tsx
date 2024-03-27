import * as React from 'react';
import { IoSearch } from 'react-icons/io5';
type Props = {

}
export function SearchBox(props: Props) {
    return (
        <form className='flex relative items-center justify-center h-10'>
            <input
                type="text" 
                placeholder='Search for a city'
                className='w-full h-full bg-transparent 
                border border-gray-400 text-slate-900/80 
                text-sm placeholder:text-slate-900/40
                rounded-1-md px-4 py-2
                focus:border-blue-500 focus:outline-none'    
            />
            <button >
                <IoSearch />
            </button>
        </form>
    );
}
