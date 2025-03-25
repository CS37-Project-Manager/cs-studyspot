"use client";

import { useState, useRef, ChangeEvent, FormEvent, DragEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./create.module.css";
import { useSession } from "@/providers/SessionProvider";
import { createCourse, CourseCreate } from "../services/teacherService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateCoursePage() {
  const router = useRouter();
  const { user, signOut } = useSession();
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Use mutation for creating a course
  const createCourseMutation = useMutation({
    mutationFn: (courseData: CourseCreate) => createCourse(courseData),
    onSuccess: () => {
      // Invalidate the teacherCourses query to refetch the data when navigating back
      queryClient.invalidateQueries({ queryKey: ['teacherCourses'] });
      // Redirect to teacher page
      router.push("/teacher");
    },
    onError: (error) => {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    }
  });
  
  // Handle image upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    processFile(file);
  };
  
  const processFile = (file: File) => {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit");
      return;
    }
    
    // Check file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      alert("Only JPG, JPEG, and PNG files are allowed");
      return;
    }
    
    // Set file name for display
    setFileName(file.name);
    setImageFile(file);
    
    // Create a preview URL for the preview card
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        setImagePreview(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Drag and drop handlers
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };
  
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      alert("Please enter a course name");
      return;
    }
    
    if (!imageFile) {
      alert("Please upload a cover image");
      return;
    }
    
    if (!description.trim()) {
      alert("Please enter course details");
      return;
    }
    
    // In a real app, you would upload the image to a storage service
    // and get back a URL. For now, we'll use a placeholder URL
    const imageUrl = "/images/course-placeholder.png";
    
    // Create course using mutation
    createCourseMutation.mutate({
      name,
      description,
      cover_image: imageUrl,
    });
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/teacher" className={styles.backLink}>
          ← back to courses
        </Link>
        <div className={styles.headerRight}>
          <button 
            className={styles.logoutButton}
            onClick={signOut}
          >
            Logout
          </button>
          <div className={styles.profilePicContainer}>
            {!imageError ? (
              <Image 
                src={user.profileImage} 
                alt="Profile" 
                width={50} 
                height={50} 
                className={styles.profilePic}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={styles.profilePicFallback}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <h1 className={styles.pageTitle}>Create a course</h1>
      
      <div className={styles.contentContainer}>
        <div className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="courseName" className={styles.label}>Name</label>
            <input
              id="courseName"
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Course name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Cover Image</label>
            <div 
              className={`${styles.imageUploadContainer} ${isDragging ? styles.dragging : ''}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleImageClick}
            >
              <div className={styles.uploadPlaceholder}>
                <div className={styles.imageUploadIcon}>↑</div>
                <div className={styles.imageUploadText}>
                  Choose a file or drag & drop it here
                </div>
                <div className={styles.imageFormatText}>
                  JPG,JPEG,PNG formats, up to 5mbs
                </div>
              </div>
              <input
                id="fileInput"
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className={styles.hiddenInput}
                onChange={handleImageChange}
              />
            </div>
            {fileName && (
              <div className={styles.selectedFileName}>
                Selected file: {fileName}
              </div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="courseDetail" className={styles.label}>Detail</label>
            <textarea
              id="courseDetail"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue."
            />
          </div>
          
          <button 
            className={styles.createButton}
            onClick={handleSubmit}
            disabled={createCourseMutation.isPending}
          >
            {createCourseMutation.isPending ? "Creating..." : "Create"}
          </button>
        </div>
        
        <div className={styles.previewContainer}>
          <label className={styles.previewTitle}>Previews</label>
          <div className={styles.previewCard}>
            <div className={styles.previewImage}>
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Course preview" 
                  className={styles.previewImageContent}
                />
              ) : (
                "No image uploaded"
              )}
            </div>
            <div className={styles.previewInfo}>
              <div className={styles.previewDetails}>
                <h3 className={styles.previewCourseTitle}>
                  {name || "Project Manager"}
                </h3>
                <p className={styles.previewInstructorName}>
                  {user.name || "Thirawat Kui"}
                </p>
              </div>
              <div className={styles.viewButton}>View</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
