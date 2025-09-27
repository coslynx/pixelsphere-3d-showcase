import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Bounded } from '../../components/ui/Bounded';
import { ThreeScene } from '../../components/3d/ThreeScene';
import { useTheme } from '../../context/ThemeContext';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  message: yup.string().required('Message is required'),
}).required();

interface ContactProps {
  className?: string;
}

const Contact: React.FC<ContactProps> = ({ className }) => {
  const { isDarkMode } = useTheme();
  const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmitForm = useCallback(async (data: FormData) => {
    console.log('Form data:', data);

    try {
      // Simulate a successful form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmissionMessage('Your message has been sent!');
      setSubmissionError(null);
      reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setSubmissionError(message);
      setSubmissionMessage(null);
    }
  }, [reset]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      const timeoutId = setTimeout(() => {
        setSubmissionMessage(null);
        setSubmissionError(null);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [isSubmitSuccessful]);

  const sceneConfig = {
    lightsConfig: {
      ambientIntensity: 0.5,
      directionalIntensity: 0.5,
      directionalPosition: [0, 5, 10],
    },
    cameraConfig: {
      fov: 45,
      near: 0.1,
      far: 100,
      position: [0, 2, 5],
    },
  };

  return (
    <section className={`relative py-12 ${className}`} data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="absolute inset-0">
        <ThreeScene width="100%" height="100%" sceneConfig={sceneConfig} />
      </div>
      <Bounded className="relative z-10">
        <SectionHeading title="Contact Us" />
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="name"
                {...register('name')}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="mt-1">
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <div className="mt-1">
              <textarea
                id="message"
                rows={4}
                {...register('message')}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.message ? 'border-red-500' : ''}`}
              />
              {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              <PaperAirplaneIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Send Message
            </button>
          </div>
          {submissionMessage && <p className="mt-4 text-green-600">{submissionMessage}</p>}
          {submissionError && <p className="mt-4 text-red-600">{submissionError}</p>}
        </form>
      </Bounded>
    </section>
  );
};

export default Contact;