"use client"

import type React from "react"

import Footer from "@/components/footer"
import Header from "@/components/header"
import StatusScreen from "@/components/status-screen"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { contactUs } from "@/services/api"
import { ContactUsForm, contactUsSchema } from "@/types/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Linkedin, Mail, Twitter } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function ContactPage() {
  const [statusConfig, setStatusConfig] = useState<React.ComponentProps<
    typeof StatusScreen
  > | null>(null);
  const router = useRouter()
    const { register, formState, handleSubmit } = useForm<ContactUsForm>({
      mode: 'onSubmit',
      resolver: zodResolver(contactUsSchema),
      defaultValues: {
              full_name: '',
              email: '',
              message: ''
            }
    });
  
  const { errors, isDirty, isValid, isSubmitting } = formState;

  const submitMutation = useMutation({
    mutationKey: ['contactUs'], mutationFn: (data: ContactUsForm) => contactUs(data),
    onSuccess: () => setStatusConfig({
        variant: 'success',
        title: 'Message Sent!',
        message: 'Thank you for reaching out to us. We will get back to you shortly.',
        actions: [
          {
            label: 'Go Back',
            onClick: () => {setStatusConfig(null)
              router.refresh()},
            variant: 'outline',
          },
        ],
      }),
    onError: (_, variables) => setStatusConfig({
        variant: 'error',
        title: 'Submission Failed',
        message: 'There was an error sending your message. Please try again later.',
        actions: [
          {
            label: 'Go Back',
            onClick: () => {setStatusConfig(null)
              router.refresh()},
            variant: 'outline',
          },
          {
            label: 'Try Again',
            onClick: () => {
              setStatusConfig(null);
              submitMutation.mutate(variables);
            },
            variant: 'default',
          },
        ],
      }),
    })


  const onSubmit = (data: ContactUsForm) => submitMutation.mutate(data);

  if (statusConfig) return <StatusScreen {...statusConfig} />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-background">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Get in Touch
            </h1>
            <h3 className="text-lg sm:text-xl text-muted-foreground text-balance">
              Have a question, feedback, or a partnership inquiry? We'd love to hear from you.
            </h3>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card className="p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-foreground font-semibold mb-2 block">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Gbenga Daniels"
                    {...register('full_name')}
                    disabled={isSubmitting}
                        required
                        className="w-full"
                      />
                      {errors.full_name && (
                  <p className='mt-1 text-xs'>{errors.full_name?.message}</p>
                )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-foreground font-semibold mb-2 block">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                    {...register('email')}
                    disabled={isSubmitting}
                          required
                          className="w-full pl-10"
                        />
                        {errors.email && (
                  <p className='mt-1 text-xs'>{errors.email?.message}</p>
                )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-foreground font-semibold mb-2 block">
                        Your Message
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us what's on your mind..."
                    {...register('message')}
                    disabled={isSubmitting}
                        required
                        rows={5}
                        className="w-full"
                      />
                      {errors.message && (
                  <p className='mt-1 text-xs'>{errors.message?.message}</p>
                )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting || !isDirty || !isValid}>
                      { "Send Message"}
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Contact Details */}
              <div className="space-y-8">
                {/* <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">Contact Information</h3>
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">Email</p>
                      <a href="mailto:contact@cognitomd.com" className="text-primary hover:underline">
                        contact@cognitomd.com
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">Follow Us</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Twitter className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">X (Twitter)</p>
                        <a
                          href="https://twitter.com/cognitomd"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          CognitoMD on X
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Linkedin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">LinkedIn</p>
                        <a
                          href="https://linkedin.com/company/cognitomd"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          CognitoMD on LinkedIn
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Linkedin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">WhatsApp</p>
                        <a
                          href="https://linkedin.com/company/cognitomd"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          CognitoMD on WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
