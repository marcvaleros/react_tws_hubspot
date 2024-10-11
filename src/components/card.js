import React from 'react'

export default function Card({props}) {
  return (
  <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-hs-dark-gray dark:border-gray-700 ">
      <div>
          <img className="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
      </div>
      <div className="p-5">
          <div>
              <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">{props.owner}</h5>
              <h1 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{props.name}</h1>
          </div>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{props.hubspot_api_key}</p>
          <p className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-hs-blue rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-hs-blue dark:hover:bg-hs-dark-blue dark:focus:ring-blue-800">
              Assign SDR 
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
          </p>
      </div>
  </div>
  )
}
