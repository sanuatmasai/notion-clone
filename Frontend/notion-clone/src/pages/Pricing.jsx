import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiZap } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const Pricing = () => {
  const { t } = useTranslation();
  
  const features = [
    t('pricing.features.unlimitedPages', 'Unlimited pages and blocks'),
    t('pricing.features.collaboration', 'Team collaboration'),
    t('pricing.features.sharing', 'Sharing & permissions'),
    t('pricing.features.api', 'API access'),
    t('pricing.features.advancedSecurity', 'Advanced security & controls'),
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            {t('pricing.title', 'Simple, transparent pricing')}
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            {t('pricing.subtitle', 'Choose the perfect plan for your needs')}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('pricing.free.title', 'Free')}
                </h2>
                <span className="ml-4 px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                  {t('pricing.free.badge', 'For individuals')}
                </span>
              </div>
              <p className="mt-4 text-gray-500">
                {t('pricing.free.description', 'Basic features to get you started')}
              </p>
              <p className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">
                  $0
                </span>
                <span className="ml-1 text-lg font-medium text-gray-500">
                  /{t('pricing.month', 'month')}
                </span>
              </p>
              <Link
                to="/register"
                className="mt-8 block w-full bg-gray-800 border border-transparent rounded-md py-3 px-6 text-center font-medium text-white hover:bg-gray-900"
              >
                {t('pricing.getStarted', 'Get started')}
              </Link>
            </div>
            <div className="border-t border-gray-200 bg-gray-50 p-8">
              <h3 className="text-sm font-medium text-gray-900">
                {t('pricing.whatsIncluded', 'What\'s included')}
              </h3>
              <ul className="mt-6 space-y-4">
                {features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheck className="h-5 w-5 text-green-500" aria-hidden="true" />
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('pricing.pro.title', 'Pro')}
                </h2>
                <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                  <FiZap className="w-4 h-4 mr-1" />
                  {t('pricing.pro.badge', 'Popular')}
                </span>
              </div>
              <p className="mt-4 text-gray-500">
                {t('pricing.pro.description', 'For teams and professionals')}
              </p>
              <p className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">
                  $10
                </span>
                <span className="ml-1 text-lg font-medium text-gray-500">
                  /{t('pricing.month', 'month')}
                </span>
              </p>
              <Link
                to="/register"
                className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-3 px-6 text-center font-medium text-white hover:bg-blue-700"
              >
                {t('pricing.upgrade', 'Upgrade now')}
              </Link>
            </div>
            <div className="border-t border-gray-200 bg-gray-50 p-8">
              <h3 className="text-sm font-medium text-gray-900">
                {t('pricing.everythingInFree', 'Everything in Free, plus')}
              </h3>
              <ul className="mt-6 space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheck className="h-5 w-5 text-green-500" aria-hidden="true" />
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('pricing.enterprise.title', 'Enterprise')}
          </h2>
          <p className="mt-4 text-gray-500 max-w-3xl">
            {t('pricing.enterprise.description', 'Need more than 20 team members or enterprise features? Our Enterprise plan gives you additional controls, unlimited workspaces, and priority support.')}
          </p>
          <div className="mt-6">
            <Link
              to="/contact"
              className="text-base font-medium text-blue-600 hover:text-blue-500"
            >
              {t('pricing.contactSales', 'Contact sales')}
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-lg font-medium text-gray-900">
            {t('pricing.faq.title', 'Frequently asked questions')}
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              t('pricing.faq.freeTrial', 'Is there a free trial?'),
              t('pricing.faq.cancel', 'Can I cancel my subscription?'),
              t('pricing.faq.paymentMethods', 'What payment methods do you accept?'),
              t('pricing.faq.security', 'How secure is my data?'),
              t('pricing.faq.support', 'What support is available?'),
              t('pricing.faq.team', 'How do I add team members?'),
            ].map((question, index) => (
              <div key={index} className="text-left">
                <h4 className="font-medium text-gray-900">{question}</h4>
                <p className="mt-2 text-gray-500">
                  {t(`pricing.faq.answer${index + 1}`, 'Answer to the question will appear here.')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
