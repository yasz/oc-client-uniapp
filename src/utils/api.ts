import {
  getAPI,
  getAPIAxios,
  postAPI,
  postAPIAxios,
  postPulicAPIAxios,
} from "./http";
import axios from "axios";

export const listAssignments = async (params: any = {}) => {
  return await getAPIAxios("assignment:list", {
    pageSize: 20,
    "appends[]": ["course_id", "course_id.parent(recursively=true)"],
    filter: params.filter || {},
  });
};

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
export const getCourseById = async (id: any) => {
  if (!id) {
    console.error("Error: Missing required parameter 'id'");
    return Promise.reject("Missing required parameter 'id'");
  }

  const url = `courses:get?filterByTk=${id}&appends[]=cover&appends[]=cover_content&appends[]=file_id`;

  try {
    const response = await getAPIAxios(url, null);
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

export const createMeeting = async (data: any) => {
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
    `meetings:list?appends[]=host_user_id&appends[]=host_user_id.avatar&appends[]=participant_user_id.avatar&appends[]=participant_user_id&appends[]=participant_user_id.avatar&appends[]=timezone_id&page=1&filter={"$or":[{"participant_user_id":{"id":{"$eq":${studentId}}}},{"host_user_id":{"id":{"$eq":${studentId}}}}]}`,
    null
  );
};


export const listAllStudents = async () => {
  const url = `students:list?appends[]=avatar&appends[]=teacher_id&appends[]=teacher_id.avatar&appends[]=user_courses&page=1`;
  try {
    const response = await getAPI(url, null);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};
export const listAllTeachers = async () => {
  const url = `teachers:list?appends[]=avatar`;
  try {
    const response = await getAPI(url, null);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const associateStudentTeacher = async (studentId: number, teacherId: number | null) => {
  const url = `students:update?filterByTk=${studentId}`;
  try {
    const response = await postAPIAxios(url, {
      teacher_id: teacherId ? { id: teacherId } : null
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getUserInfoWithSpecialToken = async (userId: number) => {
  return axios.get(
    `${
      import.meta.env.VITE_API_ENDPOINT
    }/users:get?appends[]=avatar&appends[]=user_courses&filterByTk=${userId}`,
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
      `dim_timezone:list?pageSize=50&filter=%7B%7D`,
      null
    );
    return response;
  } catch (err) {
    throw err;
  }
}

// 教师注册
export async function signUpTeacher(data: any) {
  const url = `teachers:create`;
  try {
    const res = await postPulicAPIAxios(url, data);
    return res;
  } catch (err) {
    throw err;
  }
}
export async function signUpStudent(data: any) {
  const url = `students:create`;
  try {
    const res = await postPulicAPIAxios(url, data);
    return res;
  } catch (err) {
    throw err;
  }
}

// 更新教师信息
export async function updateTeacher(teacherId: number, data: any) {
  const url = `teachers:update?filterByTk=${teacherId}`;
  try {
    const res = await postAPIAxios(url, data);
    return res;
  } catch (err) {
    throw err;
  }
}

// 更新学生信息
export async function updateStudent(studentId: number, data: any) {
  const url = `students:update?filterByTk=${studentId}`;
  try {
    const res = await postAPIAxios(url, data);
    return res;
  } catch (err) {
    throw err;
  }
}

export const listMessages = async (receiverId?: number) => {
  const filter = receiverId
    ? `{"$and":[
    {"receiver_id":{"id":{"$eq":${receiverId}}} }
    ,{"is_hidden":{"$isFalsy":true}}
    ]}`
    : "{}";
  const url = `messages:list?pageSize=20&sort=-createdAt&appends[]=sender_id&appends[]=receiver_id&filter=${filter}`;

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
  sender_id: string | number;
  receiver_id: string | number;
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

// 删除消息（将is_hidden设置为true）
export const deleteMessage = async (messageId: number) => {
  const url = `messages:update?filterByTk=${messageId}`;
  try {
    const response = await postAPI(url, {
      is_hidden: true,
    });
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export async function resetPassword(data: {
  username: string;
  email: string;
  password: string;
}) {
  const url = `log_reset_password:create`;
  try {
    const res = await postPulicAPIAxios(url, data);
    return res;
  } catch (err) {
    throw err;
  }
}

// 课程收藏相关API
export const listCourseFavorites = async (userId: number) => {
  const filter = `{"$and":[{"user_id":{"id":{"$eq":${userId}}}}]}`;
  const url = `course_favorite:list?appends[]=user_id&appends[]=course_id.cover&appends[]=course_id&appends[]=course_id.parent(recursively%3Dtrue)&page=1&filter=${filter}`;
  try {
    const response = await getAPI(url, null);
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createCourseFavorite = async (
  userId: number,
  courseId: number
) => {
  const url = `course_favorite:create`;
  try {
    const response = await postAPIAxios(url, {
      user_id: { id: userId },
      course_id: { id: courseId },
    });
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteCourseFavorite = async (
  userId: number,
  courseId: number
) => {
  const filter = `{"$and":[{"user_id":{"id":{"$eq":${userId}}}},{"course_id":{"id":{"$eq":${courseId}}}}]}`;
  const url = `course_favorite:destroy?filter=${filter}`;
  try {
    const response = await postAPIAxios(url, {});
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// 同步网盘内容到课程
export async function syncCourseFromCDN(courseId: number, coursePath: string) {
  try {
    // 1. 通过后端API获取指定路径的COS数据
    const apiUrl = `https://praise.site/api/oa-cos?path=${encodeURIComponent(
      coursePath
    )}`;
    console.log("Fetching COS data from API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const apiResult = await response.json();
    console.log("API response received successfully");

    // 2. 检查API响应格式
    if (!apiResult.success || !apiResult.data) {
      throw new Error("API返回数据格式错误");
    }

    const cosData = apiResult.data;
    const contents = cosData.Contents || [];

    console.log(`Found ${contents.length} items for path: ${coursePath}`);

    // 3. 直接将JSON数据转换为字符串存储
    // 不再转换为XML，直接存储JSON格式的数据
    const jsonContent = JSON.stringify(cosData, null, 2);

    // 4. 更新数据库中的cos_xml字段（虽然字段名是cos_xml，但现在存储JSON）
    const updateUrl = `courses:update?filterByTk=${courseId}`;
    const updateResponse = await postAPIAxios(updateUrl, {
      cos_xml: jsonContent,
    });

    return updateResponse;
  } catch (error) {
    console.error("同步网盘失败:", error);
    throw error;
  }
}

// 课程分配相关API - 通过学生表管理
export const assignCourseToStudent = async (studentId: number, courseId: number) => {
  const url = `students:update?filterByTk=${studentId}`;
  try {
    // 先获取当前学生的课程列表
    const currentStudent = await getAPIAxios(`students:get?filterByTk=${studentId}&appends[]=user_courses`, null);
    const currentCourses = currentStudent.data.user_courses || [];
    
    // 检查课程是否已经分配
    const isAlreadyAssigned = currentCourses.some((course: any) => course.id === courseId);
    if (isAlreadyAssigned) {
      throw new Error('课程已经分配给该学生');
    }
    
    // 添加新课程到列表
    const updatedCourses = [...currentCourses, { id: courseId }];
    
    const response = await postAPIAxios(url, {
      user_courses: updatedCourses
    });
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const removeCourseFromStudent = async (studentId: number, courseId: number) => {
  const url = `students:update?filterByTk=${studentId}`;
  try {
    // 先获取当前学生的课程列表
    const currentStudent = await getAPIAxios(`students:get?filterByTk=${studentId}&appends[]=user_courses`, null);
    const currentCourses = currentStudent.data.user_courses || [];
    
    // 移除指定课程
    const updatedCourses = currentCourses.filter((course: any) => course.id !== courseId);
    
    const response = await postAPIAxios(url, {
      user_courses: updatedCourses
    });
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const removeAllCoursesFromStudent = async (studentId: number) => {
  const url = `students:update?filterByTk=${studentId}`;
  try {
    const response = await postAPIAxios(url, {
      user_courses: []
    });
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// 获取所有可分配的子课程
export const listAssignableCourses = async () => {
  try {
    // 获取所有课程（包含树形结构）
    const allCoursesResponse = await getAPIAxios(
      "courses:list?pageSize=100&sort=seq&tree=true&appends[]=file_id&appends[]=cover&page=1",
      null
    );
    
    const allCourses = allCoursesResponse.data || [];
    
    // 过滤出子课程（有parentId的课程）
    const childCourses = allCourses.filter((course: any) => course.parentId);
    
    // 为每个子课程添加父级信息
    const coursesWithParent = childCourses.map((course: any) => {
      const parent = allCourses.find((c: any) => c.id === course.parentId);
      return {
        ...course,
        parentName: parent?.name || '未知分类'
      };
    });
    
    return {
      data: coursesWithParent
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// 获取所有父级课程
export const listParentCourses = async () => {
  try {
    const response = await getAPIAxios(
      "courses:list?pageSize=50&sort=seq&tree=true&appends[]=file_id&appends[]=cover&page=1",
      null
    );
    
    const allCourses = response.data || [];
    
    // 过滤出父级课程（没有parentId的课程）
    const parentCourses = allCourses.filter((course: any) => !course.parentId);
    
    return {
      data: parentCourses
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// 获取指定父级课程下的子课程
export const listChildCourses = async (parentId: number) => {
  try {
    const filter = `{"parentId":{"$eq":${parentId}}}`;
    const response = await getAPIAxios(
      `courses:list?pageSize=50&sort=seq&appends[]=file_id&appends[]=cover&filter=${filter}`,
      null
    );
    
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

