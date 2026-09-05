"use client"

import { CheckIcon, XIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"
import { cn } from "../_utils/cn"

const items = [
  {
    feature: "TypeScript Support",
    description:
      "Shows whether a language or framework has first-class or partial support for TypeScript or strong typing features.",
    languages: [
      { name: "JavaScript", supported: true, version: "ES6+" },
      { name: "Python", supported: false, version: "No" },
      { name: "Java", supported: true, version: "11+" },
      { name: "Go", supported: false, version: "No" },
      { name: "Rust", supported: true, version: "Stable" },
    ],
    frameworks: [
      { name: "React", supported: true, version: "16.8+" },
      { name: "Angular", supported: true, version: "10+" },
      { name: "Vue", supported: true, version: "3+" },
      { name: "Spring Boot", supported: false, version: "No" },
      { name: "Django", supported: false, version: "No" },
    ],
  },
  {
    feature: "AI/ML Libraries",
    description:
      "Highlights the availability of machine learning and AI ecosystems within each technology.",
    languages: [
      { name: "JavaScript", supported: true, version: "TensorFlow.js" },
      { name: "Python", supported: true, version: "PyTorch / TensorFlow" },
      { name: "Java", supported: false, version: "No" },
      { name: "Go", supported: false, version: "No" },
      { name: "Rust", supported: false, version: "No" },
    ],
    frameworks: [
      { name: "React", supported: false, version: "No" },
      { name: "Angular", supported: false, version: "No" },
      { name: "Vue", supported: false, version: "No" },
      { name: "Spring Boot", supported: true, version: "Deep Java Lib" },
      { name: "Django", supported: true, version: "scikit-learn" },
    ],
  },
  {
    feature: "Cross-Platform Deployment",
    description:
      "Indicates if the language or framework can be used across multiple platforms such as web, desktop, and mobile.",
    languages: [
      { name: "JavaScript", supported: true, version: "Web / Node.js" },
      { name: "Python", supported: true, version: "Web / CLI" },
      { name: "Java", supported: true, version: "Android / Desktop" },
      { name: "Go", supported: true, version: "CLI / Servers" },
      { name: "Rust", supported: true, version: "CLI / Embedded" },
    ],
    frameworks: [
      { name: "React", supported: true, version: "React Native" },
      { name: "Angular", supported: false, version: "Web only" },
      { name: "Vue", supported: true, version: "Quasar / NativeScript" },
      { name: "Spring Boot", supported: true, version: "Server only" },
      { name: "Django", supported: false, version: "Web only" },
    ],
  },
  {
    feature: "Performance & Speed",
    description:
      "Evaluates execution performance, runtime efficiency, and responsiveness in production workloads.",
    languages: [
      { name: "JavaScript", supported: true, version: "High (JIT)" },
      { name: "Python", supported: false, version: "Low (Interpreted)" },
      { name: "Java", supported: true, version: "High (JVM Optimized)" },
      { name: "Go", supported: true, version: "Very High" },
      { name: "Rust", supported: true, version: "Native Performance" },
    ],
    frameworks: [
      { name: "React", supported: true, version: "Efficient with VDOM" },
      { name: "Angular", supported: true, version: "Moderate" },
      { name: "Vue", supported: true, version: "Lightweight" },
      { name: "Spring Boot", supported: true, version: "Optimized JVM" },
      { name: "Django", supported: false, version: "Slower (Python)" },
    ],
  },
  {
    feature: "Community & Ecosystem",
    description:
      "Shows whether the technology has an active community, ecosystem, and frequent library updates.",
    languages: [
      { name: "JavaScript", supported: true, version: "Massive NPM ecosystem" },
      { name: "Python", supported: true, version: "PyPI ecosystem" },
      { name: "Java", supported: true, version: "Maven/Gradle ecosystem" },
      { name: "Go", supported: true, version: "Growing modules" },
      { name: "Rust", supported: true, version: "Crates.io ecosystem" },
    ],
    frameworks: [
      { name: "React", supported: true, version: "Huge community" },
      { name: "Angular", supported: true, version: "Strong enterprise support" },
      { name: "Vue", supported: true, version: "Active OSS community" },
      { name: "Spring Boot", supported: true, version: "Enterprise adoption" },
      { name: "Django", supported: true, version: "Large OSS community" },
    ],
  },
  {
    feature: "Learning Curve",
    description:
      "Assesses how beginner-friendly or complex the language/framework is for new developers.",
    languages: [
      { name: "JavaScript", supported: true, version: "Beginner-friendly" },
      { name: "Python", supported: true, version: "Easiest to learn" },
      { name: "Java", supported: false, version: "Steep curve" },
      { name: "Go", supported: true, version: "Simple syntax" },
      { name: "Rust", supported: false, version: "Challenging ownership model" },
    ],
    frameworks: [
      { name: "React", supported: true, version: "Moderate learning curve" },
      { name: "Angular", supported: false, version: "Steep curve" },
      { name: "Vue", supported: true, version: "Easy to learn" },
      { name: "Spring Boot", supported: false, version: "Complex setup" },
      { name: "Django", supported: true, version: "Easy with conventions" },
    ],
  },
  {
    feature: "Security Features",
    description:
      "Measures built-in security mechanisms and ease of implementing secure applications.",
    languages: [
      { name: "JavaScript", supported: true, version: "Moderate (depends on libs)" },
      { name: "Python", supported: true, version: "Libraries available" },
      { name: "Java", supported: true, version: "Strong JVM security" },
      { name: "Go", supported: true, version: "Memory safety" },
      { name: "Rust", supported: true, version: "Strict memory safety" },
    ],
    frameworks: [
      { name: "React", supported: false, version: "No built-in security" },
      { name: "Angular", supported: true, version: "XSS/CSRF protections" },
      { name: "Vue", supported: true, version: "Built-in sanitization" },
      { name: "Spring Boot", supported: true, version: "Spring Security" },
      { name: "Django", supported: true, version: "Strong security defaults" },
    ],
  },
]

export default function Component() {
  return (
    <Table className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden max-w-6xl mx-auto">
      <TableHeader className="border border-gray-200 dark:border-gray-800">
        <TableRow className="border border-gray-200 dark:border-gray-800">
          <TableHead className="w-40">Capability</TableHead>
          <TableHead colSpan={5} className="text-center bg-muted/40">
            Languages
          </TableHead>
          <TableHead colSpan={5} className="text-center bg-muted/40">
            Frameworks
          </TableHead>
        </TableRow>
        <TableRow className="border border-gray-200 dark:border-gray-800">
          <TableHead></TableHead>
          {items[0].languages.map((lang) => (
            <TableHead key={lang.name} className="text-xs text-center">
              {lang.name}
            </TableHead>
          ))}
          {items[0].frameworks.map((fw) => (
            <TableHead key={fw.name} className="text-xs text-center">
              {fw.name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="border border-gray-200 dark:border-gray-800">
        {items.map((item, i) => (
          <TableRow
            key={item.feature}
            className={cn(
              "hover:bg-muted/20 *:border-r border-t border-gray-200 dark:border-gray-800",
              i % 2 === 0 && "bg-muted/10"
            )}
          >
            <TableCell className="font-semibold border-l-4 border-gray-200 dark:border-gray-800">
              {item.feature}
            </TableCell>
            {[...item.languages, ...item.frameworks].map((tech, idx) => (
              <TableCell key={idx} className="text-center py-3 border border-gray-200 dark:border-gray-800">
                {tech.supported ? (
                  <CheckIcon className="mx-auto mb-1 stroke-emerald-600" size={18} />
                ) : (
                  <XIcon className="mx-auto mb-1 stroke-red-600" size={18} />
                )}
                <div className="text-xs text-muted-foreground">{tech.version}</div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
