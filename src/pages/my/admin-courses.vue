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
              <view v-if="student.user_courses && student.user_courses.length > 0" class="mt-2">
                <text class="text-xs text-gray-500">
                  {{ getCourseSummary(student.user_courses) }}
                </text>
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
import { listAllStudents, listParentCourses, listChildCourses, assignCourseToStudent, removeCourseFromStudent, removeAllCoursesFromStudent } from '@/utils/api';

const authStore = useAuthStore();
const searchKeyword = ref('');
const students = ref<any[]>([]);
const parentCourses = ref<any[]>([]);
const childCourses = ref<any[]>([]);

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
  console.log('显示课程管理选项，学生ID:', student.id);
  
  const options = ['分配新课程', '查看已分配课程'];
  
  uni.showActionSheet({
    itemList: options,
    success: (res) => {
      console.log('用户选择了选项:', res.tapIndex, options[res.tapIndex]);
      
      if (res.tapIndex === 0) {
        // 分配新课程 - 每次都从父级课程开始
        console.log('开始分配新课程流程');
        setTimeout(() => {
          showParentCourseSelection(student);
        }, 100); // 添加小延迟确保ActionSheet完全关闭
      } else if (res.tapIndex === 1) {
        // 查看已分配课程
        console.log('开始查看已分配课程流程');
        setTimeout(() => {
          showAssignedCoursesModal(student);
        }, 100);
      }
    },
    fail: (err) => {
      console.log('ActionSheet失败:', err);
    }
  });
};



const showParentCourseSelection = (student: any) => {
  console.log('显示父级课程选择，父级课程数量:', parentCourses.value.length);
  
  const parentOptions = parentCourses.value.map(course => course.name);
  console.log('父级课程选项:', parentOptions);
  
  uni.showActionSheet({
    itemList: parentOptions,
    success: (res) => {
      console.log('用户选择了父级课程:', res.tapIndex, parentOptions[res.tapIndex]);
      
      const selectedParent = parentCourses.value[res.tapIndex];
      console.log('选中的父级课程:', selectedParent);
      
      setTimeout(() => {
        showChildCourseSelection(student, selectedParent);
      }, 100);
    },
    fail: (err) => {
      console.log('父级课程选择失败:', err);
    }
  });
};

const showChildCourseSelection = async (student: any, parentCourse: any) => {
  console.log('开始获取子课程，父级课程:', parentCourse.name, 'ID:', parentCourse.id);
  
  try {
    // 获取该父级课程下的所有子课程
    const response = await listChildCourses(parentCourse.id);
    const allChildCourses = response.data || [];
    console.log('获取到的所有子课程:', allChildCourses.length, '门');
    
    // 过滤掉已分配的课程
    const assignedCourseIds = student.user_courses?.map((course: any) => course.id) || [];
    console.log('学生已分配的课程ID:', assignedCourseIds);
    
    const availableChildCourses = allChildCourses.filter(course => !assignedCourseIds.includes(course.id));
    console.log('可分配的子课程:', availableChildCourses.length, '门');
    
    if (availableChildCourses.length === 0) {
      uni.showToast({ title: `${parentCourse.name}下没有可分配的课程`, icon: 'none' });
      return;
    }
    
    const childOptions = availableChildCourses.map(course => course.name);
    console.log('子课程选项:', childOptions);
    
    uni.showActionSheet({
      itemList: childOptions,
      success: (res) => {
        console.log('用户选择了子课程:', res.tapIndex, childOptions[res.tapIndex]);
        
        const selectedChild = availableChildCourses[res.tapIndex];
        console.log('选中的子课程:', selectedChild);
        
        handleAssignCourse(student.id, selectedChild.id);
      },
      fail: (err) => {
        console.log('子课程选择失败:', err);
      }
    });
  } catch (error) {
    console.error('获取子课程失败:', error);
    uni.showToast({ title: '获取课程列表失败', icon: 'none' });
  }
};

const showAssignedCoursesModal = (student: any) => {
  if (!student.user_courses || student.user_courses.length === 0) {
    uni.showToast({ title: '该学生暂无分配课程', icon: 'none' });
    return;
  }
  
  // 显示已分配课程的父级分类
  showAssignedParentCourses(student);
};

const showAssignedParentCourses = (student: any) => {
  // 获取已分配课程的父级分类
  const assignedParentIds = new Set();
  student.user_courses.forEach((course: any) => {
    // 这里需要根据课程ID找到对应的父级课程
    // 暂时使用简单的显示方式
    assignedParentIds.add(course.parentId || '其他');
  });
  
  const parentOptions = parentCourses.value
    .filter(parent => assignedParentIds.has(parent.id))
    .map(parent => parent.name);
  
  if (parentOptions.length === 0) {
    // 如果没有找到父级分类，直接显示所有已分配课程
    showAllAssignedCourses(student);
    return;
  }
  
  parentOptions.push('查看所有已分配课程');
  parentOptions.push('取消所有分配');
  
  uni.showActionSheet({
    itemList: parentOptions,
    success: (res) => {
      if (res.tapIndex === parentOptions.length - 1) {
        // 取消所有分配
        handleRemoveAllCourses(student.id);
      } else if (res.tapIndex === parentOptions.length - 2) {
        // 查看所有已分配课程
        showAllAssignedCourses(student);
      } else {
        // 查看特定父级下的已分配课程
        const selectedParent = parentCourses.value.find(p => p.name === parentOptions[res.tapIndex]);
        if (selectedParent) {
          showAssignedChildCourses(student, selectedParent);
        }
      }
    }
  });
};

const showAssignedChildCourses = async (student: any, parentCourse: any) => {
  try {
    // 获取该父级课程下的所有子课程
    const response = await listChildCourses(parentCourse.id);
    const allChildCourses = response.data || [];
    
    // 过滤出已分配的课程
    const assignedCourseIds = student.user_courses?.map((course: any) => course.id) || [];
    const assignedChildCourses = allChildCourses.filter(course => assignedCourseIds.includes(course.id));
    
    if (assignedChildCourses.length === 0) {
      uni.showToast({ title: `${parentCourse.name}下没有已分配的课程`, icon: 'none' });
      return;
    }
    
    const childOptions = assignedChildCourses.map(course => course.name);
    childOptions.push('取消所有分配');
    
    uni.showActionSheet({
      itemList: childOptions,
      success: (res) => {
        if (res.tapIndex === childOptions.length - 1) {
          // 取消所有分配
          handleRemoveAllCourses(student.id);
        } else {
          // 移除特定课程
          const selectedChild = assignedChildCourses[res.tapIndex];
          handleRemoveCourse(student.id, selectedChild.id);
        }
      }
    });
  } catch (error) {
    console.error('获取子课程失败:', error);
    uni.showToast({ title: '获取课程列表失败', icon: 'none' });
  }
};

const showAllAssignedCourses = (student: any) => {
  const courseOptions = student.user_courses.map((course: any) => course.name || '未知课程');
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
  
  // 简化显示：只显示课程数量
  return `共${userCourses.length}门课程`;
};

onMounted(async () => {
  if (!authStore.roles.includes("admin")) {
    uni.showToast({ title: "无权限访问", icon: "none" });
    setTimeout(() => {
      uni.switchTab({ url: "/pages/my/index" });
    }, 1000);
    return;
  }
  
  await Promise.all([loadStudents(), loadParentCourses()]);
});
</script>

<style scoped>
/* 可以添加自定义样式 */
</style> 