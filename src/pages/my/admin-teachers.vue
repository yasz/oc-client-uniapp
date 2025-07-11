<template>
  <view class="student-selector">
    <view class="student-list">
      <view
        v-for="student in students"
        :key="student.id"
        class="student-item"
        :class="{ 'student-item--active': selectedId === student.id }"
        @click="openAssociateModal(student)"
      >
        <image
          class="student-avatar"
          mode="aspectFill"
          :src="student.avatarUrl"
        />
        <view class="flex flex-col flex-1">
          <text class="student-name">{{ student.nickname }}</text>
          <text class="text-xs text-gray-400">ID: {{ student.id }}</text>
        </view>
        <view class="flex flex-col items-end justify-center min-w-[120rpx]">
          <template v-if="student.teacher_id">
            <image
              class="teacher-avatar"
              mode="aspectFill"
              :src="teacherAvatarUrl(student.teacher_id)"
              style="width: 40rpx; height: 40rpx; border-radius: 50%; margin-bottom: 2rpx;"
            />
            <text class="text-blue-600 text-xs mt-1">{{ student.teacher_id.nickname }}</text>
          </template>
          <template v-else>
            <text class="text-gray-400 text-xs">未关联教师</text>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { listAllStudents, listAllTeachers, associateStudentTeacher } from "@/utils/api";
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { onShow } from "@dcloudio/uni-app";

const authStore = useAuthStore();
const students = ref<any[]>([]);
const teachers = ref<any[]>([]);
const selectedId = ref<number>();
const selectedStudent = ref<any>(null);
const selectedTeacherIndex = ref(-1);

const teacherAvatarUrl = (teacher: any) => {
  return (
    import.meta.env.VITE_BUCKET_ENDPOINT +
    (teacher.avatar?.[0]?.url || "/static/avatars/wechat/defaultAvatar.png")
  );
};

onShow(async () => {
  if (!authStore.roles.includes("admin")) {
    uni.showToast({ title: "无权限访问", icon: "none" });
    setTimeout(() => {
      uni.switchTab({ url: "/pages/my/index" });
    }, 1000);
    return;
  }

  try {
    const res: any = await listAllStudents();
    students.value = res.data.map((student: any) => ({
      ...student,
      avatarUrl:
        import.meta.env.VITE_BUCKET_ENDPOINT +
        (student.avatar?.[0]?.url || "https://via.placeholder.com/50"),
    }));
    
    // 获取教师列表
    const tRes: any = await listAllTeachers();
    teachers.value = tRes.data;
  } catch (error) {
    console.error('数据加载失败:', error);
    uni.showToast({
      title: "获取学生或教师列表失败",
      icon: "none",
    });
  }
});

const openAssociateModal = (student: any) => {
  selectedStudent.value = student;
  selectedId.value = student.id;
  
  // 预选当前学生的教师
  if (student.teacher_id) {
    const teacherIndex = teachers.value.findIndex(t => t.id === student.teacher_id.id);
    selectedTeacherIndex.value = teacherIndex >= 0 ? teacherIndex : -1;
  } else {
    selectedTeacherIndex.value = -1;
  }
  
  // 使用原生modal显示教师选择
  showTeacherSelectionModal();
};

const showTeacherSelectionModal = () => {
  // 构建教师选择列表
  const teacherOptions = ['取消关联教师'];
  teachers.value.forEach(teacher => {
    teacherOptions.push(teacher.nickname);
  });
  
  uni.showActionSheet({
    itemList: teacherOptions,
    success: (res) => {
      const selectedIndex = res.tapIndex;
      if (selectedIndex === 0) {
        // 取消关联
        selectedTeacherIndex.value = -1;
      } else {
        // 选择教师
        selectedTeacherIndex.value = selectedIndex - 1;
      }
      confirmAssociate();
    },
    fail: () => {
      console.log('用户取消选择');
    }
  });
};

const confirmAssociate = async () => {
  try {
    if (selectedTeacherIndex.value === -1) {
      // 取消关联教师
      await associateStudentTeacher(selectedStudent.value.id, null);
      uni.showToast({ title: "已取消关联", icon: "success" });
    } else if (selectedTeacherIndex.value >= 0) {
      // 关联新教师
      const teacher = teachers.value[selectedTeacherIndex.value];
      await associateStudentTeacher(selectedStudent.value.id, teacher.id);
      uni.showToast({ title: "关联成功", icon: "success" });
    } else {
      uni.showToast({ title: "请选择教师", icon: "none" });
      return;
    }
    
    // 重新获取学生列表，确保UI同步
    const res: any = await listAllStudents();
    students.value = res.data.map((student: any) => ({
      ...student,
      avatarUrl:
        import.meta.env.VITE_BUCKET_ENDPOINT +
        (student.avatar?.[0]?.url || "https://via.placeholder.com/50"),
    }));
  } catch (error) {
    uni.showToast({ title: "操作失败", icon: "none" });
    console.error("关联教师失败:", error);
  }
};
</script>

<style lang="scss">
.student-selector {
  padding: 20rpx;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.student-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);

  &--active {
    background-color: #fff5e6;
    border: 2rpx solid #f8ae3d;
  }
}

.student-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.teacher-avatar {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  margin-bottom: 2rpx;
}

.student-name {
  font-size: 28rpx;
  color: #333;
}

.progress-info {
  font-size: 24rpx;
  color: #666;
}


</style>
