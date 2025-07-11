<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <view class="bg-primary px-4 pt-2 pb-4">
      <view class="flex items-center justify-between">
        <view class="flex items-center gap-3">
          <u-icon name="arrow-left" size="24" color="#fff" @click="goBack"></u-icon>
          <text class="text-white text-lg font-bold">课程分配管理</text>
        </view>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="p-4 bg-white">
      <view class="flex items-center bg-gray-100 rounded-full px-4 py-2">
        <u-icon name="search" size="20" color="#999"></u-icon>
        <input 
          v-model="searchKeyword" 
          placeholder="搜索学生姓名" 
          class="flex-1 ml-2 text-sm outline-none"
        />
      </view>
    </view>

    <!-- 学生列表 -->
    <view class="p-4">
      <view v-if="filteredStudents.length > 0" class="space-y-3">
        <view 
          v-for="student in filteredStudents" 
          :key="student.id"
          class="bg-white rounded-lg p-4 shadow-sm"
        >
          <view class="flex items-center justify-between">
            <view class="flex-1">
              <view class="flex items-center gap-3 mb-2">
                <image 
                  :src="student.avatarUrl" 
                  class="w-12 h-12 rounded-full"
                  mode="aspectFill"
                />
                <view class="flex-1">
                  <text class="text-base font-medium text-gray-800">{{ student.nickname }}</text>
                  <text class="text-sm text-gray-500">ID: {{ student.id }}</text>
                </view>
              </view>
              <view class="flex items-center gap-4 text-sm text-gray-600">
                <text>已分配课程: {{ student.user_courses?.length || 0 }} 门</text>
                <text v-if="student.teacher_id">教师: {{ student.teacher_id.nickname }}</text>
              </view>
            </view>
            <view class="flex items-center gap-2">
              <u-button 
                type="primary" 
                size="small" 
                @click="openCourseModal(student)"
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
        <text class="text-gray-500 block mt-2">暂无学生数据</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { listAllStudents, listCourses, assignCourseToStudent, removeCourseFromStudent, removeAllCoursesFromStudent } from '@/utils/api';

const authStore = useAuthStore();
const searchKeyword = ref('');
const students = ref<any[]>([]);
const courses = ref<any[]>([]);

const filteredStudents = computed(() => {
  if (!searchKeyword.value) return students.value;
  
  const keyword = searchKeyword.value.toLowerCase();
  return students.value.filter(student => 
    student.nickname.toLowerCase().includes(keyword)
  );
});

const goBack = () => {
  uni.navigateBack();
};

const openCourseModal = (student: any) => {
  // 使用原生ActionSheet显示课程管理选项
  showCourseManagementModal(student);
};

const showCourseManagementModal = (student: any) => {
  const options = ['分配新课程', '查看已分配课程'];
  
  uni.showActionSheet({
    itemList: options,
    success: (res) => {
      if (res.tapIndex === 0) {
        // 分配新课程
        showCourseSelectionModal(student);
      } else if (res.tapIndex === 1) {
        // 查看已分配课程
        showAssignedCoursesModal(student);
      }
    }
  });
};

const showCourseSelectionModal = (student: any) => {
  // 获取未分配的课程
  const assignedCourseIds = student.user_courses?.map((course: any) => course.id) || [];
  const availableCourses = courses.value.filter(course => !assignedCourseIds.includes(course.id));
  
  if (availableCourses.length === 0) {
    uni.showToast({ title: '没有可分配的课程', icon: 'none' });
    return;
  }
  
  const courseOptions = availableCourses.map(course => course.name);
  
  uni.showActionSheet({
    itemList: courseOptions,
    success: (res) => {
      const selectedCourse = availableCourses[res.tapIndex];
      handleAssignCourse(student.id, selectedCourse.id);
    }
  });
};

const showAssignedCoursesModal = (student: any) => {
  if (!student.user_courses || student.user_courses.length === 0) {
    uni.showToast({ title: '该学生暂无分配课程', icon: 'none' });
    return;
  }
  
  // 从课程列表中获取课程名称
  const courseOptions = student.user_courses.map((course: any) => {
    const courseInfo = courses.value.find(c => c.id === course.id);
    return courseInfo?.name || '未知课程';
  });
  courseOptions.push('取消所有分配');
  
  uni.showActionSheet({
    itemList: courseOptions,
    success: (res) => {
      if (res.tapIndex === courseOptions.length - 1) {
        // 取消所有分配
        handleRemoveAllCourses(student.id);
      } else {
        // 移除特定课程
        const selectedCourse = student.user_courses[res.tapIndex];
        handleRemoveCourse(student.id, selectedCourse.id);
      }
    }
  });
};

const handleAssignCourse = async (studentId: number, courseId: number) => {
  try {
    await assignCourseToStudent(studentId, courseId);
    uni.showToast({ title: '分配成功', icon: 'success' });
    
    // 重新加载学生数据
    await loadStudents();
  } catch (error) {
    uni.showToast({ title: '分配失败', icon: 'error' });
    console.error('分配课程失败:', error);
  }
};

const handleRemoveCourse = async (studentId: number, courseId: number) => {
  try {
    await removeCourseFromStudent(studentId, courseId);
    uni.showToast({ title: '移除成功', icon: 'success' });
    
    // 重新加载学生数据
    await loadStudents();
  } catch (error) {
    uni.showToast({ title: '移除失败', icon: 'error' });
    console.error('移除课程失败:', error);
  }
};

const handleRemoveAllCourses = async (studentId: number) => {
  try {
    await removeAllCoursesFromStudent(studentId);
    uni.showToast({ title: '移除成功', icon: 'success' });
    
    // 重新加载学生数据
    await loadStudents();
  } catch (error) {
    uni.showToast({ title: '移除失败', icon: 'error' });
    console.error('移除所有课程失败:', error);
  }
};

const loadStudents = async () => {
  try {
    const res: any = await listAllStudents();
    students.value = res.data.map((student: any) => ({
      ...student,
      avatarUrl:
        import.meta.env.VITE_BUCKET_ENDPOINT +
        (student.avatar?.[0]?.url || "https://via.placeholder.com/50"),
    }));
  } catch (error) {
    console.error('加载学生数据失败:', error);
    uni.showToast({ title: '加载学生数据失败', icon: 'none' });
  }
};

const loadCourses = async () => {
  try {
    const res: any = await listCourses();
    courses.value = res.data || [];
  } catch (error) {
    console.error('加载课程数据失败:', error);
  }
};

onMounted(async () => {
  if (!authStore.roles.includes("admin")) {
    uni.showToast({ title: "无权限访问", icon: "none" });
    setTimeout(() => {
      uni.switchTab({ url: "/pages/my/index" });
    }, 1000);
    return;
  }
  
  await Promise.all([loadStudents(), loadCourses()]);
});
</script>

<style scoped>
/* 可以添加自定义样式 */
</style> 