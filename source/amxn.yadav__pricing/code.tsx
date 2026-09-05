"use client";

export default function Component() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">
        Simple, Transparent Pricing
      </h1>
      <p className="text-xl text-center mb-12 text-muted-foreground">
        Choose the perfect package for your project needs
      </p>

      {/* Main Pricing Cards - 4 in a row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {/* Starter Website */}
        <div className="rounded-lg bg-white dark:bg-gray-900 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col">
          <h3 className="text-xl font-bold">Starter Website</h3>
          <div className="text-2xl font-bold mt-3 mb-2">$129</div>
          <p className="text-[10px] text-muted-foreground mb-2">₹11,450 • £98 • €111 • SR484</p>
          <p className="text-xs text-muted-foreground mb-4">For individuals & startups</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground mb-4 flex-1">
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>5-page website</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Modern UI</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Basic SEO</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Responsive design</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Source code</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>2 revisions</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>7-10 days</span></li>
          </ul>
          <a href="/contact?service=Landing%20%26%20Business%20Websites&package=Starter%20Website&price=129">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-full ring-offset-white transition-colors shadow-sm h-[44px] px-6 w-full bg-black text-white hover:bg-green-500 hover:text-black border-2 border-black font-bold text-sm">
              Get Started
            </button>
          </a>
        </div>

        {/* Business Pro */}
        <div className="rounded-lg bg-white dark:bg-gray-900 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col">
          <h3 className="text-xl font-bold">Business Pro</h3>
          <div className="text-2xl font-bold mt-3 mb-2">$249</div>
          <p className="text-[10px] text-muted-foreground mb-2">₹22,100 • £189 • €214 • SR934</p>
          <p className="text-xs text-muted-foreground mb-4">For growing businesses</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground mb-4 flex-1">
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Up to 12 pages</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Custom UI design</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Advanced SEO</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Admin dashboard</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Form integrations</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Source + comments</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>3 revisions</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>10-15 days</span></li>
          </ul>
          <a href="/contact?service=Full-Stack%20Web%20Development&package=Business%20Pro&price=249">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-full ring-offset-white transition-colors shadow-sm h-[44px] px-6 w-full bg-black text-white hover:bg-green-500 hover:text-black border-2 border-black font-bold text-sm">
              Get Started
            </button>
          </a>
        </div>

        {/* Full Stack App */}
        <div className="rounded-lg bg-white dark:bg-gray-900 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col relative">
          <div className="absolute top-2 right-2 bg-green-500 px-2 py-0.5 text-[10px] font-bold border-2 border-black">
            POPULAR
          </div>
          <h3 className="text-xl font-bold">Full Stack App</h3>
          <div className="text-2xl font-bold mt-3 mb-2">$349</div>
          <p className="text-[10px] text-muted-foreground mb-2">₹30,980 • £266 • €300 • SR1,309</p>
          <p className="text-xs text-muted-foreground mb-4">SaaS-level applications</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground mb-4 flex-1">
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Unlimited pages</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Full authentication</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Payment gateway</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Backend + database</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Admin + analytics</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>REST API</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>5 revisions</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>15-20 days</span></li>
          </ul>
          <a href="/contact?service=Full-Stack%20Web%20Development&package=Full%20Stack%20App&price=349">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-full ring-offset-white transition-colors shadow-sm h-[44px] px-6 w-full bg-green-500 hover:bg-black text-black hover:text-white border-2 border-black font-bold text-sm">
              Get Started
            </button>
          </a>
        </div>

        {/* Enterprise */}
        <div className="rounded-lg bg-white dark:bg-gray-900 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col">
          <h3 className="text-xl font-bold">Enterprise</h3>
          <div className="text-2xl font-bold mt-3 mb-2">$999+</div>
          <p className="text-[10px] text-muted-foreground mb-2">₹88,600+ • £759+ • €860+ • SR3,746+</p>
          <p className="text-xs text-muted-foreground mb-4">Large-scale projects</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground mb-4 flex-1">
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>All Premium features</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Microservices</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Advanced integrations</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Team features</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>CI/CD pipeline</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Priority support</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>Unlimited revisions</span></li>
            <li className="flex items-start"><span className="mr-2 mt-0.5">✦</span><span>30+ days</span></li>
          </ul>
          <a href="/contact?service=Custom%20Project&package=Enterprise&price=999">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-full ring-offset-white transition-colors shadow-sm h-[44px] px-6 w-full bg-black text-white hover:bg-green-500 hover:text-black border-2 border-black font-bold text-sm">
              Contact Me
            </button>
          </a>
        </div>
      </div>

      {/* Add-ons Bar */}
      <div className="mb-12">
        <div className="bg-white dark:bg-gray-900 py-6 px-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
            <span className="font-bold text-black dark:text-white">Add-ons:</span>
            <span className="px-3 py-1.5 bg-black text-white border-2 border-black font-medium hover:bg-green-500 hover:text-black transition-all cursor-default">Fast delivery: $20-$50</span>
            <span className="px-3 py-1.5 bg-black text-white border-2 border-black font-medium hover:bg-green-500 hover:text-black transition-all cursor-default">Extra page: $10</span>
            <span className="px-3 py-1.5 bg-black text-white border-2 border-black font-medium hover:bg-green-500 hover:text-black transition-all cursor-default">Content upload: $25</span>
            <span className="px-3 py-1.5 bg-black text-white border-2 border-black font-medium hover:bg-green-500 hover:text-black transition-all cursor-default">Extra revision: $10</span>
            <span className="px-3 py-1.5 bg-black text-white border-2 border-black font-medium hover:bg-green-500 hover:text-black transition-all cursor-default">Code comments: $30</span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Not sure which package to choose?</h2>
        <p className="text-muted-foreground mb-8">
          Let's discuss your requirements and find the perfect solution
        </p>
        <a href="/contact">
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-base ring-offset-white transition-colors shadow-sm h-[44px] bg-black text-white hover:bg-green-500 hover:text-black border-2 border-black font-bold px-8">
            Contact Me
          </button>
        </a>
      </div>
    </div>
  );
}