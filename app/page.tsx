'use client';

import { Navbar } from "@/components/Navbar";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";
import { format, fromUnixTime, parseISO } from "date-fns";

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

async function getWeatherData({ place }: { place: string }) {
  if (!place) {
    throw new Error('place is null or undefined');
  }
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}
export default async function Home() {
  const [place, setPlace] = useAtom<string>(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  const data = await getWeatherData({ place });

  const firstData = data?.list[0];

  // console.log("error", error);

  console.log("data", data);

  // const uniqueDates = [
  //   ...new Set(
  //     data?.list.map(
  //       (entry: Date) => new Date(entry.dt * 1000).toISOString().split("T")[0]
  //     )
  //   )
  // ];

  // // Filtering data to get the first entry after 6 AM for each unique date
  // const firstDataForEachDate = uniqueDates.map((date) => {
  //   return data?.list.find((entry : Date) => {
  //     const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
  //     const entryTime = new Date(entry.dt * 1000).getHours();
  //     return entryDate === date && entryTime >= 6;
  //   });
  // });

  console.log(data, "data");
  return (
    <div className="flex min-h-screen flex-col gap-4  bg-gray-100">
      <Navbar />

      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9  w-full  pb-10 pt-4 ">
        {
          loadingCity ? <WeatherSkeleton /> : (
            <>
              <section className="space-y-4 ">
                <div className="space-y-2">
                  <h2 className="flex gap-1 text-2xl  items-end ">
                    <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
                    <p className="text-lg">
                      ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
                    </p>
                  </h2>
                </div>
              </section>
            </>
          )
        }
      </main>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <section className="space-y-8 ">
      {/* Today's data skeleton */}
      <div className="space-y-2 animate-pulse">
        {/* Date skeleton */}
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* Time wise temperature skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 days forecast skeleton */}
      <div className="flex flex-col gap-4 animate-pulse">
        <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>

        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}