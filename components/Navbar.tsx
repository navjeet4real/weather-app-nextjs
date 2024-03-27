/** @format */

import * as React from 'react';
import { MdMyLocation, MdOutlineLocationOn, MdWbSunny } from 'react-icons/md';
import { SearchBox } from './SearchBox';

type Props  = {
}

export function Navbar ({}: Props) {
  return (
    <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white'>
        <div className='h-[80px]     w-full    flex   justify-between items-center  max-w-7xl px-3 mx-auto'>
            <p className='flex items-center justify-center gap-2'>
                <h2 className="text-gray-500 text-3xl">Weather</h2>
                <MdWbSunny className='text-3xl mt-1 text-yellow-500' />

            </p>
                <section className="flex items-center gap-2 ">
                    <MdMyLocation className='text-3xl text-gray-500 hover:opacity-80 cursor-pointer' />
                    <MdOutlineLocationOn className='text-3xl ' />
                    <p className='text-slate-900/80 text-sm'>
                        India
                    </p>
                    <div>
                        {/* search box */}
                        <SearchBox />
                    </div>
                </section>
        </div>
        {/* Navbar */}
    </nav>
  );
}
