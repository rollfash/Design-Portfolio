import { useState } from "react";
import { useProjects } from "@/lib/project-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Edit2, Save, X, Image as ImageIcon } from "lucide-react";
import { Project } from "@/data/projects";

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { projects, updateProject, addProject, deleteProject } = useProjects();
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Simple mock login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast({ title: "התחברת בהצלחה", description: "ברוך הבא למערכת הניהול" });
    } else {
      toast({ title: "שגיאה", description: "סיסמה שגויה", variant: "destructive" });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      if (isAddingNew) {
        addProject(editingProject);
        toast({ title: "פרויקט נוסף", description: "הפרויקט החדש נוסף בהצלחה" });
      } else {
        updateProject(editingProject.id, editingProject);
        toast({ title: "פרויקט עודכן", description: "השינויים נשמרו בהצלחה" });
      }
      setEditingProject(null);
      setIsAddingNew(false);
    }
  };

  const startEdit = (project: Project) => {
    setEditingProject({ ...project });
    setIsAddingNew(false);
  };

  const startAdd = () => {
    setEditingProject({
      id: `new-project-${Date.now()}`,
      title: "",
      category: "מגורים",
      image: "", // In a real app, this would be an upload. Here we'd need a URL or text input.
      year: new Date().getFullYear().toString(),
      location: "",
      role: "",
      description: "",
      services: [],
      gallery: []
    });
    setIsAddingNew(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("האם אתה בטוח שברצונך למחוק פרויקט זה?")) {
      deleteProject(id);
      toast({ title: "פרויקט נמחק", description: "הפרויקט הוסר מהמערכת" });
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto py-24 px-6 flex justify-center items-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-2xl">כניסה למערכת ניהול</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">סיסמה</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="הזן סיסמה (admin123)"
                  />
                </div>
                <Button type="submit" className="w-full">התחבר</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">ניהול פרויקטים</h1>
          {!editingProject && (
            <Button onClick={startAdd} className="gap-2">
              <Plus className="h-4 w-4" /> הוסף פרויקט חדש
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Section */}
          <div className={`lg:col-span-1 space-y-4 ${editingProject ? 'hidden lg:block' : ''}`}>
             <div className="bg-muted/30 p-4 rounded-lg border border-border">
               <h2 className="font-bold mb-4 text-lg">רשימת פרויקטים</h2>
               <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                 {projects.map(p => (
                   <div 
                     key={p.id} 
                     className={`p-3 rounded border cursor-pointer transition-colors flex justify-between items-center ${
                       editingProject?.id === p.id 
                         ? 'bg-primary/10 border-primary' 
                         : 'bg-card border-border hover:border-primary/50'
                     }`}
                     onClick={() => startEdit(p)}
                   >
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded overflow-hidden bg-muted">
                         {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                       </div>
                       <div>
                         <p className="font-medium text-sm">{p.title}</p>
                         <p className="text-xs text-muted-foreground">{p.category}</p>
                       </div>
                     </div>
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                     >
                       <Trash2 className="h-4 w-4" />
                     </Button>
                   </div>
                 ))}
               </div>
             </div>
          </div>

          {/* Edit Section */}
          <div className="lg:col-span-2">
            {editingProject ? (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{isAddingNew ? 'הוספת פרויקט חדש' : `עריכת: ${editingProject.title}`}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setEditingProject(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>שם הפרויקט</Label>
                        <Input 
                          value={editingProject.title} 
                          onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>קטגוריה</Label>
                         <Input 
                          value={editingProject.category} 
                          onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>שנה</Label>
                        <Input 
                          value={editingProject.year} 
                          onChange={(e) => setEditingProject({...editingProject, year: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>מיקום</Label>
                        <Input 
                          value={editingProject.location || ''} 
                          onChange={(e) => setEditingProject({...editingProject, location: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>תפקיד</Label>
                        <Input 
                          value={editingProject.role || ''} 
                          onChange={(e) => setEditingProject({...editingProject, role: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>תיאור</Label>
                      <Textarea 
                        value={editingProject.description || ''} 
                        onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                       <Label>כתובת תמונה ראשית (URL)</Label>
                       <div className="flex gap-2">
                         <Input 
                            value={editingProject.image} 
                            onChange={(e) => setEditingProject({...editingProject, image: e.target.value})}
                            placeholder="/assets/..."
                         />
                         {editingProject.image && (
                           <div className="w-10 h-10 rounded overflow-hidden border border-border bg-muted shrink-0">
                             <img src={editingProject.image} alt="Preview" className="w-full h-full object-cover" />
                           </div>
                         )}
                       </div>
                       <p className="text-xs text-muted-foreground">הערה: במערכת הדגמה זו, נא להזין נתיב לתמונה קיימת או כתובת URL חיצונית.</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
                      <Button type="button" variant="outline" onClick={() => setEditingProject(null)}>ביטול</Button>
                      <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> שמור שינויים</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg bg-muted/10 text-muted-foreground">
                <Edit2 className="h-12 w-12 mb-4 opacity-20" />
                <p>בחר פרויקט לעריכה או צור חדש</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
