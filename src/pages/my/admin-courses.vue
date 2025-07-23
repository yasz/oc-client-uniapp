<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <view class="bg-primary px-4 pt-2 pb-4">
      <view class="flex items-center justify-center">
        <text class="text-white text-lg font-bold">课程分配管理</text>
      </view>
    </view>

    <!-- 切换栏 -->
    <view class="flex bg-white">
      <view 
        class="flex-1 text-center py-3 text-base font-medium"
        :class="activeTab === 'students' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'"
        @click="activeTab = 'students'"
      >
        学生
      </view>
      <view 
        class="flex-1 text-center py-3 text-base font-medium"
        :class="activeTab === 'teachers' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'"
        @click="activeTab = 'teachers'"
      >
        教师
      </view>
    </view>

    <!-- 用户列表 -->
    <view class="p-4">
      <view v-if="currentUserList.length > 0" class="space-y-3">
        <view 
          v-for="user in currentUserList" 
          :key="user.id"
          class="bg-white rounded-lg p-4 shadow-sm"
        >
          <view class="flex items-center justify-between">
            <view class="flex-1">
              <view class="flex items-center gap-3 mb-2">
                <image 
                  :src="user.avatarUrl" 
                  class="w-12 h-12 rounded-full"
                  mode="aspectFill"
                />
                <view class="flex-1">
                  <text class="text-base font-medium text-gray-800">{{ user.nickname }}</text>
                 
                  <text class="text-sm text-gray-500"> ({{ user.username }})</text>
                </view>
              </view>
              <view class="flex items-center gap-4 text-sm text-gray-600">
                <text>已分配课程: {{ user.user_courses?.length || 0 }} 门</text>
                <text v-if="user.teacher_id && activeTab === 'students'">教师: {{ user.teacher_id.nickname }}</text>
              </view>
              <view v-if="user.user_courses && user.user_courses.length > 0" class="mt-2">
                <text class="text-xs text-gray-500">
                  {{ getCourseSummary(user.user_courses) }}
                </text>
              </view>
            </view>
            <view class="flex items-center gap-2">
              <u-button 
                type="primary" 
                size="small" 
                @click="openCourseModal(user)"
              >
                管理课程
              </u-button>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="text-center py-8">
        <u-icon name="user" size="60" color="#ccc"></u-icon>
        <text class="text-gray-500 block mt-2">暂无{{ activeTab === 'students' ? '学生' : '教师' }}数据</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { 
  listAllStudents, 
  listAllTeachers, 
  listParentCourses, 
  listChildCourses, 
  assignCourseToStudent, 
  removeCourseFromStudent, 
  removeAllCoursesFromStudent,
  assignCourseToTeacher,
  removeCourseFromTeacher,
  removeAllCoursesFromTeacher
} from '@/utils/api';

const authStore = useAuthStore();
const activeTab = ref('students'); // 'students' or 'teachers'
const students = ref<any[]>([]);
const teachers = ref<any[]>([]);
const parentCourses = ref<any[]>([]);

const currentUserList = computed(() => {
  return activeTab.value === 'students' ? students.value : teachers.value;
});

const openCourseModal = (user: any) => {
  showCourseManagementModal(user);
};

const showCourseManagementModal = (user: any) => {
  const options = ['分配新课程', '查看已分配课程'];
  
  uni.showActionSheet({
    itemList: options,
    success: (res) => {
      if (res.tapIndex === 0) {
        setTimeout(() => showParentCourseSelection(user), 100);
      } else if (res.tapIndex === 1) {
        setTimeout(() => showAssignedCoursesModal(user), 100);
      }
    }
  });
};

const showParentCourseSelection = (user: any) => {
  const parentOptions = parentCourses.value.map(course => course.name);
  
  uni.showActionSheet({
    itemList: parentOptions,
    success: (res) => {
      const selectedParent = parentCourses.value[res.tapIndex];
      setTimeout(() => showChildCourseSelection(user, selectedParent), 100);
    }
  });
};

