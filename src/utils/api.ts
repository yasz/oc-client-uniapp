import { getAPI, getAPIAxios, postAPI } from "./common";

export const fetchCourseSessions = async () => {
  const url =
    "course_sessions:list?pageSize=20&appends[]=teacher_id&appends[]=teacher_id.avatar&appends[]=course_id&appends[]=course_id.parent(recursively%3Dtrue)&appends[]=subject_id&appends[]=cover&filter=%7B%7D";

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

  const url = `course_sessions:get?filterByTk=${id}&appends[]=cover&appends[]=course_id&appends[]=course_id.parent(recursively%3Dtrue)&appends[]=subject_id&appends[]=teacher_id&appends[]=teacher_id.avatar`;

  try {
    const response = await getAPI(url, null);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const fetchCourseById = async (id: any) => {
  if (!id) {
    console.error("Error: Missing required parameter 'id'");
    return Promise.reject("Missing required parameter 'id'");
  }

  const filter = `{"$or":[{"parentId":{"$eq":${id}}},{"parent":{"parentId":{"$eq":${id}}}},{"parent":{"parent":{"parentId":{"$eq":${id}}}}}]}`;
  const url = `courses:list?sort=seq&tree=true&appends[]=file_id&filter=${filter}`; //&appends[]=children

  try {
    const response = await getAPIAxios(url, null);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const fetchSessionUsersBySessionId = async (id: any) => {
  if (!id) {
    console.error("Error: Missing required parameter 'id'");
    return Promise.reject("Missing required parameter 'id'");
  }
  const filter = `{"$and":[{"fk_course_session_id":{"$eq":${id}}}]}`;
  const url = `user_registrations:list?appends[]=user_id&appends[]=user_id.avatar&filter=${filter}`; //&appends[]=children

  try {
    const response = await getAPIAxios(url, null);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
