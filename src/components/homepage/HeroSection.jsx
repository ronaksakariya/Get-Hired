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
            <Link to="/jobs" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-6 sm:py-8 text-base sm:text-lg font-semibold cursor-pointer bg-blue-600"
              >
                Find Jobs
              </Button>
            </Link>
            <Link to="/post-job" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-6 sm:py-8 text-base sm:text-lg font-semibold text-white cursor-pointer bg-red-700"
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

      <section className="pb-12 sm:pb-16 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-0">
        <Card className="bg-gray-900 border border-gray-800 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg sm:text-xl font-bold">
              For Job Seekers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-400 text-sm leading-relaxed">
            Search and apply for jobs, track applications, and more.
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border border-gray-800 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg sm:text-xl font-bold">
              For Employers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-400 text-sm leading-relaxed">
            Post jobs, manage applications, and find the best candidates.
          </CardContent>
        </Card>
      </section>

      <section className="pb-20 w-full">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-800 rounded-lg px-4 bg-gray-900 data-[state=open]:border-blue-500 transition-colors duration-200"
            >
              <AccordionTrigger className="text-white hover:text-blue-400 text-left font-medium py-4 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm pb-4 leading-relaxed">
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
