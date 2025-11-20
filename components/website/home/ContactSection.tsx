import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="relative min-h-screen bg-gray-900 py-20 lg:py-32">
      <div className="w-full px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-8 lg:gap-16">
          <div className="col-span-12 lg:col-span-5">
            <p className="text-primary text-sm uppercase tracking-widest mb-4">
              Get In Touch
            </p>
            <h2 className="text-fluid-4xl font-bold text-white leading-tight mb-6">
              Let{"'"}s Start a
              <br />
              Conversation
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-12">
              Have questions, suggestions, or want to get involved? We{"'"}re
              here to listen and connect with you.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm uppercase tracking-wide text-white/60 mb-3">
                  Email
                </h3>
                <a
                  href="mailto:info@soshsa.utg.gm"
                  className="text-xl text-white hover:text-primary transition-colors"
                >
                  info@soshsa.utg.gm
                </a>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-wide text-white/60 mb-3">
                  Phone
                </h3>
                <a
                  href="tel:+2204123456"
                  className="text-xl text-white hover:text-primary transition-colors"
                >
                  +220 412 3456
                </a>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-wide text-white/60 mb-3">
                  Location
                </h3>
                <p className="text-xl text-white">
                  University of The Gambia
                  <br />
                  Brikama Campus
                </p>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-wide text-white/60 mb-3">
                  Office Hours
                </h3>
                <p className="text-white/70">
                  Monday - Friday: 9:00 AM - 5:00 PM
                  <br />
                  Saturday: 10:00 AM - 2:00 PM
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <form onSubmit={handleSubmit} className="bg-white p-8 lg:p-12">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                    placeholder="+220 123 4567"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-none"
                    placeholder="Tell us what you'd like to discuss..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-4 px-8 font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 group"
                >
                  Send Message
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
