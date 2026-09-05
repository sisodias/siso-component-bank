"use client";
import { motion } from "framer-motion";
import { UserPlus, FileText, Briefcase, Award } from "lucide-react";

type Step = {
  icon: any;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    icon: UserPlus,
    title: "1. Create Your Profile",
    description:
      "Sign up as a client or freelancer and build a profile that showcases your skills or project needs.",
  },
  {
    icon: FileText,
    title: "2. Post or Find a Job",
    description:
      "Clients can post detailed job descriptions, while freelancers can browse and apply for opportunities that match their expertise.",
  },
  {
    icon: Briefcase,
    title: "3. Collaborate Securely",
    description:
      "Use our platform to communicate, share files, and track progress. Our system ensures that payments are secure.",
  },
  {
    icon: Award,
    title: "4. Achieve Your Goals",
    description:
      "Complete your project successfully, get paid, and build your reputation on the platform with reviews and ratings.",
  },
];

export default function Component1() {
  return (
    <div className="w-full bg-black py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-neutral-400 max-w-3xl mx-auto">
            A simple, streamlined process to connect and collaborate.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="animate-border-ray"
            >
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 h-full flex flex-col justify-start items-start space-y-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <step.icon size={24} className="text-white/80" />
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-sm text-neutral-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}