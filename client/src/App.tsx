import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ProjectProvider } from "@/lib/project-context";
import { LanguageProvider } from "@/lib/language-context";

import { Home } from "@/pages/Home";
import { Portfolio } from "@/pages/Portfolio";
import { ProjectDetail } from "@/pages/ProjectDetail";
import { Services } from "@/pages/Services";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Admin } from "@/pages/Admin";
import { Blog } from "@/pages/Blog";
import { BlogPost } from "@/pages/BlogPost";
import { useAnalytics } from "@/hooks/use-analytics";

function Router() {
  useAnalytics();
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/project/:id" component={ProjectDetail} />
      <Route path="/services" component={Services} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ProjectProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ProjectProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
