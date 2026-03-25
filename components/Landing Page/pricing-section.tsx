import React from 'react'
import GridPattern from './grid-pattern';
import FloatingElements from './floating-elements';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import AnimatedCard from './animated-card';
import { CardContent } from '../ui/card';
import { Check } from 'lucide-react';
import ShimmerButton from './shimmer-button';
import { useRouter } from 'next/navigation';

const PricingSection = () => {

    const router = useRouter();

    const annualPlans = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for trying out the platform.",
            features: [
            "1 chatbot",
            "10 queries/month",
            "Upload up to 5MB",
            "Basic customization",
            "Community support",
            ],
            cta: "Get Started",
        },
        {
            name: "Basic",
            price: "$24",
            description: "Great for small businesses and startups.",
            features: [
            "3 chatbots",
            "5,000 queries/month",
            "Upload up to 500 pages",
            "Custom branding",
            "Email support",
            ],
            cta: "Start Free Trial",
        },
        {
            name: "Pro",
            price: "$39",
            description: "Perfect for growing businesses.",
            features: [
            "5 chatbots",
            "10,000 queries/month",
            "Upload up to 1,000 pages",
            "Custom branding",
            "Priority support",
            ],
            cta: "Start Free Trial",
            popular: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For organizations with advanced needs.",
            features: [
            "Unlimited chatbots",
            "Unlimited queries",
            "Unlimited document uploads",
            "Priority support",
            "Custom integrations",
            "Dedicated account manager",
            ],
            cta: "Contact Sales",
        },
        ];

    const monthlyPlans = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for trying out the platform.",
            features: [
            "1 chatbot",
            "10 queries/month",
            "Upload up to 5MB",
            "Basic customization",
            "Community support",
            ],
            cta: "Get Started",
        },
        {
            name: "Basic",
            price: "$29",
            description: "Great for small businesses and startups.",
            features: [
            "3 chatbots",
            "5,000 queries/month",
            "Upload up to 500 pages",
            "Custom branding",
            "Email support",
            ],
            cta: "Start Free Trial",
        },
        {
            name: "Pro",
            price: "$49",
            description: "Perfect for growing businesses.",
            features: [
            "5 chatbots",
            "10,000 queries/month",
            "Upload up to 1,000 pages",
            "Custom branding",
            "Priority support",
            ],
            cta: "Start Free Trial",
            popular: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For organizations with advanced needs.",
            features: [
            "Unlimited chatbots",
            "Unlimited queries",
            "Unlimited document uploads",
            "Priority support",
            "Custom integrations",
            "Dedicated account manager",
            ],
            cta: "Contact Sales",
        },
        ];

    const handleLogin = () => {
        router.push("/auth");
        };

  return (
    <section
          id="pricing"
          className="w-full py-20 md:py-32 relative overflow-hidden"
        >
          <GridPattern className="opacity-20" />
          <FloatingElements />

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Choose the plan that's right for your business. All plans
                include a 14-day free trial.
              </p>
            </motion.div>

            <div className="mx-auto max-w-5xl">
              <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList className="rounded-full p-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                    <TabsTrigger value="monthly" className="rounded-full px-6">
                      Monthly
                    </TabsTrigger>
                    <TabsTrigger value="annually" className="rounded-full px-6">
                      Annually (Save 20%)
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="monthly">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {monthlyPlans.map((plan, i) => (
                      <AnimatedCard key={i} delay={i * 0.1}>
                        <div
                          className={`relative overflow-hidden h-full ${
                            plan.popular
                              ? "border-purple-600 shadow-lg shadow-purple-500/20"
                              : "border-border/40 shadow-md"
                          } bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all duration-300 group-hover:shadow-xl ${
                            plan.popular
                              ? "group-hover:shadow-purple-500/20"
                              : ""
                          }`}
                        >
                          {plan.popular && (
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 text-xs font-medium rounded-bl-lg shadow-sm">
                              Most Popular
                            </div>
                          )}
                          <CardContent className="p-6 flex flex-col h-full">
                            <h3 className="text-2xl font-bold group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                              {plan.name}
                            </h3>
                            <div className="flex items-baseline mt-4">
                              <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {plan.price}
                              </span>
                              {plan.price !== "Custom" && (
                                <span className="text-muted-foreground ml-1">
                                  /month
                                </span>
                              )}
                            </div>
                            <p className="text-muted-foreground mt-2">
                              {plan.description}
                            </p>
                            <ul className="space-y-3 my-6 flex-grow">
                              {plan.features.map((feature, j) => (
                                <li key={j} className="flex items-center">
                                  <Check className="mr-2 size-4 text-purple-600" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <ShimmerButton
                              onClick={handleLogin}
                              className={`w-full mt-auto rounded-full ${
                                plan.popular
                                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25"
                                  : "bg-muted hover:bg-muted/80"
                              } transition-transform duration-300 group-hover:scale-105`}
                              variant={plan.popular ? "default" : "outline"}
                            >
                              {plan.cta}
                            </ShimmerButton>
                          </CardContent>
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="annually">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {annualPlans.map((plan, i) => (
                      <AnimatedCard key={i} delay={i * 0.1}>
                        <div
                          className={`relative overflow-hidden h-full ${
                            plan.popular
                              ? "border-purple-600 shadow-lg shadow-purple-500/20"
                              : "border-border/40 shadow-md"
                          } bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all duration-300 group-hover:shadow-xl ${
                            plan.popular
                              ? "group-hover:shadow-purple-500/20"
                              : ""
                          }`}
                        >
                          {plan.popular && (
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 text-xs font-medium rounded-bl-lg shadow-sm">
                              Most Popular
                            </div>
                          )}
                          <CardContent className="p-6 flex flex-col h-full">
                            <h3 className="text-2xl font-bold group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                              {plan.name}
                            </h3>
                            <div className="flex items-baseline mt-4">
                              <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {plan.price}
                              </span>
                              {plan.price !== "Custom" &&
                                plan.price !== "$0" && (
                                  <span className="text-muted-foreground ml-1">
                                    /month
                                  </span>
                                )}
                            </div>
                            <p className="text-muted-foreground mt-2">
                              {plan.description}
                            </p>
                            <ul className="space-y-3 my-6 flex-grow">
                              {plan.features.map((feature, j) => (
                                <li key={j} className="flex items-center">
                                  <Check className="mr-2 size-4 text-purple-600" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <ShimmerButton
                              onClick={handleLogin}
                              className={`w-full mt-auto rounded-full ${
                                plan.popular
                                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25"
                                  : "bg-muted hover:bg-muted/80"
                              } transition-transform duration-300 group-hover:scale-105`}
                              variant={plan.popular ? "default" : "outline"}
                            >
                              {plan.cta}
                            </ShimmerButton>
                          </CardContent>
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
  )
}

export default PricingSection
