import { NextRequest, NextResponse } from 'next/server';
import { EnrolledCourse } from '@/app/(authed)/courses/types';

// Mock data for a specific course
const mockCourseDetails = (id: string): EnrolledCourse => ({
  id: parseInt(id),
  title: "Project Manager",
  instructor: "Thirawat Kui",
  progress: 78,
  imageUrl: "/images/course-placeholder.svg",
});

/**
 * GET handler for course details
 * 
 * This is a placeholder API route for the backend team to implement.
 * It should return the details of a specific course.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  // In a real implementation, this would:
  // 1. Authenticate the user
  // 2. Check if the user is enrolled in this course
  // 3. Query the database for the course details
  // 4. Return the course details with progress information
  
  // For now, return mock data
  return NextResponse.json(mockCourseDetails(id));
} 