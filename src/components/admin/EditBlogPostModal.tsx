
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { X, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageUpload } from './ImageUpload';
import { v4 as uuidv4 } from 'uuid';

interface EditBlogPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostEdited: () => void;
  postId: string | null;
}

const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  title_en: z.string().min(1, "Tiêu đề tiếng Anh không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  author: z.string().min(1, "Tác giả không được để trống"),
  excerpt: z.string().optional(),
  excerpt_en: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EditBlogPostModal: React.FC<EditBlogPostModalProps> = ({
  open,
  onOpenChange,
  onPostEdited,
  postId
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('vietnamese');
  const [content, setContent] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [postData, setPostData] = useState<any>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      title_en: '',
      slug: '',
      author: '',
      excerpt: '',
      excerpt_en: '',
      tags: [],
    },
  });

  // Fetch post data when modal opens and postId changes
  useEffect(() => {
    const fetchPostData = async () => {
      if (!open || !postId) return;
      
      setIsLoadingPost(true);
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', postId)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setPostData(data);
          
          // Set form values
          form.reset({
            title: data.title || '',
            title_en: data.title_en || '',
            slug: data.slug || '',
            author: data.author || '',
            excerpt: data.excerpt || '',
            excerpt_en: data.excerpt_en || '',
            tags: data.tags || [],
          });
          
          // Set content and other state values
          setContent(data.content || '');
          setContentEn(data.content_en || '');
          setFeaturedImage(data.featured_image || '');
          setTags(data.tags || []);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Không thể tải dữ liệu bài viết');
      } finally {
        setIsLoadingPost(false);
      }
    };
    
    fetchPostData();
  }, [open, postId, form]);

  const handleImageUploadQuill = async (file: File) => {
    try {
      // Generate a unique file name to prevent overwriting
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Try uploading to blog-images bucket first
      let { error: uploadError, data } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);
        
      // If blog-images bucket doesn't exist, try the 'images' bucket as fallback
      if (uploadError && uploadError.message.includes("bucket")) {
        console.log('Trying fallback bucket "images"');
        const result = await supabase.storage
          .from('images')
          .upload(filePath, file);
          
        uploadError = result.error;
        data = result.data;
      }

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const bucketName = data?.path ? 'blog-images' : 'images'; // Use the bucket that was successful
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in image upload:', error);
      toast.error('Không thể tải hình ảnh lên');
      return null;
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: function() {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();
          
          input.onchange = async () => {
            if (input.files && input.files[0]) {
              const file = input.files[0];
              const url = await handleImageUploadQuill(file);
              
              if (url) {
                const editor = (this as any).quill;
                const range = editor.getSelection(true);
                editor.insertEmbed(range.index, 'image', url);
                editor.setSelection(range.index + 1);
              }
            }
          };
        }
      }
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
    }
    setCurrentTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (values: FormValues) => {
    if (!postId) {
      toast.error('Thiếu ID bài viết');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for update
      const updateData = {
        title: values.title,
        title_en: values.title_en,
        slug: values.slug,
        author: values.author,
        excerpt: values.excerpt,
        excerpt_en: values.excerpt_en,
        content: content,
        content_en: contentEn,
        featured_image: featuredImage,
        tags: tags,
        updated_at: new Date().toISOString(),
      };

      // Update the post in Supabase
      const { error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', postId);

      if (error) {
        throw error;
      }

      toast.success('Đã cập nhật bài viết thành công');
      onOpenChange(false);
      onPostEdited();
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast.error(`Không thể cập nhật bài viết: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin bài viết và nội dung của bạn
          </DialogDescription>
        </DialogHeader>

        {isLoadingPost ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-olive-600" />
            <span className="ml-2">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề (Tiếng Việt)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề bài viết..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="title_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề (Tiếng Anh)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter post title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug (URL)</FormLabel>
                      <FormControl>
                        <Input placeholder="nhap-tieu-de" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL thân thiện cho bài viết
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tác giả</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên tác giả" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <Label>Tags</Label>
                  <div className="flex mt-2 mb-1">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Thêm tag..."
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="mr-2"
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} className="flex items-center gap-1 bg-beach-100 text-beach-800 hover:bg-beach-200">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-beach-500 hover:text-beach-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tóm tắt (Tiếng Việt)</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Tóm tắt ngắn về bài viết"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="excerpt_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tóm tắt (Tiếng Anh)</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Brief summary of the post"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label>Ảnh đại diện</Label>
                <div className="mt-2">
                  <ImageUpload
                    value={featuredImage}
                    onChange={(url) => setFeaturedImage(url)}
                    onRemove={() => setFeaturedImage('')}
                    bucketName="blog-images"
                  />
                </div>
              </div>

              <div>
                <Label>Nội dung bài viết</Label>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                  <TabsList className="mb-2">
                    <TabsTrigger value="vietnamese">Tiếng Việt</TabsTrigger>
                    <TabsTrigger value="english">Tiếng Anh</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="vietnamese" className="mt-0">
                    <div className="min-h-[400px]">
                      <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        className="h-[350px]"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="english" className="mt-0">
                    <div className="min-h-[400px]">
                      <ReactQuill
                        theme="snow"
                        value={contentEn}
                        onChange={setContentEn}
                        modules={modules}
                        className="h-[350px]"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    'Cập nhật bài viết'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditBlogPostModal;
