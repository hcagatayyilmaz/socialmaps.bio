import React from "react"

function Dashboard({posts}: any) {
  return (
    <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {posts && posts.data
        ? posts.data.map((post: any) => (
            <div key={post.id} className='relative'>
              <video src={post.media_url} className='w-full h-auto' controls />
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <svg
                  className='w-12 h-12 text-white opacity-75'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </div>
            </div>
          ))
        : "No posts found."}
    </div>
  )
}

export default Dashboard
