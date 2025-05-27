import { getAPI, getAPIAxios, postAPI, postAPIAxios } from "./common";
import axios from "axios";

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

export const listCourses = async (filter?: string) => {
  const url =
    "courses:list?pageSize=20&sort=seq&tree=true&appends[]=file_id&appends[]=cover&page=1";

  try {
    const response = await getAPI(url, null);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const listStudentsByTeacherId = async (teacherId: any) => {
  const url = `students:list?appends[]=avatar&filter={"$and":[{"teacher_id":{"id":{"$eq":${teacherId}}}}]}`;
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
  const url = `assignment:list?appends[]=course_id&appends[]=course_id.parent(recursively%3Dtrue)&filter=${filter}`;
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
  const url = `courses:list?sort=seq&appends[]=cover&tree=true&appends[]=file_id&filter=${filter}`; //&appends[]=children

  try {
    const response = await getAPIAxios(url, null);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const listRecommendedCourseSessions = async () => {
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

export const listCMSByIds = async (ids: number[]) => {
  if (!ids || ids.length === 0) {
    console.error("Error: Missing required parameter 'ids'");
    return Promise.reject("Missing required parameter 'ids'");
  }

  const filter = `{"$and":[{"id":{"$in":${JSON.stringify(ids)}}}]}`;
  const url = `cms:list?sort=seq&appends[]=cover&page=1&filter=${filter}`;

  try {
    const response = await getAPI(url, null);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// 更新学生的拼图进度
export const updateStudentPuzzleProgress = async (
  studentId: number,
  progress: boolean[]
) => {
  const url = `students:update?filterByTk=${studentId}`;
  try {
    const response = await postAPIAxios(url, {
      brick_current_progress: progress,
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// 更新学生的完成数量并重置进度
export const completeStudentPuzzle = async (
  studentId: number,
  completedCount: number
) => {
  const url = `students:update?filterByTk=${studentId}`;
  try {
    const response = await postAPIAxios(url, {
      brick_completed_count: completedCount,
      brick_current_progress: Array(9).fill(false),
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// 更新学生的日历进度
export const updateStudentCalendarProgress = async (
  studentId: number,
  progress: boolean[]
) => {
  const url = `student:update?filterByTk=${studentId}`;
  try {
    const response = await postAPIAxios(url, {
      calendar_current_progress: progress,
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// 更新学生的完成数量并重置进度
export const completeStudentCalendar = async (
  studentId: number,
  completedCount: number
) => {
  const url = `student:update?filterByTk=${studentId}`;
  try {
    const response = await postAPIAxios(url, {
      calendar_completed_count: completedCount,
      calendar_current_progress: Array(31).fill(false),
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createMeeting = async (data: {
  timezone_id: number;
  duration: number;
  meeting_time: string;
  participant_user_id: number;
  host_user_id: number;
  title: string;
  meeting_link: string;
  mark_color: string;
}) => {
  const url = `meetings:create`;
  try {
    const response = await postAPIAxios(url, {
      timezone_id: { id: data.timezone_id },
      duration: data.duration,
      meeting_time: data.meeting_time,
      participant_user_id: { id: data.participant_user_id },
      host_user_id: { id: data.host_user_id },
      title: data.title,
      meeting_link: data.meeting_link,
      mark_color: data.mark_color,
    });
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteMeeting = async (meetingId: number) => {
  const url = `meetings:destroy?filterByTk=${meetingId}`;
  try {
    const response = await postAPIAxios(url, {});
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getCalendar = async (studentId: number) => {
  return getAPIAxios(
    `meetings:list?appends[]=host_user_id&appends[]=participant_user_id.avatar&appends[]=participant_user_id&appends[]=participant_user_id.avatar&appends[]=timezone_id&page=1&filter={"$or":[{"participant_user_id":{"id":{"$eq":${studentId}}}},{"host_user_id":{"id":{"$eq":${studentId}}}}]}`,
    null
  );
};

// export const getUserInfo = async (userId: number) => {
//   return getAPIAxios(`users:get?appends[]=avatar&filterByTk=${userId}`, null);
// };

export const getUserInfoWithSpecialToken = async (userId: number) => {
  return axios.get(
    `${
      import.meta.env.VITE_API_ENDPOINT
    }/users:get?appends[]=avatar&filterByTk=${userId}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SPECIAL_TOKEN}`,
      },
    }
  );
};

// 获取时区列表
export async function getTimezoneList() {
  try {
    const response = await getAPIAxios(
      `dim_timezone:list?pageSize=20&filter=%7B%7D`,
      null
    );
    return response;
  } catch (err) {
    throw err;
  }
}

// 教师注册
export async function postTeacherSignUp(data: any) {
  const SPECIAL_TOKEN = import.meta.env.VITE_SPECIAL_TOKEN;
  const url = `${import.meta.env.VITE_API_ENDPOINT}/teachers:create`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        authorization: `Bearer ${SPECIAL_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
      mode: "cors",
    });
    return res;
  } catch (err) {
    throw err;
  }
}

export const listMessages = async (receiverId?: number) => {
  const filter = receiverId
    ? `{"$and":[{"receiver_id":{"id":{"$eq":${receiverId}}}}]}`
    : "{}";
  const url = `messages:list?pageSize=20&sort=-created_at&appends[]=sender_id&appends[]=receiver_id&filter=${filter}`;

  try {
    const response = await getAPI(url, null);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createMessage = async (data: {
  sender_id: number;
  receiver_id: number;
  content: string;
  title?: string;
}) => {
  const url = `messages:create`;
  try {
    const response = await postAPI(url, data);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateMessage = async (messageId: number) => {
  const url = `messages:update?filterByTk=${messageId}`;
  try {
    const response = await postAPI(url, {
      status: true,
    });
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
