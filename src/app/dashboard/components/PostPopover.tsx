"use client"
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs"
import {useRef, useState} from "react"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Autocomplete} from "@react-google-maps/api"
import {MdOutlineAddLocationAlt} from "react-icons/md"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import axios from "axios"

function PostPopover({post}: any) {
    const [inputValue, setInputValue] = useState("")
    const [latLong, setLatLong] = useState({lat: null, lng: null})
    const [open, setOpen] = useState(false)
    const autocompleteRef = useRef(null)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const postData = {
            post,
            location: latLong
        }
        console.log(postData)

        try {
            const response = await axios.post(`/api/posts?username=sh`, postData)
            console.log("Submission successful:", response.data)
        } catch (error) {
            console.error("Error submitting location:", error)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    onClick={(event) => {
                        event.preventDefault()
                        setOpen(true)
                    }}
                    className='absolute right-2 top-2 from-green-500 via-blue-900 to-pink-500 p-2 rounded-full text-black flex items-center justify-center'
                    style={{boxShadow: "0 0 8px #39FF14"}}
                >
                    <MdOutlineAddLocationAlt className='text-xl' />
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
                        const location = place.geometry?.location
                        setLatLong({
                            lat: location.lat(),
                            lng: location.lng()
                        })
                        console.log("Latitude:", location.lat(), "Longitude:", location.lng())
                    }}
                    fields={["geometry"]}
                >
                    <Input
                        type='text'
                        placeholder='Type to search...'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className='w-full h-8'
                        onClick={(e) => e.stopPropagation()} // This stops the click from propagating
                    />
                </Autocomplete>
                {/* <Input
                    type='text'
                    placeholder='Type to search...'
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value)
                    }}
                    className='w-full h-8'
                /> */}
                <Button onClick={() => setOpen(false)}>Save</Button>
            </PopoverContent>
        </Popover>
    )
}

export default PostPopover
