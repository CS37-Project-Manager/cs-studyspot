"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./courses.module.css";
import { 
  EnrolledCourse, 
  AvailableCourse, 
  EnrolledCourseCardProps, 
  AvailableCourseCardProps 
} from "./types";
import { 
  fetchEnrolledCourses, 
  fetchAvailableCourses, 
  joinCourse 
} from "./services/courseService";
import { useSession } from "@/providers/SessionProvider";

// Mock data for courses (fallback if API fails)
const mockEnrolledCourses: EnrolledCourse[] = [
  {
    id: 1,
    title: "Project Manager",
    instructor: "Thirawat Kui",
    progress: 78,
    imageUrl: "/images/course-placeholder.svg",
  },
  {
    id: 2,
    title: "Project Manager",
    instructor: "Thirawat Kui",
    progress: 78,
    imageUrl: "/images/course-placeholder.svg",
  },
  {
    id: 3,
    title: "Project Manager",
    instructor: "Thirawat Kui",
    progress: 78,
    imageUrl: "/images/course-placeholder.svg",
  },
];

const mockAvailableCourses: AvailableCourse[] = [
  {
    id: 4,
    title: "Project Manager",
    instructor: "Thirawat Kui",
    imageUrl: "/images/course-placeholder.svg",
  },
  {
    id: 5,
    title: "Project Manager",
    instructor: "Thirawat Kui",
    imageUrl: "/images/course-placeholder.svg",
  },
  {
    id: 6,
    title: "Project Manager",
    instructor: "Thirawat Kui",
    imageUrl: "/images/course-placeholder.svg",
  },
  {
    id: 7,
    title: "Project Manager",
    instructor: "Thirawat Kui",
    imageUrl: "/images/course-placeholder.svg",
  },
  {
    id: 8,
    title: "Project Manager",
    instructor: "Thirawat Kui",
    imageUrl: "/images/course-placeholder.svg",
  },
  {
    id: 9,
    title: "Project Manager",
    instructor: "Thirawat Kui",
    imageUrl: "/images/course-placeholder.svg",
  },
  {
    id: 10,
    title: "Project Manager",
    instructor: "Thirawat Kui",
    imageUrl: "/images/course-placeholder.svg",
  },
  {
    id: 11,
    title: "Project Manager",
    instructor: "Thirawat Kui",
    imageUrl: "/images/course-placeholder.svg",
  },
];

// Course card components
const EnrolledCourseCard = ({ course }: EnrolledCourseCardProps) => {
  return (
    <div 
      className={styles.card} 
      style={{ 
        boxShadow: "8.82353px 8.82353px 0px #5D5C5C",
        backgroundImage: `url(${course.imageUrl})`
      }}
    >
      <div className={styles.infoContainer}>
        <div className={styles.profileRow}>
          <div className={styles.profileInfo}>
            <div className={styles.jobTitle}>{course.title}</div>
            <div className={styles.name}>{course.instructor}</div>
          </div>
          <div className={styles.progressLabel}>{course.progress}%</div>
        </div>
        <div className={styles.progressContainer}>
          <div 
            className={styles.progressBar} 
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const AvailableCourseCard = ({ course, onJoin }: AvailableCourseCardProps) => {
  return (
    <div 
      className={styles.card}
      style={{ backgroundImage: `url(${course.imageUrl})` }}
    >
      <div className={styles.infoContainer} style={{ height: "56.47px" }}>
        <div className={styles.profileRow}>
          <div className={styles.profileInfo}>
            <div className={styles.jobTitle}>{course.title}</div>
            <div className={styles.name}>{course.instructor}</div>
          </div>
          <div 
            className={styles.joinButton}
            onClick={() => onJoin(course.id)}
          >
            <div className={styles.buttonText}>Join</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CoursesPage() {
  const { user, signOut } = useSession(); // Get user data and signOut function from session
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>(mockEnrolledCourses);
  const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>(mockAvailableCourses);
  const [userName, setUserName] = useState(user.name); // Use user's name from session
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, these would be API calls
        // For now, we'll use the mock data but structure it as if we're making API calls
        // This makes it easy for the backend team to integrate later
        
        // Uncomment these lines when the backend is ready
        // const enrolledData = await fetchEnrolledCourses();
        // const availableData = await fetchAvailableCourses();
        // setEnrolledCourses(enrolledData);
        // setAvailableCourses(availableData);
        
        // For now, simulate API delay
        setTimeout(() => {
          setEnrolledCourses(mockEnrolledCourses);
          setAvailableCourses(mockAvailableCourses);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Function to handle joining a course
  const handleJoinCourse = async (courseId: number) => {
    try {
      // In a real app, this would be an API call
      // Uncomment this when the backend is ready
      // await joinCourse(courseId);
      
      const courseToJoin = availableCourses.find(course => course.id === courseId);
      if (courseToJoin) {
        // Add progress property to the course
        const enrolledCourse: EnrolledCourse = {
          ...courseToJoin,
          progress: 0
        };
        
        // Update state
        setEnrolledCourses([...enrolledCourses, enrolledCourse]);
        setAvailableCourses(availableCourses.filter(course => course.id !== courseId));
      }
    } catch (err) {
      console.error(`Error joining course ${courseId}:`, err);
      setError("Failed to join course. Please try again later.");
    }
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
          <div className={styles.userGreeting}>
            <h2 className={styles.userName}>{userName} <span className={styles.waveEmoji}>👋</span></h2>
          </div>
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

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Continue Learning</h2>
        <div className={styles.courseGrid}>
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => (
              <EnrolledCourseCard key={course.id} course={course} />
            ))
          ) : (
            <p className={styles.emptyMessage}>You haven't enrolled in any courses yet.</p>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Courses</h2>
        <div className={styles.courseGrid}>
          {availableCourses.length > 0 ? (
            availableCourses.map((course) => (
              <AvailableCourseCard 
                key={course.id} 
                course={course} 
                onJoin={handleJoinCourse} 
              />
            ))
          ) : (
            <p className={styles.emptyMessage}>No available courses at the moment.</p>
          )}
        </div>
      </section>
    </div>
  );
} 