import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.message) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Submit to Supabase
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-blue-900/20 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions or need assistance? Our team is here to help you
              get the most out of our service platform.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info + Form Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="md:col-span-1 space-y-8">
              {/* Email Contact */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-colors">
                <div className="rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                <p className="text-gray-400 mb-3">
                  Our support team will get back to you within 24 hours.
                </p>
                <a
                  href="mailto:services@servicehub.com"
                  className="text-blue-400 hover:text-blue-300"
                >
                  services@servicehub.com
                </a>
              </div>

              {/* Phone Contact */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-colors">
                <div className="rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                <p className="text-gray-400 mb-3">
                  Mon-Fri from 9am to 5pm EST.
                </p>
                <a
                  href="tel:+1-800-555-0123"
                  className="text-blue-400 hover:text-blue-300"
                >
                  +1 (800) 555-0123
                </a>
              </div>

              {/* Office Location */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-colors">
                <div className="rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
                <p className="text-gray-400 mb-3">
                  Come say hello at our office.
                </p>
                <address className="text-blue-400 not-italic">
                  123 Innovation Way
                  <br />
                  Tech District
                  <br />
                  San Francisco, CA 94103
                </address>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-gray-900 text-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-1"
                        >
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-white"
                          placeholder="Your name"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-1"
                        >
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-white"
                          placeholder="you@example.com"
                          required
                        />
                      </div>

                      {/* Subject */}
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium mb-1"
                        >
                          Subject
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-white"
                          placeholder="What is this regarding?"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium mb-1"
                        >
                          Message <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-white resize-none"
                          placeholder="How can we help you?"
                          required
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-3">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full flex justify-center items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all duration-300 disabled:opacity-70"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400">
              Find quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="font-semibold mb-3">How do I list a service?</h3>
              <p className="text-gray-400">
                Create an account, navigate to your dashboard, and click on
                &quot;List Your Services&quot;. Fill in the details about your
                service and set your service terms.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="font-semibold mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-400">
                We accept all major credit cards, PayPal, and bank transfers.
                All payments are secured and encrypted.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="font-semibold mb-3">
                How is payment processing handled?
              </h3>
              <p className="text-gray-400">
                Payments are processed securely when a service is booked. Funds
                are released to the service provider within 48 hours after the
                service is successfully completed.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="font-semibold mb-3">
                What happens if there&apos;s an issue with a service?
              </h3>
              <p className="text-gray-400">
                If there&apos;s a problem with a service, please notify us
                immediately. We have a dispute resolution process to handle
                these situations fairly for both clients and service providers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
