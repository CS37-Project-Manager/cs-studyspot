"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./teacher.module.css";
import { useSession } from "@/providers/SessionProvider";
import { TeacherCourse, fetchTeacherCourses } from "./services/teacherService";

// Course card component
const CourseCard = ({ course }: { course: TeacherCourse }) => {
  const router = useRouter();
  
  const handleViewCourse = () => {
    // Navigate to course management page
    // In the future, this will include the course ID in the URL
    // For example: router.push(`/course-management/${course.id}`)
    router.push(`/teacher/${course.id}`);
  };
  
  return (
    <div className={styles.courseCard}>
      <div className={styles.courseImage}>
        <Image 
          src={course.imageUrl} 
          alt={course.title} 
          width={300} 
          height={149}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.courseInfo}>
        <div className={styles.courseDetails}>
          <h3 className={styles.courseTitle}>{course.title}</h3>
          <p className={styles.instructorName}>{course.instructor}</p>
        </div>
        <button 
          className={styles.viewButton}
          onClick={handleViewCourse}
        >
          View
        </button>
      </div>
    </div>
  );
};

export default function TeacherPage() {
  const router = useRouter();
  const { user, signOut } = useSession(); // Add signOut function from session
  const [teacherCourses, setTeacherCourses] = useState<TeacherCourse[]>([]);
  const [userName, setUserName] = useState(user.name); // Use user's name from session
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const courses = await fetchTeacherCourses();
        setTeacherCourses(courses);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Function to handle creating a new course
  const handleCreateCourse = () => {
    router.push("/teacher/create");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeText}>Welcome back!</h1>
          <h2 className={styles.userName}>{userName} <span className={styles.waveEmoji}>👋</span></h2>
        </div>
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
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>My courses</h2>
        <button 
          className={styles.createButton}
          onClick={handleCreateCourse}
        >
          <span className={styles.createButtonText}>
            <span className={styles.plusIcon}>+</span>
            Create
          </span>
        </button>
      </div>

      <div className={styles.courseGrid}>
        {teacherCourses.length > 0 ? (
          teacherCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <p className={styles.emptyMessage}>You haven't created any courses yet.</p>
        )}
      </div>
    </div>
  );
} 
