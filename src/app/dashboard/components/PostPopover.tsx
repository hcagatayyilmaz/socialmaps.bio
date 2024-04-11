"use client"
import {useRef, useState} from "react"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Autocomplete} from "@react-google-maps/api"
import {MdOutlineAddLocationAlt} from "react-icons/md"

import {Input} from "@/components/ui/input"

function PostPopover({post}: any) {
  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState(false)
  const autocompleteRef = useRef(null)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={(event) => {
            event.preventDefault()
            setOpen(true)
          }}
          className='absolute right-2 top-2 bg-[#39FF14] p-2 rounded-full text-black flex items-center justify-center'
          style={{boxShadow: "0 0 8px #39FF14"}} // Adding neon glow effect
        >
          <MdOutlineAddLocationAlt className='text-xl' />{" "}
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete
          }}
          onPlaceChanged={() => {
            const place = autocompleteRef.current.getPlace()
            setInputValue(place.formatted_address || place.name)
          }}
          fields={["place_id", "geometry", "name", "formatted_address"]}
        >
          <Input
            type='text'
            placeholder='Type to search...'
            value={inputValue}
            onChange={(e) => {
              e.preventDefault()
              setInputValue(e.target.value)
            }}
            className='w-full h-8'
          />
        </Autocomplete>
      </PopoverContent>
    </Popover>
  )
}

export default PostPopover
