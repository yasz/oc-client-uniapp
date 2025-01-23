import { getAPI, postAPI } from "./common";

export const fetchCourseSessions = async () => {
  const url =
    "course_sessions:list?pageSize=20&appends[]=teacher_id&appends[]=teacher_id.avater&appends[]=course_id&appends[]=course_id.parent(recursively%3Dtrue)&appends[]=subject_id&appends[]=cover&filter=%7B%7D";

  try {
    const response = await getAPI(url, null);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};
export const fetchCourseSessionsById = async (id: any) => {
  if (!id) {
    console.error("Error: Missing required parameter 'id'");
    return Promise.reject("Missing required parameter 'id'");
  }

  const url = `course_sessions:get?filterByTk=${id}&appends[]=cover&appends[]=course_id&appends[]=course_id.parent(recursively%3Dtrue)&appends[]=subject_id&appends[]=teacher_id&appends[]=teacher_id.avater`;

  try {
    const response = await getAPI(url, null);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
