
import * as React from 'react';
import { MdMyLocation, MdOutlineLocationOn, MdWbSunny } from 'react-icons/md';
import SearchBox from './SearchBox';
import { loadingCityAtom, placeAtom } from "@/app/atom";
import { useAtom } from "jotai";
import getWeatherData from '@/utils/getWeatherData';

type Props = {
    location: string
}

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
export function Navbar({ location }: Props) {
    const [city, setCity] = React.useState("")
    const [error, setError] = React.useState(null)

    // 
    const [place, setPlace] = useAtom(placeAtom)
    const [_, setLoadingCity] = useAtom(loadingCityAtom)

    const handleCurrentLocation = () => {
        // console.log("place", place);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    setLoadingCity(true)

                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
                    );
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();

                    setTimeout(() => {
                        setLoadingCity(false)
                        setPlace(data.city.name)
                    }, 500)

                } catch (error) {
                    setLoadingCity(false)
                }
            }
            );
        }
    };

    return (
        <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white'>
            <div className='h-[80px]     w-full    flex   justify-between items-center  max-w-7xl px-3 mx-auto'>
                <div className='flex items-center justify-center gap-2'>
                    <h2 className="text-gray-500 text-3xl">Weather</h2>
                    <MdWbSunny className='text-3xl mt-1 text-yellow-500' />
                </div>
                <section className="flex items-center gap-2 ">
                    <MdMyLocation
                        title='Your current location'
                        onClick={() => {
                            handleCurrentLocation();
                        }}
                        className='text-3xl text-gray-500 hover:opacity-80 cursor-pointer' />
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
