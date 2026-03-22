import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { companies, faqs } from "@/data/const";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Building2, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <div>
      <section className="flex items-center justify-center  pt-16 sm:pt-12 pb-8 sm:pb-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold text-4xl sm:text-6xl lg:text-8xl text-white tracking-tighter py-4 text-center">
            <span className="leading-tight">Find Your Dream Job</span>
            <span className="flex items-center justify-center gap-2 sm:gap-6 mt-2 sm:mt-0 flex-wrap">
              <span>and get</span>
              <img
                src="/logo.png"
                className="h-12 sm:h-20 md:h-24 lg:h-32 object-contain"
                alt="Hirrd Logo"
              />
            </span>
          </h1>

          <p className="mt-4 sm:mt-8 text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
            Explore thousands of job listings or find the perfect candidate
          </p>

          <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full mx-auto px-4 sm:px-0 max-w-sm sm:max-w-none">
            <Link className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-6 sm:py-8 text-base sm:text-lg font-semibold cursor-pointer bg-blue-600 hover:-translate-y-2 hover:scale-105 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)]"
              >
                Find Jobs
              </Button>
            </Link>
            <Link className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-6 sm:py-8 text-base sm:text-lg font-semibold text-white cursor-pointer bg-red-700 hover:-translate-y-2 hover:scale-105 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(239,68,68,0.3)]"
              >
                Post a job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden pb-10 sm:pb-16 pt-10 sm:pt-20">
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
            }),
          ]}
          className="w-full"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <CarouselContent className="flex items-center">
            {[...companies, ...companies].map((company, index) => (
              <CarouselItem
                key={index}
                className="basis-auto pl-12 sm:pl-16 md:pl-20"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-all duration-300"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <section className="pb-12 sm:pb-16 w-full px-2 sm:px-0">
        <img
          src="/banner.jpeg"
          alt="Hirrd Banner"
          className="w-full rounded-xl sm:rounded-2xl object-cover shadow-2xl border border-gray-800 h-48 sm:h-auto"
        />
      </section>

      <section className="pb-12 sm:pb-16 w-full grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
        <Card className="group relative overflow-hidden bg-white/5 border-white/10 hover:bg-white/10 hover:-translate-y-2 hover:scale-105 hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] transition-all duration-500 backdrop-blur-sm cursor-pointer">
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl w-fit group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-500">
                <Search className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-blue-400 transition-all duration-500" />
            </div>
            <CardTitle className="text-white text-2xl font-bold tracking-tight">
              For Job Seekers
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 text-gray-400 text-base leading-relaxed mt-2">
            Search and apply for jobs, track applications, and more. Join
            thousands of professionals finding their dream career path.
          </CardContent>
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </Card>

        <Card className="group relative overflow-hidden bg-white/5 border-white/10 hover:bg-white/10 hover:-translate-y-2 hover:scale-105 hover:border-red-500/50 hover:shadow-[0_8px_30px_rgb(239,68,68,0.12)] transition-all duration-500 backdrop-blur-sm cursor-pointer">
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl w-fit group-hover:bg-red-500/20 group-hover:scale-110 transition-all duration-500">
                <Building2 className="w-6 h-6 text-red-500 group-hover:text-red-400" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-red-400 transition-all duration-500" />
            </div>
            <CardTitle className="text-white text-2xl font-bold tracking-tight">
              For Employers
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 text-gray-400 text-base leading-relaxed mt-2">
            Post jobs, manage applications, and find the best candidates.
            Streamline your hiring process with our powerful tools.
          </CardContent>
          <div className="absolute inset-0 bg-linear-to-br from-red-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </Card>
      </section>

      <section className="pb-20 w-full">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-white/10 rounded-xl px-6 bg-white/5 backdrop-blur-sm data-[state=open]:bg-white/10 data-[state=open]:border-white/20 transition-all duration-300 shadow-sm"
            >
              <AccordionTrigger className="text-gray-200 hover:text-white text-left font-semibold py-4 hover:no-underline text-base sm:text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm sm:text-base pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
};

export default HeroSection;
