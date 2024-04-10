// Ensure to use "use client" to specify this component is intended to run on the client side.
"use client"

import React, {useState, useRef} from "react"
import {Button} from "./ui/button"
import axios from "axios"
import {BsPinMap} from "react-icons/bs"

export default function Post({post, user}) {
  const [location, setLocation] = useState("")
  const autocompleteRef = useRef(null)
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  console.log(post)

  const handlePlaceSelected = (place) => {
    // Assuming the place object has a property named formatted_address
    setLocation(place.formatted_address || "")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!location) {
      alert("Please select a location.")
      return
    }

    try {
      const response = await axios.post("/api/location", {
        postId: post.id,
        location: location
      })

      // Handle response
      console.log(response.data)
      alert("Location added successfully!")
    } catch (error) {
      console.error("Error adding location:", error)
      alert("Failed to add location")
    }
  }

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAddButtonClick = () => {
    // Your logic for what happens when the button is clicked
    console.log("Add button clicked")
  }

  return (
    <div>
      <div
        key={post.id}
        className='relative w-full flex flex-col items-center border border-gray-200 rounded-lg p-4 '
      >
        {post.media_type === "VIDEO" ? (
          <div onClick={handleVideoClick} className='w-full relative'>
            <video
              ref={videoRef}
              src={post.media_url}
              className='w-full h-auto cursor-pointer'
              loop
              poster={post.thumbnail_url}
            >
              Your browser does not support the video tag.
            </video>
            {!isPlaying && (
              <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center cursor-pointer'>
                {/* Example play button overlay */}
              </div>
            )}
            {/* Add Button */}
            <button
              className='absolute right-2 top-2 bg-[#39FF14] p-2 rounded-full text-black flex items-center justify-center'
              onClick={handleAddButtonClick}
              style={{boxShadow: "0 0 8px #39FF14"}} // Adding neon glow effect
            >
              <BsPinMap className='text-xl' /> {/* Adjust size as needed */}
            </button>
          </div>
        ) : post.media_type === "IMAGE" ? (
          <div className='w-full relative'>
            <img
              src={post.media_url}
              className='w-full h-auto'
              alt={post.description}
            />
            {/* Add Button */}
            <button
              className='absolute right-2 top-2 bg-[#39FF14] p-2 rounded-full text-black flex items-center justify-center'
              onClick={handleAddButtonClick}
            >
              <BsPinMap className='text-xl' /> {/* Adjust size as needed */}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
