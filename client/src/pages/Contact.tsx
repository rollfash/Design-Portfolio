import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים."),
  email: z.string().email("נא להזין כתובת אימייל תקינה."),
  type: z.string().min(1, "נא לבחור סוג פרויקט."),
  budget: z.string().optional(),
  message: z.string().min(10, "הודעה חייבת להכיל לפחות 10 תווים."),
});

export function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      type: "",
      budget: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Mock submission
    console.log(values);
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: "ההודעה נשלחה",
        description: "תודה שפנית אליי. אחזור אליך בהקדם.",
      });
    }, 1000);
  }

  return (
    <Layout>
      <div className="container px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">בוא ניצור משהו יפה.</h1>
              <p className="text-muted-foreground mb-12 leading-relaxed">
                בין אם יש לך פרויקט ספציפי בראש או שסתם בא לך לבדוק אפשרויות, אשמח לשמוע ממך.
                מלא את הפרטים בטופס ואחזור אליך תוך 2-3 ימי עסקים.
              </p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold mb-2">אימייל</h3>
                  <a href="mailto:hello@galshinhorn.com" className="text-muted-foreground hover:text-primary transition-colors">hello@galshinhorn.com</a>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">סטודיו</h3>
                  <p className="text-muted-foreground">
                    שדרות רוטשילד 45<br />
                    תל אביב, ישראל
                  </p>
                </div>
                
                {/* Map Placeholder */}
                <div className="w-full h-48 bg-muted rounded border border-border flex items-center justify-center">
                  <span className="text-muted-foreground text-sm uppercase tracking-widest">מפה</span>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 border border-border/50 shadow-sm">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">ההודעה התקבלה</h3>
                  <p className="text-muted-foreground">תודה, {form.getValues().name}. נדבר בקרוב.</p>
                  <Button variant="outline" className="mt-8" onClick={() => setIsSubmitted(false)}>שלח הודעה נוספת</Button>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>שם מלא</FormLabel>
                          <FormControl>
                            <Input placeholder="ישראל ישראלי" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>אימייל</FormLabel>
                          <FormControl>
                            <Input placeholder="israel@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>סוג פרויקט</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="בחר" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="residential">מגורים</SelectItem>
                                <SelectItem value="commercial">מסחרי</SelectItem>
                                <SelectItem value="set-design">עיצוב סט</SelectItem>
                                <SelectItem value="styling">סטיילינג</SelectItem>
                                <SelectItem value="other">אחר</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>תקציב משוער</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="אופציונלי" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="under-10k">עד ₪50k</SelectItem>
                                <SelectItem value="10k-50k">₪50k - ₪200k</SelectItem>
                                <SelectItem value="50k-100k">₪200k - ₪500k</SelectItem>
                                <SelectItem value="100k+">מעל ₪500k</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>הודעה</FormLabel>
                          <FormControl>
                            <Textarea placeholder="ספר לי קצת על הפרויקט..." className="min-h-[120px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">שלח הודעה</Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
