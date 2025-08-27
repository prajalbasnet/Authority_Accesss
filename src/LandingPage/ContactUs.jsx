import React, { useState, useRef } from "react";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Send,
  User,
  MessageSquare,
} from "lucide-react";

const Input = ({ label, className, ...props }) => (
  <div className="relative">
    <input
      {...props}
      placeholder=" "
      className={`peer border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 px-3 pt-5 pb-2 w-full rounded-lg text-sm transition-all ${className}`}
    />
    <label className="absolute left-3 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-red-600">
      {label}
    </label>
  </div>
);

const Textarea = ({ label, className, ...props }) => (
  <div className="relative">
    <textarea
      {...props}
      placeholder=" "
      className={`peer border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 px-3 pt-5 pb-2 w-full rounded-lg text-sm transition-all ${className}`}
    />
    <label className="absolute left-3 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-red-600">
      {label}
    </label>
  </div>
);

const Button = ({ children, className, ...props }) => (
  <button
    {...props}
    className={`flex items-center justify-center gap-2 text-white bg-red-600 hover:bg-red-700 transition-all duration-300 rounded-lg px-5 py-2 font-medium shadow-sm hover:shadow-md text-sm ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className }) => (
  <div
    className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const formRef = useRef(null);

  const contactInfo = [
    {
      Icon: Phone,
      title: "Phone",
      lines: ["+977-01-4123456", "+977-01-4123457"],
      color: "text-blue-600",
    },
    {
      Icon: Mail,
      title: "Email",
      lines: ["info@hamrogunaso.org", "support@hamrogunaso.org"],
      color: "text-red-600",
    },
    {
      Icon: Globe,
      title: "Website",
      lines: ["www.hamrogunaso.org", "@hamrogunaso"],
      color: "text-blue-700",
    },
    {
      Icon: MapPin,
      title: "Location",
      lines: ["Tilotamma, Nepal"],
      color: "text-red-700",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      await new Promise((res) => setTimeout(res, 1000));
      setSubmitSuccess(true);
      e.target.reset();
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (error) {
      setSubmitError(error.message || "Error sending message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-10">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-red-600 mb-2">
          Contact Us
        </h1>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
        <p className="mt-1 text-blue-900 text-sm">
          We’d love to hear from you. Reach out anytime.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compact Contact Form */}
        <Card>
          <div className="p-4 border-gray-900  flex items-center gap-2 text-red-600 font-medium text-sm">
            <MessageSquare className="w-4 h-4" /> Send a Message
          </div>
          <div className="p-5">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-4 text-sm"
            >
              <Input name="fullName" label="Full Name" required />
              <Input name="email" type="email" label="Email" required />
              <Input name="phone" type="tel" label="Phone (Optional)" />
              <Textarea name="message" label="Your Message" required rows="3" />

              {submitError && (
                <p className="text-red-600 text-xs">{submitError}</p>
              )}
              {submitSuccess && (
                <p className="text-green-600 text-xs">
                  Message sent successfully!
                </p>
              )}

              <Button type="submit" className="w-full">
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send
                  </>
                )}
              </Button>
            </form>
          </div>
        </Card>

        {/* Map + Info */}
        <div className="flex flex-col gap-5">
          <Card className="overflow-hidden h-56">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3584.219941294666!2d83.46796612632627!3d27.62838862234865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39968432be835a0b%3A0x9050d582cdb10658!2sNepathya%20College!5e0!3m2!1sen!2snp!4v1756140923102!5m2!1sen!2snp"
              allowFullScreen
              loading="lazy"
              title="HamroGunaso Center Map"
            />
          </Card>
          <Card className="bg-blue-900 text-blue-900 p-4">
            <h3 className="font-semibold text-sm mb-1">Visit Our Center</h3>
            <p className="text-xs">
              We are open 24/7 for all queries and complaints.
            </p>
          </Card>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {contactInfo.map(({ Icon, title, lines, color }, idx) => (
          <Card
            key={idx}
            className="p-4 text-center hover:scale-105 transform transition-all text-sm"
          >
            <div
              className={`w-12 h-12 mx-auto mb-3 rounded-full ${color} bg-opacity-10 flex items-center justify-center`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base">{title}</h3>
            {lines.map((line, i) => (
              <p key={i} className="text-gray-600 text-xs">
                {line}
              </p>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContactUs;
