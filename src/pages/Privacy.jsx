import React from 'react';

const Privacy = () => {
  return (
    <main className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-md my-12 text-gray-900 font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-teal-700">
        Privacy Policy
      </h1>

      <section className="mb-8">
        <p className="text-lg leading-relaxed">
          At CampSite Finder, your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b border-teal-300 pb-2">
          1. Information We Collect
        </h2>
        <p className="mb-4 leading-relaxed">
          We collect your name, email address, and phone number solely for the purpose of sending you campsite availability notifications and related updates.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b border-teal-300 pb-2">
          2. Use of Your Data
        </h2>
        <p className="mb-4 leading-relaxed">
          Your personal data is never sold or shared with third parties without your explicit consent. We use your information only to provide and improve our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b border-teal-300 pb-2">
          3. Your Rights
        </h2>
        <p className="leading-relaxed mb-2">
          You have the right to request deletion or correction of your personal data at any time by contacting us.
        </p>
        <p className="leading-relaxed text-sm text-gray-600">
          We will respond promptly to your requests in accordance with applicable data protection laws.
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

export default Privacy;
