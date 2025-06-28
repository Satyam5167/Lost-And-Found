import React from 'react';
import MapIcon from '../assets/location.png'; 
import pic from '../assets/pic.jpg';

const Card = ({ title, location, url }) => {
  return (
    <div className="relative group w-fit">
      <div className="h-100 p-6" id="cards">
        <div className="bg-white/30 backdrop-blur p-4 w-70 flex flex-col items-center rounded-2xl gap-3 hover:scale-105 transition-all ease-in-out" id="card">
          <img src={url || pic} alt={title} className="w-55 h-60 rounded-2xl object-cover" />

          <div className="flex gap-4">
            <div className="flex flex-col gap-2.5">
              <h2 className="text-xl font-semibold text-amber-200">{title}</h2>
              <p className="font-medium text-green-400 flex gap-2">
                <img src={MapIcon} className="h-7.5 bg-amber-200 p-0.5 rounded-full" alt="location" />
                {location}
              </p>
            </div>

            <div>
              <div className="cursor-pointer border-3 border-black bg-gray-500 pb-[10px] transition-all duration-100 select-none active:pb-0 active:mb-[10px] active:translate-y-[10px]">
                <div className="bg-[#dddddd] border-4 border-white px-2 py-1 active:bg-yellow-400">
                  <span className="text-[1.2em] tracking-wide">Claim</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
