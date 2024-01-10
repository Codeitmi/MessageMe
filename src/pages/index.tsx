import { useState } from 'react';

interface FormData {
  phone: string;
  message: string;
}

interface FormErrors {
  phone: string;
  message: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({ phone: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({ phone: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const removeSpacesAndFormatPhone = (phone: string): string => {
    const phoneWithoutSpaces = phone.replace(/\s/g, '');
    return phoneWithoutSpaces.startsWith('+234') ? phoneWithoutSpaces : `+234${phoneWithoutSpaces}`;
  };

  const constructUrlString = () => {
    const { phone, message } = formData;
    const formattedPhone = removeSpacesAndFormatPhone(phone);

    if (!formattedPhone || !message.trim()) {
      return '';
    }

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
    return whatsappUrl;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {} as FormErrors;

    const formattedPhone = removeSpacesAndFormatPhone(formData.phone);
    setFormData((prevData) => ({ ...prevData, phone: formattedPhone }));

    if (!formattedPhone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).every(key => newErrors[key as keyof FormErrors] === '')) {
      const whatsappUrl = constructUrlString();

      if (whatsappUrl) {
        // Open the WhatsApp URL in a new tab
        const newTab = window.open(whatsappUrl, '_blank');

        // Wait for 2 seconds before opening the second tab
        setTimeout(() => {
          newTab && newTab.close();
          const secondTab = window.open(whatsappUrl, '_blank');
          // You might want to handle the case where the second tab couldn't be opened
        }, 5000);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        className="bg-gray-900 p-8 rounded shadow-md lg:w-2/6 w-100"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-400 mb-2">
            Phone:
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-900"
          />
          <span className="text-red-500">{errors.phone}</span>
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-400 mb-2">
            Message:
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full p-2 border rounded text-gray-900"
          />
          <span className="text-red-500">{errors.message}</span>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Open WhatsApp
          </button>
        </div>
      </form>
    </div>
  );
}
