import React, { useState } from 'react';
import { useForm } from "react-hook-form";

const Post = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

  async function onSubmit(data) {
    if (isSubmitting || isCooldown) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("location", data.location);
      formData.append("status", data.status);
      formData.append("date_reported", data.date);

      const imageInput = document.querySelector('input[type="file"]');
      if (imageInput && imageInput.files.length > 0) {
        formData.append("image", imageInput.files[0]);
      }

      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to post item");
        setIsSubmitting(false);
        return;
      }

      alert("Form submitted successfully!");
      reset();

      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 15000);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex items-center justify-center'>
      <div className='bg-white/10 backdrop-blur-md w-96 rounded-2xl py-9 border-8 shadow-white border-white'>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center gap-6'>

          <input
            type="text"
            placeholder='Title'
            className='border border-white/65 p-3 rounded-xl placeholder:text-white focus:bg-white focus:text-black transition-all text-amber-50'
            {...register("title", {
              required: true,
              minLength: { value: 3, message: "min length atleast 3" },
            })}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}

          <input
            type="text"
            placeholder='Description'
            className='border border-white/65 p-3 rounded-xl placeholder:text-white focus:bg-white focus:text-black transition-all text-amber-50'
            {...register("description", {
              required: true,
              minLength: { value: 3, message: "min length atleast 3" },
            })}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}

          <input
            type="text"
            placeholder='Location'
            className='border border-white/65 p-3 rounded-xl placeholder:text-white focus:bg-white focus:text-black transition-all text-amber-50'
            {...register("location", {
              required: true,
              minLength: { value: 3, message: "min length atleast 3" },
            })}
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}

          <select
            className='border border-white/65 p-3 rounded-xl text-white bg-black/40'
            {...register("status", { required: true })}
          >
            <option value="">Select Status</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm mt-1">Status is required</p>}

          <input
            type="file"
            accept='image/*'
            className='border border-white/65 p-3 rounded-xl text-white cursor-pointer file:border file:border-white/65 file:bg-white/10 file:backdrop-blur-md file:p-2 file:rounded-md focus:bg-white focus:text-black transition-all focus:file:bg-black focus:file:text-white'
          />

          <input
            type="date"
            className='border border-white/65 p-3 rounded-xl placeholder:text-white focus:bg-white focus:text-black transition-all text-amber-50'
            {...register("date", {
              required: true,
              message: "Enter a valid Date",
            })}
          />

          <button
            type="submit"
            disabled={isSubmitting || isCooldown}
            className={`border border-white/65 p-3 rounded-xl text-white transition-all ease-in ${
              isSubmitting || isCooldown
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400/20 hover:bg-yellow-400 hover:text-gray-800"
            }`}
          >
            {isSubmitting ? "Submitting..." : isCooldown ? "Wait 15s..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
