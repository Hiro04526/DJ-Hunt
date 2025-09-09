"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FaCheckCircle, FaPaperPlane, FaDownload, FaEnvelope } from "react-icons/fa"
import { ChevronDown } from "lucide-react"
import { TypeAnimation } from "react-type-animation"
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

type FormState = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export function HeroSection() {
  const [formState, setFormState] = useState<FormState>({
      name: "",
      email: "",
      message: "",
    });
  const [contactSelected, setContactSelected] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formState.name.trim()) newErrors.name = "Name is required";
    if (!formState.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formState.email))
      newErrors.email = "Email is invalid";
    if (!formState.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      if (validateForm()) {
        setIsSubmitting(true);
    
        try {
          await emailjs.send(
            "service_g1cf6qh",
            "template_wo6jkij",
            {
              name: formState.name,
              email: formState.email,
              message: formState.message,
              time: new Date().toLocaleString()
            },
            "8c9fW_NlFQbP3Oz2F"
          );
    
          setIsSubmitted(true);
          setFormState({ name: "", email: "", message: "" });
    
          toast.success("✅ Message sent! Thanks for reaching out.");
        } catch (error) {
          console.error("EmailJS Error:", error);
          toast.error("❌ Something went wrong. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      } else {
        toast.warning("⚠️ Please fill out all required fields correctly.");
      }
    };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15, staggerChildren: 0.1 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 animate-gradient" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern" />
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="text-center">
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Creative Developer
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 h-[60px]"
          >
            <TypeAnimation
              sequence={[
                "Building beautiful web experiences",
                1000,
                "Crafting intuitive interfaces",
                1000,
                "Creating engaging animations",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex justify-center space-x-4"
          >
            <a href="/files/RESUME_ISHIKAWA_ANDREW HIRO.pdf" download>
              <Button size="lg" className="group hover:from-primary/80 hover:to-secondary/80 text-primary-foreground">
                <FaDownload className="mr-2 h-4 w-4" />
                Download CV
              </Button>
            </a>
            <Button size="lg" className="group hover:from-primary/80 hover:to-secondary/80 text-primary-foreground" onClick={() => setContactSelected(true)}>
              <FaEnvelope className="mr-2 h-4 w-4" />
              Contact Me
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1,
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="h-6 w-6 text-muted-foreground" />
      </motion.div>

      <AnimatePresence>
        {contactSelected && (
          <Dialog open={!!contactSelected} onOpenChange={() => setContactSelected(false)}>
            <DialogContent className="max-w-3xl w-full">
              <DialogHeader>
                <DialogTitle>
                </DialogTitle>
              </DialogHeader>
              <div className="p-8 sm:p-12">
                <motion.h2 className="text-2xl font-bold text-center mb-8 text-primary" variants={childVariants}>
                  Get in Touch
                </motion.h2>
                {isSubmitted ? (
                  <motion.div
                    className="text-center text-primary"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  >
                    <FaCheckCircle className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
                    <p>Your message has been sent successfully. We'll get back to you soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <motion.div className="space-y-6" variants={formVariants}>
                      <motion.div variants={childVariants}>
                        <Label htmlFor="name" className="text-primary">Name</Label>
                        <Input id="name" name="name" value={formState.name} onChange={handleChange} className={`mt-1 ${errors.name ? "border-destructive" : ""}`} />
                        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
                      </motion.div>

                      <motion.div variants={childVariants}>
                        <Label htmlFor="email" className="text-primary">Email</Label>
                        <Input id="email" name="email" type="email" value={formState.email} onChange={handleChange} className={`mt-1 ${errors.email ? "border-destructive" : ""}`} />
                        {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
                      </motion.div>

                      <motion.div variants={childVariants}>
                        <Label htmlFor="message" className="text-primary">Message</Label>
                        <Textarea id="message" name="message" value={formState.message} onChange={handleChange} className={`mt-1 ${errors.message ? "border-destructive" : ""}`} rows={4} />
                        {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message}</p>}
                      </motion.div>

                      <motion.div variants={childVariants}>
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <motion.div className="h-5 w-5 rounded-full border-t-2 border-r-2 border-background" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                          ) : (
                            <>
                              Send Message
                              <FaPaperPlane className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.section>
  );
}