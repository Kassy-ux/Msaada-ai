import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
          Free legal first-response
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Something happened.
          <br />
          <span className="text-emerald-700">Not sure what to do next?</span>
        </h1>

        <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto">
          Msaada helps you understand your legal options and connects you to the
          right help — in plain language, backed by verified Kenyan legal sources.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/get-help"
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-sm"
          >
            Get Help Now
          </Link>
          <Link
            href="/#how-it-works"
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            How Msaada Works
          </Link>
        </div>

        <div id="how-it-works" className="grid sm:grid-cols-3 gap-6 text-left mt-8">
          <StepCard
            number="1"
            title="Tell us what happened"
            description="Describe your situation in your own words — no legal jargon needed."
          />
          <StepCard
            number="2"
            title="Understand your options"
            description="Get a plain-language explanation backed by verified legal sources."
          />
          <StepCard
            number="3"
            title="Find the right help"
            description="Connect with verified legal aid providers near you."
          />
        </div>
      </div>
    </main>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-semibold mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
