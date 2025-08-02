import React, { useState } from 'react';
import MapIcon from '../assets/location.png';
import pic from '../assets/pic.jpg';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Card = ({ title, location, url, description, id }) => {
  const [submit, setSubmit] = useState(true);

  const handleClaim = async () => {
    setSubmit(false);

    const cooldownKey = `claimed_${id}`;
    const lastClaim = localStorage.getItem(cooldownKey);
    const now = Date.now();
    const cooldownPeriod = 2 * 24 * 60 * 60 * 1000;

    if (lastClaim && now - parseInt(lastClaim) < cooldownPeriod) {
      toast.warn('Claim email already sent. Try again after 2 days.', {
        position: 'top-center',
      });
      setSubmit(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sendClaimMail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      const { owner_email, claimer_email } = data;

      if (owner_email === claimer_email) {
        toast.error('Owner and claimer cannot be same', {
          position: 'top-center',
        });
        setSubmit(true);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      localStorage.setItem(cooldownKey, now.toString());

      toast.success('Email sent successfully!', {
        position: 'top-center',
      });
    } catch (err) {
      toast.error('Failed to send claim email', {
        position: 'top-center',
      });
    }

    setSubmit(true);
  };

  return (
    <div className="relative group w-fit">
      <div className="h-100 p-6" id="cards">
        <div
          className="bg-white/30 backdrop-blur p-4 flex flex-col items-center rounded-2xl gap-3 transition-all ease-in-out relative w-[240px] min-h-[310px] group-hover:min-h-[390px]"
          id="card"
        >
          {/* Image */}
          <div className="w-55 h-60 relative overflow-hidden">
            <img
              src={url || pic}
              alt={title}
              className="w-55 h-60 rounded-2xl object-cover transition-all duration-200 ease-in-out"
            />
          </div>

          {/* Description - shown on hover */}
          <div className="w-full text-center max-w-[220px] min-h-[0px] max-h-[0px] overflow-hidden opacity-0 group-hover:min-h-[40px] group-hover:max-h-[80px] group-hover:opacity-100 transition-all duration-300 ease-in-out">
            <p className="text-amber-200 font-medium">{description}</p>
          </div>

          {/* Info + Button */}
          <div className="flex gap-4 items-center justify-between w-full">
            {/* Title & Location */}
            <div className="flex flex-col gap-2.5">
              <h2 className="text-xl font-semibold text-amber-200">{title}</h2>
              <p className="font-medium text-green-400 flex gap-2 items-center">
                <img src={MapIcon} className="h-7.5 bg-amber-200 p-0.5 rounded-full" alt="location" />
                {location}
              </p>
            </div>

            {/* Claim Button */}
            <div className="translate-y-1">
              <div 
              onClick={handleClaim}
              className="cursor-pointer border-3 border-black bg-gray-500 pb-[10px] transition-all duration-200 select-none active:pb-0 active:mb-[10px] active:translate-y-[10px]">
                <div className="bg-[#dddddd] border-4 border-white px-2 py-1 active:bg-yellow-400">
                  <span className="text-[1.2em] tracking-wide">Claim</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
        limit={1}
      />
    </div >
  );
};

export default Card;
