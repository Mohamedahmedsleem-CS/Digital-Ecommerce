import React from 'react'

function Hero() {
  return (
    <section className="bg-white lg:grid lg:h-screen ">
  <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
    <div className="mx-auto max-w-prose text-center">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
        All Your Digital Products
        <strong className="text-primary"> Is One Click Away </strong>
        
      </h1>

      <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
        Start your journey with us today and get access to all your digital products in one place.
      </p>

      <div className="mt-8 flex  justify-center gap-4 sm:mt-6">
        <a
          className="block rounded  bg-teal-600 px-12 py-3 font-medium text-white shadow-md transition-colors hover:bg-primary focus:outline-none focus:ring focus:ring-primary active:bg-red-500"
          href="/#"
        >
          Get Started
        </a>

        <a
          className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
          href="#"
        >
          Learn More
        </a>
      </div>
    </div>
  </div>
</section> 
  )
}

export default Hero