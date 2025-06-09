import React from 'react';

const Terms = () => {
  return (
    <main className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-md my-12 text-gray-900 font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-teal-700">
        Terms and Conditions
      </h1>

      <section className="mb-8">
        <p className="text-lg leading-relaxed">
          Welcome to CampSite Finder. By accessing or using our service, you agree to comply with and be bound by the following terms and conditions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b border-teal-300 pb-2">
          1. Use of Service
        </h2>
        <p className="mb-4 leading-relaxed">
          You agree to use CampSite Finder lawfully and responsibly. Any misuse or unauthorized activity is strictly prohibited.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b border-teal-300 pb-2">
          2. Changes to Services
        </h2>
        <p className="mb-4 leading-relaxed">
          We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b border-teal-300 pb-2">
          3. Data Usage
        </h2>
        <p className="mb-4 leading-relaxed">
          Your information, including contact details, may be used to notify you about campsite availability and related updates.
        </p>
        <p className="leading-relaxed text-sm text-gray-600">
          We take your privacy seriously and do not share your data with third parties without your consent.
        </p>
      </section>

      <section className="text-center mt-12">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} CampSite Finder. All rights reserved.
        </p>
      </section>
    </main>
  );
};

export default Terms;