const showChildCourseSelection = async (user: any, parentCourse: any) => {
  try {
    const response = await listChildCourses(parentCourse.id);
    const allChildCourses = response.data || [];
    const assignedCourseIds = user.user_courses?.map((c: any) => c.id) || [];
    const availableChildCourses = allChildCourses.filter(c => !assignedCourseIds.includes(c.id));
    
    if (availableChildCourses.length === 0) {
      uni.showToast({ title: `${parentCourse.name}下没有可分配的课程`, icon: 'none' });
      return;
    }
    
    const childOptions = availableChildCourses.map(c => c.name);
    uni.showActionSheet({
      itemList: childOptions,
      success: (res) => {
        const selectedChild = availableChildCourses[res.tapIndex];
        handleAssignCourse(user.id, selectedChild.id);
      }
    });
  } catch (error) {
    console.error('获取子课程失败:', error);
    uni.showToast({ title: '获取课程列表失败', icon: 'none' });
  }
};

const showAssignedCoursesModal = (user: any) => {
  if (!user.user_courses || user.user_courses.length === 0) {
    uni.showToast({ title: '该用户暂无分配课程', icon: 'none' });
    return;
  }
  showAllAssignedCourses(user);
};

const showAllAssignedCourses = (user: any) => {
  const courseOptions = user.user_courses.map((c: any) => c.name || '未知课程');
  courseOptions.push('取消所有分配');
  
  uni.showActionSheet({
    itemList: courseOptions,
    success: (res) => {
      if (res.tapIndex === courseOptions.length - 1) {
        handleRemoveAllCourses(user.id);
      } else {
        const selectedCourse = user.user_courses[res.tapIndex];
        handleRemoveCourse(user.id, selectedCourse.id);
      }
    }
  });
};

const handleAssignCourse = async (userId: number, courseId: number) => {
  try {
    if (activeTab.value === 'students') {
      await assignCourseToStudent(userId, courseId);
    } else {
      await assignCourseToTeacher(userId, courseId);
    }
    uni.showToast({ title: '分配成功', icon: 'success' });
    await loadData();
  } catch (error) {
    uni.showToast({ title: '分配失败', icon: 'error' });
    console.error('分配课程失败:', error);
  }
};

const handleRemoveCourse = async (userId: number, courseId: number) => {
  try {
    if (activeTab.value === 'students') {
      await removeCourseFromStudent(userId, courseId);
    } else {
      await removeCourseFromTeacher(userId, courseId);
    }
    uni.showToast({ title: '移除成功', icon: 'success' });
    await loadData();
  } catch (error) {
    uni.showToast({ title: '移除失败', icon: 'error' });
    console.error('移除课程失败:', error);
  }
};

const handleRemoveAllCourses = async (userId: number) => {
  try {
    if (activeTab.value === 'students') {
      await removeAllCoursesFromStudent(userId);
    } else {
      await removeAllCoursesFromTeacher(userId);
    }
    uni.showToast({ title: '移除成功', icon: 'success' });
    await loadData();
  } catch (error) {
    uni.showToast({ title: '移除失败', icon: 'error' });
    console.error('移除所有课程失败:', error);
  }
};

const loadData = async () => {
  if (activeTab.value === 'students') {
    await loadStudents();
  } else {
    await loadTeachers();
  }
};

const loadStudents = async () => {
  try {
    const res: any = await listAllStudents();
    students.value = res.data.map((s: any) => ({
      ...s,
      avatarUrl: import.meta.env.VITE_BUCKET_ENDPOINT + (s.avatar?.[0]?.url || "https://via.placeholder.com/50"),
    }));
  } catch (error) {
    console.error('加载学生数据失败:', error);
  }
};

const loadTeachers = async () => {
  try {
    const res: any = await listAllTeachers();
    teachers.value = res.data.map((t: any) => ({
      ...t,
      avatarUrl: import.meta.env.VITE_BUCKET_ENDPOINT + (t.avatar?.[0]?.url || "https://via.placeholder.com/50"),
    }));
  } catch (error) {
    console.error('加载教师数据失败:', error);
  }
};

const loadParentCourses = async () => {
  try {
    const res: any = await listParentCourses();
    parentCourses.value = res.data || [];
  } catch (error) {
    console.error('加载父级课程数据失败:', error);
  }
};

const getCourseSummary = (userCourses: any[]) => {
  if (!userCourses || userCourses.length === 0) return '';
  return `共${userCourses.length}门课程`;
};

onMounted(async () => {
  if (!authStore.roles.includes("admin")) {
    uni.showToast({ title: "无权限访问", icon: "none" });
    setTimeout(() => uni.switchTab({ url: "/pages/my/index" }), 1000);
    return;
  }
  
  await Promise.all([loadStudents(), loadTeachers(), loadParentCourses()]);
});
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
 