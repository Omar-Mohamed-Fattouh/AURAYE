import React from 'react'

export default function Team() {
  return (
    <section className="max-w-6xl mx-auto p-4 md:p-8 pt-10 text-center">
  <h2 className="text-slate-900 text-[28px] font-bold leading-tight tracking-[-0.015em] text-center pb-3">
    Our Team
  </h2>
  <p className="text-slate-600 text-base font-normal leading-normal max-w-3xl mx-auto text-center pb-12">
    We are a dedicated team focused on delivering the best customer experience with personalized support and expert advice.
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    <div className="flex flex-col items-center text-center">
      <div
        className="w-32 h-32 rounded-full bg-cover bg-center mb-4"
        data-alt="Professional headshot of Jane Doe"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDIqaum-8DCmySWKswz2qfGdsm3HtpSCFaGgql9BSWovuMlOTcesXbMJjRQdDZlar4XC79-64E2WO1IcsEqGCsmiyxI4WxoaMTKlQuzWrpTxAo9nmt0H2aXUfEEbu1OHE0Oav9JgVk1S02VvPUsGuB12LwBAqDsDlv5j5p0WSJmefpfzrEpUzgR4ULQzew9HtfaKCm4ZGyfbdqcgVjrY4dWSQ3LJbAc1_6azDdFi3SIYr2830aeS6aIx6x4bjR0fJ7rba4Xqp929IJJ")'
        }}
      />
      <h4 className="text-slate-900 text-lg font-bold">Jane Doe</h4>
      <p className="text-primary text-sm">Chief Executive Officer</p>
    </div>
    <div className="flex flex-col items-center text-center">
      <div
        className="w-32 h-32 rounded-full bg-cover bg-center mb-4"
        data-alt="Professional headshot of John Smith"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD54arZEIn-iqXO6jZlKLm1LLHHO2I9i0l5v_wqT9UVGAyUMSXG4dir1bL7GlvNamf8jRTzshiFC_gu22OF3JZtF3xM8V3Ja1EWB-3nzgVBQ0PT4C0RztveTy4qIwFd01AtlajOxXEAVz3GZWW5E1guEjnSsvJWJWe-QERYjIQ65g1NihWkTaz7h0fuESUYw4uEwYZ_KaD4dLn93mgB38rkLC-AQuDVb8GNtda9ctCNS4-dxxeA2WUF7LmajBUz4ZFH5hLcp_yn5twa")'
        }}
      />
      <h4 className="text-slate-900 text-lg font-bold">John Smith</h4>
      <p className="text-primary text-sm">Lead Engineer</p>
    </div>
    <div className="flex flex-col items-center text-center">
      <div
        className="w-32 h-32 rounded-full bg-cover bg-center mb-4"
        data-alt="Professional headshot of Emily White"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC0clhyfarfx-eupq4BYZhg-3Xu7uMv6c10ffpvKCr8Cv-CCSzd4uyIRUUe7dCVYx41mho8fMjR8cTTmjy5y5rYN-3U0GXu-dhTZs2mKnIFms6z0hqlocZf7G7lzGkGMZJRcaf-IstBa38UaMqHZwiIBfhCZ-FapHHWiP4cn170xwxyQUsnzrpeFttc2mjlsKw8qjyQtqToWoL0SH5KJM_a0cRE_46hVQsU4Lw7HpSIZ880LiM9CaEB3G8Ib4mXjG3TuZjTHZbTcpeQ")'
        }}
      />
      <h4 className="text-slate-900 text-lg font-bold">Emily White</h4>
      <p className="text-primary text-sm">Head of Design</p>
    </div>
    <div className="flex flex-col items-center text-center">
      <div
        className="w-32 h-32 rounded-full bg-cover bg-center mb-4"
        data-alt="Professional headshot of Michael Brown"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCTLnTZlD3e6DCarrEYp0w1CEQMblFL8voZ2y5Sf3l5kaNx_hqVQA_-pw63Pas3eTqEWaAOOI_3yFDFRprJjnCZVAkc8mNu4N3y9EV_ZK4k2NQ8lmaApfB7pH0zrXoSJdRUBj342IY38HcQMTnkDTKg1zgwKEVEBHEyuuy1t4lXdGSMDV36Jjmzg2ZKYJlqB945RZrBcFDkS1m08Gh9xAWnVddCeuOHWpmfrLvFtHbLZwuaVuCUiWQHd98fjs1Ff_sGHe1YsFXlVuse")'
        }}
      />
      <h4 className="text-slate-900 text-lg font-bold">Michael Brown</h4>
      <p className="text-primary text-sm">Chief Technology Officer</p>
    </div>
  </div>
</section>

  )
}
