import { useState, useRef } from "react";
import { useProjects, type Project } from "@/lib/project-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Edit2, Save, X, Upload, Loader2, GripVertical } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpload } from "@/hooks/use-upload";
import { useSEO } from "@/lib/seo";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableGalleryItemProps {
  id: string;
  item: string;
  index: number;
  onRemove: () => void;
}

function SortableGalleryItem({ id, item, index, onRemove }: SortableGalleryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.mpeg', '.3gp', '.flv'];
  const isVideo = item.startsWith("data:video") || videoExtensions.some(ext => item.toLowerCase().endsWith(ext));

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg group hover:border-primary/50 transition-colors"
      data-testid={`gallery-item-${index}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing flex-shrink-0"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="w-24 h-16 rounded overflow-hidden border border-border bg-muted shrink-0">
        {isVideo ? (
          <video src={item} className="w-full h-full object-cover" />
        ) : (
          <img src={item} alt="" className="w-full h-full object-cover" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground truncate">
          {isVideo ? 'וידאו' : 'תמונה'} #{index + 1}
        </p>
        {index === 0 && (
          <p className="text-xs text-primary font-medium">תמונת שער</p>
        )}
      </div>
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0"
        onClick={onRemove}
        data-testid={`button-remove-gallery-${index}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { projects, updateProject, addProject, deleteProject } = useProjects();
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useUpload();

  useSEO({
    title: 'Admin Panel | Gal Shinhorn',
    description: 'Admin panel for managing projects',
    noindex: true
  });

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      // Validation
      if (!editingProject.title.trim()) {
        toast({ title: "שגיאה", description: "נא להזין שם פרויקט", variant: "destructive" });
        return;
      }
      if (!editingProject.image) {
        toast({ title: "שגיאה", description: "נא להעלות תמונה ראשית", variant: "destructive" });
        return;
      }
      if (!editingProject.year) {
        toast({ title: "שגיאה", description: "נא להזין שנה", variant: "destructive" });
        return;
      }

      try {
        if (isAddingNew) {
          // Remove id and createdAt for new projects - server generates these
          const { id, createdAt, ...projectData } = editingProject;
          await addProject(projectData);
          toast({ 
            title: "פרויקט נוסף בהצלחה", 
            description: `"${editingProject.title}" נוסף למערכת${editingProject.showOnHome ? ' ומופיע בעמוד הבית' : ''}`,
            duration: 4000
          });
        } else {
          const { id, createdAt, ...projectData } = editingProject;
          await updateProject(editingProject.id, projectData);
          toast({ 
            title: "שינויים נשמרו בהצלחה", 
            description: `הפרויקט "${editingProject.title}" עודכן${editingProject.showOnHome ? ' ומופיע בעמוד הבית' : ''}`,
            duration: 4000
          });
        }
        setEditingProject(null);
        setIsAddingNew(false);
      } catch (error: any) {
        console.error("Error saving project:", error);
        const errorMessage = error?.message || "שמירת הפרויקט נכשלה";
        toast({ 
          title: "שגיאה בשמירה", 
          description: errorMessage + " - נא לנסות שוב או לבדוק חיבור לאינטרנט", 
          variant: "destructive",
          duration: 5000
        });
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProject) {
      setIsUploadingMain(true);
      try {
        console.log("Uploading main image:", file.name, file.size, file.type);
        const response = await uploadFile(file);
        console.log("Upload response:", response);
        if (response) {
          setEditingProject({ ...editingProject, image: response.url });
          toast({ title: "תמונה הועלתה", description: "התמונה הראשית הועלתה בהצלחה" });
        } else {
          toast({ title: "שגיאה", description: "העלאת התמונה נכשלה - אנא נסה שוב", variant: "destructive" });
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast({ title: "שגיאה", description: "העלאת התמונה נכשלה", variant: "destructive" });
      } finally {
        setIsUploadingMain(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && editingProject) {
      setIsUploadingGallery(true);
      let uploadedCount = 0;
      try {
        for (const file of Array.from(files)) {
          console.log("Uploading gallery image:", file.name, file.size, file.type);
          const response = await uploadFile(file);
          console.log("Gallery upload response:", response);
          if (response) {
            uploadedCount++;
            setEditingProject(prev => {
              if (!prev) return null;
              const newGallery = [...(prev.gallery || []), response.url];
              return { ...prev, gallery: newGallery };
            });
          }
        }
        if (uploadedCount > 0) {
          toast({ title: "תמונות הועלו", description: `${uploadedCount} תמונות הועלו בהצלחה לגלריה` });
        } else {
          toast({ title: "שגיאה", description: "העלאת התמונות נכשלה - אנא נסה שוב", variant: "destructive" });
        }
      } catch (error) {
        console.error("Gallery upload error:", error);
        toast({ title: "שגיאה", description: "העלאת התמונות נכשלה", variant: "destructive" });
      } finally {
        setIsUploadingGallery(false);
        // Reset file input
        if (galleryInputRef.current) {
          galleryInputRef.current.value = "";
        }
      }
    }
  };

  const removeGalleryItem = (index: number) => {
     if (editingProject && editingProject.gallery) {
        const newGallery = [...editingProject.gallery];
        newGallery.splice(index, 1);
        setEditingProject({ ...editingProject, gallery: newGallery });
     }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (editingProject?.gallery && over && active.id !== over.id) {
      const oldIndex = parseInt(active.id as string, 10);
      const newIndex = parseInt(over.id as string, 10);
      const newGallery = arrayMove(editingProject.gallery, oldIndex, newIndex);
      setEditingProject({ ...editingProject, gallery: newGallery });
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
      titleEn: null,
      category: "תערוכות",
      categoryEn: null,
      image: "",
      date: null,
      year: new Date().getFullYear().toString(),
      location: null,
      locationEn: null,
      role: null,
      roleEn: null,
      description: null,
      descriptionEn: null,
      services: null,
      servicesEn: null,
      gallery: null,
      showOnHome: false,
      createdAt: new Date(),
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
                        <Select 
                          value={editingProject.category} 
                          onValueChange={(value) => setEditingProject({...editingProject, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="בחר קטגוריה" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="עיצוב סט">עיצוב סט</SelectItem>
                            <SelectItem value="עיצוב במה ואירועים">עיצוב במה ואירועים</SelectItem>
                            <SelectItem value="עיצוב מסחרי">עיצוב מסחרי</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>תאריך הפרויקט (YYYY-MM-DD)</Label>
                        <Input 
                          type="date"
                          value={editingProject.date || ''} 
                          onChange={(e) => setEditingProject({...editingProject, date: e.target.value})}
                          placeholder="2024-01-15"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>שנה (חלופי אם אין תאריך)</Label>
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

                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="showOnHome"
                        data-testid="checkbox-show-on-home"
                        checked={editingProject.showOnHome || false}
                        onChange={(e) => setEditingProject({...editingProject, showOnHome: e.target.checked})}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                      />
                      <Label htmlFor="showOnHome" className="cursor-pointer text-sm font-medium">
                        הצג בעמוד הבית (Show on Home)
                      </Label>
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
                       <Label>תמונה ראשית</Label>
                       <div className="flex flex-col gap-4">
                         <div className="flex items-center gap-4">
                            {editingProject.image && (
                              <div className="w-32 h-20 rounded overflow-hidden border border-border bg-muted shrink-0">
                                <img src={editingProject.image} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex-1">
                              <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                ref={fileInputRef}
                                disabled={isUploadingMain}
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full border-dashed border-2 h-20 hover:border-primary hover:bg-primary/5"
                                disabled={isUploadingMain}
                              >
                                {isUploadingMain ? (
                                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> מעלה...</>
                                ) : (
                                  <><Upload className="mr-2 h-4 w-4" /> {editingProject.image ? "החלף תמונה" : "בחר תמונה מהמחשב"}</>
                                )}
                              </Button>
                            </div>
                         </div>
                       </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                       <div className="flex items-center justify-between">
                         <Label>גלריית תמונות ווידאו</Label>
                         <span className="text-xs text-muted-foreground">גרור כדי לסדר מחדש</span>
                       </div>
                       <DndContext 
                         sensors={sensors}
                         collisionDetection={closestCenter}
                         onDragEnd={handleDragEnd}
                       >
                         <SortableContext 
                           items={editingProject.gallery?.map((_, i) => i.toString()) || []}
                           strategy={verticalListSortingStrategy}
                         >
                           <div className="space-y-2">
                              {editingProject.gallery && editingProject.gallery.map((item, index) => (
                                <SortableGalleryItem
                                  key={index}
                                  id={index.toString()}
                                  item={item}
                                  index={index}
                                  onRemove={() => removeGalleryItem(index)}
                                />
                              ))}
                           </div>
                         </SortableContext>
                       </DndContext>
                       
                       <div className="pt-2">
                         <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleGalleryUpload}
                            className="hidden"
                            ref={galleryInputRef}
                            disabled={isUploadingGallery}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => galleryInputRef.current?.click()}
                            className="w-full border-dashed border-2 h-20 hover:border-primary hover:bg-primary/5"
                            disabled={isUploadingGallery}
                          >
                            {isUploadingGallery ? (
                              <><Loader2 className="mr-2 h-6 w-6 animate-spin" /><span>מעלה תמונות...</span></>
                            ) : (
                              <><Plus className="mr-2 h-6 w-6" /><span>הוסף תמונות לגלריה</span></>
                            )}
                          </Button>
                       </div>
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
