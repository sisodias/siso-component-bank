"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { useTheme } from "next-themes";

export function PricingSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const plans = {
    fullstack: [
      {
        title: "Full stack product development",
        price: "$20,000",
        button: "Let's launch",
        gradient: false,
        features: [
          "End-to-end product development",
          "User-friendly front-end",
          "Robust back-end",
          "Fast turnaround with agile delivery",
          "Ongoing support during launch",
          "Built with scalability in mind",
        ],
      },
      {
        title: "Monthly retainer",
        price: "$8,000",
        button: "Talk to us",
        gradient: true,
        features: [
          "Access to a full team: design, dev, and strategy",
          "Continuous iterations and feature updates",
          "Product strategy & business goals",
          "Monthly check-ins and async reporting",
          "Priority support and flexible scope",
          "Faster time to market and smoother execution",
        ],
      },
    ],
    datasci: [
      {
        title: "Data Science Consulting",
        price: "$15,000",
        button: "Start Analysis",
        gradient: false,
        features: [
          "End-to-end data strategy",
          "Predictive modeling and ML pipelines",
          "Data visualization and insights",
          "Data preprocessing and cleaning",
          "Model validation and deployment",
          "Performance tracking dashboards",
        ],
      },
      {
        title: "Monthly Retainer",
        price: "$7,000",
        button: "Talk to us",
        gradient: true,
        features: [
          "Ongoing ML optimization and monitoring",
          "Continuous experimentation & iteration",
          "Feature engineering and scaling",
          "Business intelligence reporting",
          "Priority analytics requests",
          "Quarterly performance reviews",
        ],
      },
    ],
    ai: [
      {
        title: "Custom AI Agent Development",
        price: "$25,000",
        button: "Build Agent",
        gradient: false,
        features: [
          "Conversational design and persona creation",
          "Integration with APIs and databases",
          "Training with custom datasets",
          "LLM selection and fine-tuning",
          "On-device or cloud deployment",
          "Monitoring and continuous improvement",
        ],
      },
      {
        title: "AI Integration Retainer",
        price: "$9,000",
        button: "Talk to us",
        gradient: true,
        features: [
          "Prompt engineering and optimization",
          "Ongoing performance tuning",
          "Multi-agent orchestration support",
          "API and backend maintenance",
          "Regular model updates",
          "Priority feature rollout and support",
        ],
      },
    ],
  };

  return (
    <section
      className={`w-full py-20 flex flex-col items-center transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="text-center max-w-2xl px-6">
        <h4 className="text-sm border-2 w-fit mx-auto rounded-3xl uppercase tracking-wide mb-2 px-2">
          Pricing
        </h4>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Built for impact. Priced for momentum.
        </h2>
        <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Product development, Data science, and AI agents — our pricing is
          designed to get you moving fast, without the guesswork.
        </p>
        <Button
          variant="secondary"
          className={`mb-10 ${isDark ? "bg-white text-black" : "bg-black text-white"}`}
        >
          Book a Strategy Call
        </Button>
      </div>

      <Tabs defaultValue="fullstack" className="w-2xl px-4">
        <TabsList
          className={`flex justify-center mb-10 w-fit mr-auto  rounded-lg border-2 ${
            isDark ? "bg-black border-gray-900" : "bg-gray-100 border-gray-300"
          }`}
        >
          <TabsTrigger value="fullstack">Full Stack Development</TabsTrigger>
          <TabsTrigger value="datasci">Data Science</TabsTrigger>
          <TabsTrigger value="ai">AI Agents</TabsTrigger>
        </TabsList>

        {Object.entries(plans).map(([key, planData]) => (
          <TabsContent key={key} value={key}>
            <div className="grid md:grid-cols-2 gap-10">
              {planData.map((plan, i) => (
                <div key={i}>
                  {/* Card with title, price, and button only */}
                  <Card
                    className={`p-1 rounded-2xl overflow-hidden transition-all duration-500 border-4 ${
                      plan.gradient
                        ? "bg-[linear-gradient(270deg,_#ff6600,_#ff00ff,_#6600ff)] bg-[length:400%_400%] animate-gradient text-white"
                        : isDark
                        ? "bg-black text-gray-100 border-gray-800"
                        : "bg-gray-50 text-gray-900 border border-gray-200"
                    }`}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-xl font-semibold mb-2">
                        {plan.title}
                      </CardTitle>
                      <p className="text-lg font-medium">
                        Starts at{" "}
                        <span className="text-2xl font-bold">{plan.price}</span>
                      </p>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Button
                        variant="secondary"
                        className={`w-full font-semibold cursor-pointer ${
                          isDark ? "bg-white text-black" : "bg-black text-white"
                        }`}
                      >
                        {plan.button}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Feature list outside the card */}
                  <ul className="mt-6 space-y-2 pl-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={16} className="mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
