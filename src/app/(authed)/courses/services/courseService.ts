import { 
  EnrolledCourse, 
  AvailableCourse, 
  DBCourse,
  DBProgress,
  translateDBCourseToUI,
  translateDBCourseToEnrolled
} from "../types";

// API endpoints
const API_ENDPOINTS = {
  ENROLLED_COURSES: "/api/courses/enrolled",
  AVAILABLE_COURSES: "/api/courses/available",
  JOIN_COURSE: "/api/courses/join",
  COURSE_DETAIL: (id: string) => `/api/courses/${id}`,
};

/**
 * Fetch enrolled courses for the current user
 */
export const fetchEnrolledCourses = async (): Promise<EnrolledCourse[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.ENROLLED_COURSES);
    
    if (!response.ok) {
      throw new Error(`Error fetching enrolled courses: ${response.statusText}`);
    }
    
    // receive DB formatted data and transform it
    const data = await response.json();
    
    //transformation logic
    // ex return data.map(course => translateDBCourseToEnrolled(
    //   course.course, 
    //   course.instructorName, 
    //   course.progress
    // ));
    
    return data; // for now, assume the mock already follows figma format
  } catch (error) {
    console.error("Failed to fetch enrolled courses:", error);
    throw error;
  }
};

/**
 * fetch available courses for the current user
 */
export const fetchAvailableCourses = async (): Promise<AvailableCourse[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.AVAILABLE_COURSES);
    
    if (!response.ok) {
      throw new Error(`Error fetching available courses: ${response.statusText}`);
    }
    
    // receive DB formatted data and transform it
    const data = await response.json();
    
    // transformation logic 
    // return data.map(course => translateDBCourseToUI(
    //   course,
    //   course.instructorName // this would be looked up via course.owner_id
    // ));
    
    return data; // For now, assume the mock already follows the UI format
  } catch (error) {
    console.error("Failed to fetch available courses:", error);
    throw error;
  }
};

/**
 * Join a course
 * @param courseId - The ID of the course to join
 */
export const joinCourse = async (courseId: number): Promise<{ success: boolean; message: string }> => {
  try {
    // In a real app, we'd convert the number ID to a string ID for the DB
    const response = await fetch(API_ENDPOINTS.JOIN_COURSE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        course_id: courseId.toString() // Convert to string for DB
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error joining course: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to join course ${courseId}:`, error);
    throw error;
  }
};

/**
 * Get course progress
 * @param courseId - The ID of the course to get progress for
 */
export const getCourseProgress = async (courseId: number): Promise<{ progress: number }> => {
  try {
    // In a real app, we'd convert the number ID to a string ID for the DB
    const response = await fetch(`/api/courses/${courseId.toString()}/progress`);
    
    if (!response.ok) {
      throw new Error(`Error fetching course progress: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch progress for course ${courseId}:`, error);
    throw error;
  }
};

/**
 * Get a course by ID
 * @param courseId - The ID of the course to fetch
 */
export const getCourseById = async (courseId: string | number): Promise<EnrolledCourse> => {
  try {
    // In a real app, we'd convert the number ID to a string ID for the DB if needed
    const id = typeof courseId === 'number' ? courseId.toString() : courseId;
    
    const response = await fetch(API_ENDPOINTS.COURSE_DETAIL(id));
    
    if (!response.ok) {
      throw new Error(`Error fetching course details: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // In a real implementation, the backend would return the course data
    // with instructor name and progress information all included
    return data;
  } catch (error) {
    console.error(`Failed to fetch course ${courseId}:`, error);
    throw error;
  }
}; 