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
      <div className="container px-6 py-20 flex flex-col items-center">
        <div className="max-w-3xl w-full text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">בוא ניצור משהו יפה.</h1>
          <p className="text-muted-foreground leading-relaxed text-lg max-w-xl mx-auto">
            בין אם יש לך פרויקט ספציפי בראש או שסתם בא לך לבדוק אפשרויות, אשמח לשמוע ממך.
            מלא את הפרטים בטופס ואחזור אליך תוך 2-3 ימי עסקים.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl">
            <div className="md:col-span-1 space-y-8 text-center md:text-right bg-secondary/30 p-8 rounded-lg h-fit">
              <div>
                <h3 className="font-bold mb-2 text-primary">אימייל</h3>
                <a href="mailto:hello@galshinhorn.com" className="text-muted-foreground hover:text-primary transition-colors block">hello@galshinhorn.com</a>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-primary">סטודיו</h3>
                <p className="text-muted-foreground">
                  שדרות רוטשילד 45<br />
                  תל אביב, ישראל
                </p>
              </div>
              <div>
                 <h3 className="font-bold mb-2 text-primary">טלפון</h3>
                 <p className="text-muted-foreground">050-123-4567</p>
              </div>
              
              <div className="w-full h-32 bg-background rounded border border-border flex items-center justify-center mt-8">
                <span className="text-muted-foreground text-sm uppercase tracking-widest">מפה</span>
              </div>
            </div>

            <div className="md:col-span-2 bg-card p-8 md:p-12 border border-border shadow-sm rounded-lg">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">ההודעה התקבלה</h3>
                  <p className="text-muted-foreground">תודה, {form.getValues().name}. נדבר בקרוב.</p>
                  <Button variant="outline" className="mt-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => setIsSubmitted(false)}>שלח הודעה נוספת</Button>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-right">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">שם מלא</FormLabel>
                          <FormControl>
                            <Input placeholder="ישראל ישראלי" {...field} className="bg-background" />
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
                          <FormLabel className="text-foreground/80">אימייל</FormLabel>
                          <FormControl>
                            <Input placeholder="israel@example.com" {...field} className="bg-background" />
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
                            <FormLabel className="text-foreground/80">סוג פרויקט</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
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
                            <FormLabel className="text-foreground/80">תקציב משוער</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
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
                          <FormLabel className="text-foreground/80">הודעה</FormLabel>
                          <FormControl>
                            <Textarea placeholder="ספר לי קצת על הפרויקט..." className="min-h-[120px] bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="lg" className="w-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90">שלח הודעה</Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
      </div>
    </Layout>
  );
}
