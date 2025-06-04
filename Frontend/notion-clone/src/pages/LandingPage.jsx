import { Link } from "react-router-dom";
import {
  FiCheck,
  FiChevronRight,
  FiCode,
  FiLayers,
  FiLock,
  FiUsers,
  FiZap,
} from "react-icons/fi";

// Color constants
const colors = {
  primary: "#5d7d2e",
  secondary: "#1976D2",
  background: "#FAFAFA",
  card: "#FFFFFF",
  textPrimary: "#1A1A1A",
  textMuted: "#6B7280",
  border: "#E5E7EB",
};

const features = [
  {
    icon: <FiLayers className="w-6 h-6 text-white-600" />,
    title: "Block-Based Editing",
    description:
      "Create rich documents with our intuitive block-based editor. Each piece of content is a block that you can easily move and style.",
  },
  {
    icon: <FiUsers className="w-6 h-6 text-white-600" />,
    title: "Real-time Collaboration",
    description:
      "Work together with your team in real-time. See changes as they happen and communicate seamlessly.",
  },
  {
    icon: <FiCode className="w-6 h-6 text-white-600" />,
    title: "Code Blocks",
    description:
      "Write and format code with syntax highlighting. Perfect for developers and technical writers.",
  },
  {
    icon: <FiLock className="w-6 h-6 text-white-600" />,
    title: "End-to-End Encryption",
    description:
      "Your data is secure with our enterprise-grade encryption. We prioritize your privacy and security.",
  },
];

const steps = [
  "Create an account and sign in",
  "Create your first workspace",
  "Start creating pages and blocks",
  "Invite team members to collaborate",
];

const faqs = [
  {
    question: "Is there a free plan?",
    answer:
      "Yes, we offer a free plan with basic features. You can upgrade anytime.",
  },
  {
    question: "How secure is my data?",
    answer:
      "We use end-to-end encryption and follow industry best practices to keep your data safe.",
  },
  {
    question: "Can I use it offline?",
    answer:
      "Yes, you can create and edit documents offline. Changes will sync when you're back online.",
  },
  {
    question: "How do I invite team members?",
    answer:
      'Go to your workspace settings and click on "Invite Members" to add people via email.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-gray-900">
                  Notion Clone
                </span>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </a>
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md text-white font-medium transition-colors bg-blue-600 hover:bg-blue-700"
                style={{}}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">The all-in-one</span>
            <span className="block text-blue-600">workspace for your team</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Write, plan, and get organized. Notion Clone is the connected
            workspace where better, faster work happens.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="#features"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to work together
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything your team needs to stay in sync, all in one place.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    {feature.icon}
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              How it works
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Get started in minutes
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-4 md:gap-x-8 md:gap-y-10">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <p className="ml-4 text-lg leading-6 font-medium text-gray-900">
                      {step}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-0 right-0 h-full w-6 -mr-8 mt-5">
                      <FiChevronRight className="h-full w-full text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Start your free trial today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Join thousands of teams who are already using Notion Clone to be
            more productive.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="lg:max-w-2xl lg:mx-auto text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-gray-500">
              Can't find the answer you're looking for? Reach out to our{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                customer support
              </a>{" "}
              team.
            </p>
          </div>
          <div className="mt-20">
            <dl className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-10">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <dt className="font-medium text-gray-900">{faq.question}</dt>
                  <dd className="mt-3 text-gray-500">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: colors.card,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav
            className="-mx-5 -my-2 flex flex-wrap justify-center"
            aria-label="Footer"
          >
            {[
              "About",
              "Blog",
              "Jobs",
              "Press",
              "Accessibility",
              "Partners",
            ].map((item) => (
              <div key={item} className="px-5 py-2">
                <a
                  href="#"
                  className="text-base transition-colors hover:underline"
                  style={{
                    color: colors.textMuted,
                    ":hover": { color: colors.textPrimary },
                  }}
                >
                  {item}
                </a>
              </div>
            ))}
          </nav>
          <p
            className="mt-8 text-center text-base"
            style={{ color: colors.textMuted, opacity: 0.7 }}
          >
            &copy; {new Date().getFullYear()} Notion Clone. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
