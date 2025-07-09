<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <view class="bg-primary px-4 pt-2 pb-4">
      <view class="flex items-center justify-between">
        <view class="flex items-center gap-3">
          <u-icon name="arrow-left" size="24" color="#fff" @click="goBack"></u-icon>
          <text class="text-white text-lg font-bold">分配课程</text>
        </view>
        <u-button type="primary" size="small" @click="showAssignModal = true">
          分配课程
        </u-button>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="p-4 bg-white">
      <view class="flex items-center bg-gray-100 rounded-full px-4 py-2">
        <u-icon name="search" size="20" color="#999"></u-icon>
        <input 
          v-model="searchKeyword" 
          placeholder="搜索课程名称或学生" 
          class="flex-1 ml-2 text-sm outline-none"
        />
      </view>
    </view>

    <!-- 课程分配列表 -->
    <view class="p-4">
      <view v-if="filteredAssignments.length > 0" class="space-y-3">
        <view 
          v-for="assignment in filteredAssignments" 
          :key="assignment.id"
          class="bg-white rounded-lg p-4 shadow-sm"
        >
          <view class="flex items-center justify-between">
            <view class="flex-1">
              <view class="flex items-center gap-3 mb-2">
                <image 
                  :src="assignment.course.cover?.[0]?.url || '/static/images/default-cover.jpg'" 
                  class="w-12 h-12 rounded-lg"
                  mode="aspectFill"
                />
                <view class="flex-1">
                  <text class="text-base font-medium text-gray-800">{{ assignment.course.name }}</text>
                  <text class="text-sm text-gray-500">{{ assignment.course.subject }}</text>
                </view>
              </view>
              <view class="flex items-center gap-4 text-sm text-gray-600">
                <text>学生: {{ assignment.student.nickname }}</text>
                <text>分配时间: {{ formatDate(assignment.assignedAt) }}</text>
              </view>
            </view>
            <view class="flex items-center gap-2">
              <u-button 
                type="error" 
                size="small" 
                @click="removeAssignment(assignment.id)"
              >
                移除
              </u-button>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="text-center py-8">
        <u-icon name="book" size="60" color="#ccc"></u-icon>
        <text class="text-gray-500 block mt-2">暂无课程分配记录</text>
      </view>
    </view>

    <!-- 分配课程弹窗 -->
    <u-modal v-model="showAssignModal" title="分配课程">
      <view class="p-4">
        <view class="space-y-4">
          <view>
            <text class="text-sm text-gray-600 mb-1 block">选择学生</text>
            <picker 
              :value="selectedStudentIndex" 
              :range="students" 
              range-key="nickname"
              @change="onStudentChange"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <view class="text-left">
                {{ selectedStudentIndex >= 0 ? students[selectedStudentIndex].nickname : '请选择学生' }}
              </view>
            </picker>
          </view>
          <view>
            <text class="text-sm text-gray-600 mb-1 block">选择课程</text>
            <picker 
              :value="selectedCourseIndex" 
              :range="courses" 
              range-key="name"
              @change="onCourseChange"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <view class="text-left">
                {{ selectedCourseIndex >= 0 ? courses[selectedCourseIndex].name : '请选择课程' }}
              </view>
            </picker>
          </view>
        </view>
        <view class="flex gap-3 mt-6">
          <u-button type="default" @click="showAssignModal = false">取消</u-button>
          <u-button type="primary" @click="assignCourse">确认分配</u-button>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { go } from '@/utils/common';

const authStore = useAuthStore();
const searchKeyword = ref('');
const showAssignModal = ref(false);
const selectedStudentIndex = ref(-1);
const selectedCourseIndex = ref(-1);

// 模拟数据，实际应该从API获取
const students = ref([
  { id: 1, nickname: '小明', email: 'xiaoming@example.com' },
  { id: 2, nickname: '小红', email: 'xiaohong@example.com' },
  { id: 3, nickname: '小华', email: 'xiaohua@example.com' }
]);

const courses = ref([
  { id: 1, name: '小学语文一年级', subject: '语文' },
  { id: 2, name: 'YCT一级课程', subject: '中文考试' },
  { id: 3, name: 'HSK一级课程', subject: '中文考试' }
]);

const assignments = ref([
  {
    id: 1,
    course: { id: 1, name: '小学语文一年级', subject: '语文', cover: [{ url: '/static/images/default-cover.jpg' }] },
    student: { id: 1, nickname: '小明' },
    assignedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    course: { id: 2, name: 'YCT一级课程', subject: '中文考试', cover: [{ url: '/static/images/default-cover.jpg' }] },
    student: { id: 2, nickname: '小红' },
    assignedAt: new Date('2024-01-10')
  }
]);

const filteredAssignments = computed(() => {
  if (!searchKeyword.value) return assignments.value;
  
  const keyword = searchKeyword.value.toLowerCase();
  return assignments.value.filter(assignment => 
    assignment.course.name.toLowerCase().includes(keyword) ||
    assignment.student.nickname.toLowerCase().includes(keyword)
  );
});

const goBack = () => {
  uni.navigateBack();
};

const onStudentChange = (e: any) => {
  selectedStudentIndex.value = e.detail.value;
};

const onCourseChange = (e: any) => {
  selectedCourseIndex.value = e.detail.value;
};

const assignCourse = async () => {
  if (selectedStudentIndex.value < 0 || selectedCourseIndex.value < 0) {
    uni.showToast({ title: '请选择学生和课程', icon: 'none' });
    return;
  }

  const student = students.value[selectedStudentIndex.value];
  const course = courses.value[selectedCourseIndex.value];

  try {
    // 这里应该调用API分配课程
    console.log('分配课程:', { student, course });
    
    // 模拟分配成功
    assignments.value.push({
      id: Date.now(),
      course: { ...course, cover: [{ url: '/static/images/default-cover.jpg' }] },
      student,
      assignedAt: new Date()
    });
    
    uni.showToast({ title: '分配成功', icon: 'success' });
    showAssignModal.value = false;
    selectedStudentIndex.value = -1;
    selectedCourseIndex.value = -1;
  } catch (error) {
    uni.showToast({ title: '分配失败', icon: 'error' });
  }
};

const removeAssignment = async (assignmentId: number) => {
  try {
    // 这里应该调用API移除课程分配
    console.log('移除课程分配:', assignmentId);
    
    // 更新本地状态
    const index = assignments.value.findIndex(a => a.id === assignmentId);
    if (index > -1) {
      assignments.value.splice(index, 1);
    }
    
    uni.showToast({ title: '移除成功', icon: 'success' });
  } catch (error) {
    uni.showToast({ title: '移除失败', icon: 'error' });
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN');
};

onMounted(() => {
  // 加载数据
  loadData();
});

const loadData = async () => {
  try {
    // 这里应该调用API获取学生列表、课程列表和分配记录
    console.log('加载数据');
  } catch (error) {
    console.error('加载数据失败:', error);
  }
};
</script>

<style scoped>
/* 可以添加自定义样式 */
</style> 