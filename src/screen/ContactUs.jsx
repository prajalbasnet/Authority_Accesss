import React, { useState, useRef } from "react";
import { Mail, Phone, Globe, MapPin, Send, User, MessageSquare } from "lucide-react";

const Input = ({ className, ...props }) => (
    <input {...props} className={`border border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-4 py-2 rounded-lg transition-all ${className}`} />
);

const Textarea = ({ className, ...props }) => (
    <textarea {...props} className={`border border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-4 py-2 rounded-lg transition-all ${className}`} />
);

const Button = ({ children, className, ...props }) => (
    <button {...props} className={`flex items-center justify-center gap-2 text-white bg-blue-700 hover:bg-blue-800 transition-all duration-300 rounded-lg px-6 py-2 ${className}`}>
        {children}
    </button>
);

const Card = ({ children, className }) => (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardContent = ({ children, className }) => <div className={`p-6 ${className}`}>{children}</div>;

const ContactUs = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const formRef = useRef(null);

    const contactInfo = [
        { Icon: Phone, title: 'Phone', lines: ['+977-01-4123456', '+977-01-4123457'], color: 'text-blue-500' },
        { Icon: Mail, title: 'Email', lines: ['info@hamrogunaso.org', 'support@hamrogunaso.org'], color: 'text-red-500' },
        { Icon: Globe, title: 'Website', lines: ['www.hamrogunaso.org', '@hamrogunaso'], color: 'text-green-500' },
        { Icon: MapPin, title: 'Location', lines: ['Butwal, Nepal'], color: 'text-purple-500' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            await new Promise((res) => setTimeout(res, 1000)); // mock API
            setSubmitSuccess(true);
            form.reset();
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error) {
            setSubmitError(error.message || 'Error sending message');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-800 p-8">
            <h1 className="text-5xl font-bold mb-8 text-center text-blue-700">Contact Us</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <Card>
                    <CardHeader className="bg-blue-700 text-white rounded-t-2xl flex items-center gap-2">
                        <MessageSquare /> Send a Message
                    </CardHeader>
                    <CardContent>
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Input name="fullName" placeholder="Full Name" required className="w-full pl-10 py-2" />
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
                            </div>
                            <div className="relative">
                                <Input name="email" type="email" placeholder="Email" required className="w-full pl-10 py-2" />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            <div className="relative">
                                <Input name="phone" type="tel" placeholder="Phone" className="w-full pl-10 py-2" />
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            <div className="relative">
                                <Textarea name="message" placeholder="Message" required className="w-full p-2" />
                            </div>
                            {submitError && <p className="text-red-500">{submitError}</p>}
                            {submitSuccess && <p className="text-green-500">Message sent successfully!</p>}
                            <Button type="submit" className="w-full py-2">{isSubmitting ? "Sending..." : <><Send className="inline mr-2" /> Send</>}</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Map + Info */}
                <div className="flex flex-col gap-6">
                    <div className="h-64 rounded-2xl overflow-hidden shadow-lg">
                        <iframe
                            className="w-full h-full"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3584.219941294666!2d83.46796612632627!3d27.62838862234865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39968432be835a0b%3A0x9050d582cdb10658!2sNepathya%20College!5e0!3m2!1sen!2snp!4v1756140923102!5m2!1sen!2snp"
                            allowFullScreen
                            loading="lazy"
                            title="HamroGunasO Center Map"
                        />
                    </div>
                    <div className="bg-blue-700 text-white rounded-2xl p-4 shadow-lg">
                        <h3 className="font-semibold mb-1">Visit Our Center</h3>
                        <p>We are open 24/7 for all queries and complaints.</p>
                    </div>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactInfo.map(({ Icon, title, lines, color }, idx) => (
                    <Card key={idx} className="shadow-lg rounded-xl p-6 text-center hover:scale-105 transform transition-all">
                        <div className={`w-14 h-14 mx-auto mb-3 rounded-full ${color} bg-opacity-20 flex items-center justify-center`}>
                            <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="font-semibold text-lg">{title}</h3>
                        {lines.map((line, i) => <p key={i} className="text-gray-600 text-sm">{line}</p>)}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ContactUs;
