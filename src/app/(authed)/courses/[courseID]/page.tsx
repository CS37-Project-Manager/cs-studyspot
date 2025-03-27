"use client";
import BackToPage from "@/components/BackToPage";
import ChapterSelected from "@/components/ChapterSelected";
import MaterialsDetail from "@/components/MaterialsDetail";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Course } from "@/types/course";
import { Enrolled } from "@/types/enrolled";
import { Material } from "@/types/material";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/providers/SessionProvider";
import { Chapter } from "@/types/chapter";
import { useParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";

export default function CoursePage() {
  const [isOverview, setIsOverview] = useState(true);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  // const [currentChapter, setCurrentChapter] = useState(1);
  const { courseID } = useParams();
  const api = useApi();
  const { user } = useSession();
  const queryClient = useQueryClient();
  console.log(user);

  const videoRef = useRef<HTMLVideoElement>(null);

  const joinCourse = useMutation({
    mutationFn: async () => {
      await api.post(`/v1/attend/enroll`, {
        user_id: user.id,
        course_id: courseID,
      });
    },
  });

  const getAllCourseOfUser = useQuery({
    queryKey: ["user-courses", user.id],
    queryFn: async () => {
      const res = await api.get<Enrolled>(`/v1/attend/user/${user.id}`);
      return res.data;
    },
  });

  const getAllChapterInCourse = useQuery({
    queryKey: ["chapters", courseID],
    queryFn: async () => {
      const res = await api.get<{ chapters: Chapter[] }>(
        `/v1/chapters/course/${courseID}`
      );
      return res.data.chapters;
    },
  });

  const getAllMaterialInChapter = useQuery({
    queryKey: ["material-chapter", activeChapter],
    queryFn: async () => {
      const res = await api.get<{ materials: Material[] }>(
        `/v1/materials/${activeChapter?.id}`
      );
      return res.data.materials;
    },
  });

  const {data:course} = useQuery({
    queryKey: ["user-course"],
    queryFn: async () => {
      const res = await api.get<Course>(`/v1/student/courses/${courseID}`);
      return res.data;
    },
  });

  const createProgress = useMutation({
    mutationFn: async () => {
      await api.post<number>("/v1/progress/", {
        userId: user.id,
        courseId: courseID,
        chapterId: activeChapter?.id,
      });
    },
  });

  const updateProgress = useMutation({
    mutationFn: async () => {
      await api.patch(`/v1/progress`, {
        userId: user.id,
        chapterId: activeChapter?.id,
        status: true,
      })
    }
  })

  useEffect(() => {
    if (getAllChapterInCourse.data === undefined) return;
    else if (getAllChapterInCourse.data.length === 0) return;
    setActiveChapter(getAllChapterInCourse.data[0]);
  }, [getAllChapterInCourse.data]);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      // Event when the video starts playing
      const handleVideoStart = async (event: Event) => {
        await createProgress.mutateAsync();
      };

      // Event when the video ends
      const handleVideoEnd = async (event: Event) => {
        await updateProgress.mutateAsync();
        queryClient.invalidateQueries({queryKey: ["user-course"], refetchType:"all"})
      };

      // Add event listeners
      video.addEventListener("play", handleVideoStart);
      video.addEventListener("ended", handleVideoEnd);

      // Cleanup event listeners when component unmounts
      return () => {
        video.removeEventListener("play", handleVideoStart);
        video.removeEventListener("ended", handleVideoEnd);
      };
    }
  }, []);

  return (
    <div className="w-screen h-screen p-6 overflow-y-scroll">
      <div className="flex justify-between h-[48px]">
        <BackToPage page="courses" customPath="/courses" />
        <img src={user.profileImage} className="rounded-full border" />
      </div>
      <div className="w-[950px]">
        <div className="flex justify-between w-full items-end">
          <div className="flex gap-8">
            <div>
              <p className="text-sm">Course</p>
              <h6 className="text-lg font-medium">{course?.name}</h6>
            </div>
            <div>
              <p className="text-sm">Teacher</p>
              <h6 className="text-lg font-medium">{course?.teacher}</h6>
            </div>
            <div>
              <p className="text-sm">Chapter</p>
              <h6 className="text-lg font-medium">{course?.chapterCount}</h6>
            </div>
            <div>
              <p className="text-sm">Progress</p>
              <h6 className="text-lg font-medium">{course?.progressPercentage} %</h6>
            </div>
          </div>
          {getAllCourseOfUser.data?.courses.find(
            (course) => course.id === courseID
          ) ? null : (
            <button
              onClick={() => joinCourse.mutate()}
              className="border border-gray-800 shadow-[3px_3px_0px_rgb(31,41,55)] hover:bg-gray-100 rounded-2xl px-6 h-8"
            >
              Join the course
            </button>
          )}
        </div>
      </div>
      <div className="flex w-full mt-5 gap-10">
        <div className="w-[950px]">
          <h4 className="text-2xl font-semibold">{activeChapter?.name}</h4>
          {activeChapter?.video_file === "" ? (
            <div className="mt-2 w-full h-[530px] rounded-lg bg-gray-100"></div>
          ) : (
            <video
              className="w-full h-[530px] rounded-lg mt-2"
              ref={videoRef}
              controls
              src={activeChapter?.video_file}
            ></video>
          )}
          <div className="flex mt-4 gap-5">
            <button
              onClick={() => setIsOverview(true)}
              className={`text-xl px-4 py-1 rounded-2xl border border-gray-800 hover:bg-gray-100 hover:font-medium ${
                isOverview
                  ? "shadow-[3px_3px_0px_rgb(31,41,55)] bg-gray-100 font-medium translate-colors"
                  : ""
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setIsOverview(false)}
              className={`text-xl px-4 py-1 rounded-2xl border border-gray-800 hover:bg-gray-100 hover:font-medium ${
                isOverview
                  ? ""
                  : "shadow-[3px_3px_0px_rgb(31,41,55)] bg-gray-100 font-medium translate-colors"
              }`}
            >
              Materials
            </button>
          </div>
          <div className="border rounded-2xl mt-4 p-4">
            <h4 className="text-2xl font-medium">{`${
              isOverview ? "Course Detail" : "Materials"
            }`}</h4>
            <div
              className={`mt-4 w-full min-h-44 ${
                isOverview ? "" : "grid grid-cols-6 content-center gap-2"
              }`}
            >
              {isOverview ? (
                <p className="">{course?.description}</p>
              ) : (
                getAllMaterialInChapter.data?.map((material) => (
                  <MaterialsDetail key={material.id} name={material.file} />
                ))
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <h4 className="text-2xl">Chapters</h4>
          {getAllChapterInCourse.data?.map((chapter) => (
            <ChapterSelected
              key={chapter.id}
              name={chapter.name}
              isActive={chapter.id === activeChapter?.id}
              onClick={() => setActiveChapter(chapter)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
