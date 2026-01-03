import { useState, useRef } from "react";
import { useProjects, type Project } from "@/lib/project-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Edit2, Save, X, Upload, Loader2, GripVertical, Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpload } from "@/hooks/use-upload";
import { useSEO } from "@/lib/seo";
import { useTranslation } from "@/hooks/use-translation";
import { Switch } from "@/components/ui/switch";
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

// Helper to generate stable gallery item IDs
interface GalleryItemWithId {
  id: string;
  url: string;
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
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useUpload();
  const { isAvailable: translationAvailable, translateText } = useTranslation();
  
  // Stable ID mapping for gallery items (persists across renders)
  const galleryIdMapRef = useRef<Map<string, string>>(new Map());
  
  // Helper to get or create stable ID for a URL
  const getStableId = (url: string): string => {
    if (!galleryIdMapRef.current.has(url)) {
      galleryIdMapRef.current.set(url, `gallery-${Date.now()}-${galleryIdMapRef.current.size}-${Math.random().toString(36).substring(7)}`);
    }
    return galleryIdMapRef.current.get(url)!;
  };
  
  // Derive galleryItems from editingProject.gallery with stable IDs
  const galleryItems: GalleryItemWithId[] = editingProject?.gallery
    ? editingProject.gallery.map(url => ({
        id: getStableId(url),
        url
      }))
    : [];

  useSEO({
    title: 'Admin Panel | Gal Shinhorn',
    description: 'Admin panel for managing projects',
    noindex: true
  });

  // Simple mock login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Dana151205") {
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
        let projectToSave = { ...editingProject };

        // Auto-translate missing English fields if enabled
        if (autoTranslate && translationAvailable) {
          setIsTranslating(true);
          const fieldsToTranslate: Array<{ he: keyof Project, en: keyof Project }> = [
            { he: 'title', en: 'titleEn' },
            { he: 'description', en: 'descriptionEn' },
            { he: 'role', en: 'roleEn' },
            { he: 'location', en: 'locationEn' },
            { he: 'category', en: 'categoryEn' },
          ];

          for (const { he, en } of fieldsToTranslate) {
            const heValue = projectToSave[he];
            const enValue = projectToSave[en];
            
            // Only translate if Hebrew exists and English is missing
            if (heValue && typeof heValue === 'string' && heValue.trim() && (!enValue || (typeof enValue === 'string' && !enValue.trim()))) {
              try {
                const translated = await translateText(heValue);
                projectToSave = { ...projectToSave, [en]: translated };
              } catch (error) {
                console.error(`Failed to translate ${he}:`, error);
                // Continue with other fields even if one fails
              }
            }
          }
          setIsTranslating(false);
        }

        // editingProject.gallery is the single source of truth
        if (isAddingNew) {
          // Remove id and createdAt for new projects - server generates these
          const { id, createdAt, ...projectData } = projectToSave;
          await addProject(projectData);
          toast({ 
            title: "פרויקט נוסף בהצלחה", 
            description: `"${projectToSave.title}" נוסף למערכת${projectToSave.showOnHome ? ' ומופיע בעמוד הבית' : ''}${autoTranslate && translationAvailable ? ' (תורגם לאנגלית)' : ''}`,
            duration: 4000
          });
        } else {
          const { id, createdAt, ...projectData } = projectToSave;
          await updateProject(projectToSave.id, projectData);
          toast({ 
            title: "שינויים נשמרו בהצלחה", 
            description: `הפרויקט "${projectToSave.title}" עודכן${projectToSave.showOnHome ? ' ומופיע בעמוד הבית' : ''}${autoTranslate && translationAvailable ? ' (תורגם לאנגלית)' : ''}`,
            duration: 4000
          });
        }
        setEditingProject(null);
        galleryIdMapRef.current.clear();
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
        setIsTranslating(false);
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
            // Update editingProject.gallery (single source of truth)
            setEditingProject(prev => prev ? {
              ...prev,
              gallery: [...(prev.gallery || []), response.url]
            } : null);
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

  const removeGalleryItem = (id: string) => {
     // Find the URL from the stable ID
     const itemToRemove = galleryItems.find(item => item.id === id);
     if (itemToRemove && editingProject) {
       setEditingProject(prev => prev ? {
         ...prev,
         gallery: prev.gallery?.filter(url => url !== itemToRemove.url) || null
       } : null);
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

    if (galleryItems.length > 0 && over && active.id !== over.id && editingProject) {
      const oldIndex = galleryItems.findIndex(item => item.id === active.id);
      const newIndex = galleryItems.findIndex(item => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && editingProject.gallery) {
        const newGallery = arrayMove(editingProject.gallery, oldIndex, newIndex);
        setEditingProject({ ...editingProject, gallery: newGallery });
      }
    }
  };

  const startEdit = (project: Project) => {
    // Clear ID map for fresh editing session
    galleryIdMapRef.current.clear();
    setEditingProject({ ...project });
    setIsAddingNew(false);
  };

  const startAdd = () => {
    // Clear ID map for fresh editing session
    galleryIdMapRef.current.clear();
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
                    placeholder="הזן סיסמה"
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
                           items={galleryItems.map(item => item.id)}
                           strategy={verticalListSortingStrategy}
                         >
                           <div className="space-y-2">
                              {galleryItems.map((item, index) => (
                                <SortableGalleryItem
                                  key={item.id}
                                  id={item.id}
                                  item={item.url}
                                  index={index}
                                  onRemove={() => removeGalleryItem(item.id)}
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

                    {!translationAvailable && (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                        <p className="font-medium">תרגום אוטומטי לא זמין</p>
                        <p className="text-xs mt-1">שירות התרגום אינו מוגדר. שדות אנגלית יצטרכו להיות מלאים ידנית.</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border mt-4 bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Languages className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="autoTranslate" className="cursor-pointer font-medium">
                            תרגום אוטומטי לאנגלית (Auto-translate to English)
                          </Label>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {translationAvailable 
                              ? "מתרגם אוטומטית שדות עברית לאנגלית בשמירה"
                              : "שירות תרגום לא זמין"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="autoTranslate"
                        checked={autoTranslate && translationAvailable}
                        onCheckedChange={setAutoTranslate}
                        disabled={!translationAvailable}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setEditingProject(null)}>ביטול</Button>
                      <Button type="submit" className="gap-2" disabled={isTranslating}>
                        {isTranslating ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> מתרגם ושומר...</>
                        ) : (
                          <><Save className="h-4 w-4" /> שמור שינויים</>
                        )}
                      </Button>
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
