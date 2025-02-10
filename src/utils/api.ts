import { getAPI, getAPIAxios, postAPI, postAPIAxios } from "./common";

export const listCourseSessions = async () => {
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

export const listAssignmentsByCourseId = async (id: any) => {
  const filter = `{"$and":[{"course_id":{"id":{"$eq":${id}}}}]}`;
  const url = `assignment:list?appends[]=course_id&appends[]=course_id.parent(recursively%3Dtrue)&&${filter}`;
  try {
    const response = await getAPI(url, null);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getCourseSessionsById = async (id: any) => {
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
export const listCourseProgressByUserIdAndSessionId = async (
  userId: any,
  courseSesssionId: any
) => {
  const filter = `{"$and":[{"user_id":{"id":{"$eq":${userId}}}},{"course_session_id":{"id":{"$eq":${courseSesssionId}}}}]}`;
  const url = `course_progress:list?pageSize=20&appends[]=course_id&appends[]=user_id&appends[]=course_session_id&page=1&filter=${filter}`;
  try {
    const response = await getAPIAxios(url, null);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createCourseProgress = async (data: any) => {
  const url = `course_progress:create`;
  try {
    const response = await postAPIAxios(url, data);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const listCourseById = async (id: any) => {
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

export const list_recommended_course_sessions = async () => {
  const url = `recommended_course_sessions:list?&sort=seq&appends[]=course_session_id&appends[]=course_session_id.cover&appends[]=course_session_id.teacher_id&appends[]=course_session_id.teacher_id.avatar`; //&appends[]=children

  try {
    const response = await getAPIAxios(url, null);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const listSessionUsersBySessionId = async (id: any) => {
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

export const listAssignmentSubmission = async ({
  userId,
  courseSessionId,
}: any) => {
  const filter = `{"$and":[{"user_id":{"id":{"$eq":${userId}}}},{"course_session_id":{"id":{"$eq":${courseSessionId}}}}]}`;
  const url = `assignment_submission:list?&appends[]=attachment&filter=${filter}`; //&appends[]=children

  try {
    const response = await getAPIAxios(url, null);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const createAssignmentSubmission = async ({
  userId,
  courseSessionId,
  assignmentId,
  content,
  attachments,
}: any) => {
  const url = `assignment_submission:create`;
  try {
    const response = await postAPIAxios(url, {
      user_id: { id: userId },
      course_session_id: { id: courseSessionId },
      assignment_id: { id: assignmentId },
      content,
      attachment: attachments.map(({ id }: any) => ({ id })),
    });
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
