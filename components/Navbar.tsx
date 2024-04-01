"use client"

import * as React from 'react';
import { MdMyLocation, MdOutlineLocationOn, MdWbSunny } from 'react-icons/md';
import SearchBox from './SearchBox';
import { loadingCityAtom, placeAtom } from "@/app/atom";
import { useAtom } from "jotai";

type Props = {
    location: string
}

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
export function Navbar({ location }: Props) {
    const [city, setCity] = React.useState("")
    const [error, setError] = React.useState("")

    // 
    const [suggestions, setSuggestions] = React.useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [place, setPlace] = useAtom(placeAtom)
    const [_, setLoadingCity] = useAtom(loadingCityAtom)

    async function handleInputChang(value: string) {
        console.log("handleInputChang", value)
        setCity(value);
        if (value.length >= 3) {
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log( "data", data)
    
            const suggestions = data?.list.map((item: any) => item.name);
            console.log("suggestions", suggestions);
            setSuggestions(suggestions);
            setError("");
            setShowSuggestions(true);
          } catch (error) {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }

    function handleSuggestionClick(value: string) {
        setCity(value);
        setShowSuggestions(false);
    }

    function handleSubmiSearch(e: React.FormEvent<HTMLFormElement>) {
        console.log("handleSubmiSearch clicked",)
        setLoadingCity(true);
        e.preventDefault();
        if (suggestions.length == 0) {
          setError("Location not found");
          setLoadingCity(false);
        } else {
          setError("");
          setTimeout(() => {
            setLoadingCity(false);
            setPlace(city);
            setShowSuggestions(false);
          }, 500);
        }
      }

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
        <>
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
                            <SearchBox
                                value={city}
                                onSubmit={handleSubmiSearch}
                                onChange={(e) => handleInputChang(e.target.value)}
                            />
                        </div>
                    </section>
                </div>
                {/* Navbar */}
            </nav>
            <section className="flex   max-w-7xl px-3 md:hidden ">
                <div className="relative ">
                    {/* SearchBox */}

                    <SearchBox
                        value={city}
                     onSubmit={handleSubmiSearch}
                     onChange={(e) => handleInputChang(e.target.value)}  
                    />
                    <SuggetionBox
                        {...{
                            showSuggestions,
                            suggestions,
                            handleSuggestionClick,
                            error
                        }}
                    />
                </div>
            </section>
        </>
    );
}

function SuggetionBox({
    showSuggestions,
    suggestions,
    handleSuggestionClick,
    error
}: {
    showSuggestions: boolean;
    suggestions: string[];
    handleSuggestionClick: (item: string) => void;
    error: string;
}) {

    console.log(showSuggestions,"suggetionBox", suggestions)
    return (
        <>
            {((showSuggestions && suggestions.length > 1) || error) && (
                
                <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px]  flex flex-col gap-1 py-2 px-2">
                    {error && suggestions.length < 1 && (
                        <li className="text-red-500 p-1 "> {error}</li>
                    )}
                    {suggestions.map((item, i) => (
                        <li
                            key={i}
                            onClick={() => handleSuggestionClick(item)}
                            className="cursor-pointer p-1 rounded   hover:bg-gray-200"
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
