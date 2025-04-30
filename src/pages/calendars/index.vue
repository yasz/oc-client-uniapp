<template>
  <view class="" style="height: calc(100vh - 44px)">
    <view>
      <view class="flex flex-center-row"> </view>

      <view class="pt-20 px-20">
        <view class="calendar-header">
          <text class="student-name">{{ studentNickname }}的日历</text>
        </view>
        <wn-calendar
          :modelValue="calendarList"
          :isBorder="true"
          :isEn="false"
          @choose="handleDateChoose"
        />
      </view>
    </view>

    <!-- 会议详情弹窗 -->
    <calendar-modal
      v-model:show="showModal"
      :date="selectedDate"
      :meetings="selectedDateMeetings"
      @linkClick="handleMeetingLinkClick"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getStudentCalendar } from "@/utils/api";
import { useAuthStore } from "@/stores/authStore";
import dayjs from "dayjs";
import WnCalendar from "@/uni_modules/wn-calendar/components/wn-calendar/wn-calendar.vue";
import CalendarModal from "./modal.vue";

interface Meeting {
  id: number;
  title: string;
  meeting_time: string;
  duration: number;
  host_user_id: {
    id: number;
    nickname: string;
  };
  meeting_link: string;
  participant_user_id: {
    id: number;
    nickname: string;
  };
  timezone_id: {
    id: number;
    name: string;
  };
  mark_color: string;
}

interface CalendarItem {
  id: number;
  title: string;
  start: string;
  end: string;
  teacher: string;
  student: string;
  date: string;
  color: string;
  meeting_link?: string;
}

const authStore = useAuthStore();
const studentId = ref<number>();
const studentNickname = ref<string>("");
const calendarList = ref<CalendarItem[]>([]);
const showModal = ref(false);
const selectedDate = ref<string | null>(null);
const selectedDateMeetings = ref<CalendarItem[]>([]);

// 格式化日期时间
const formatDateTime = (dateTime: string) => {
  return dayjs(dateTime).format("YYYY-MM-DD HH:mm");
};

// 计算会议时长
const getDuration = (start: string, end: string) => {
  const startTime = dayjs(start);
  const endTime = dayjs(end);
  return endTime.diff(startTime, "minute");
};

// 处理日期选择
const handleDateChoose = (event: any) => {
  console.log("Date chosen:", event);
  const { date } = event;
  if (date) {
    selectedDate.value = date;
    selectedDateMeetings.value = calendarList.value.filter(
      (item) => item.date === date
    );
    console.log("Selected meetings:", selectedDateMeetings.value);
    if (selectedDateMeetings.value.length > 0) {
      showModal.value = true;
    }
  }
};

// 获取日历数据
const fetchCalendarData = async () => {
  try {
    const response = await getStudentCalendar(studentId.value!);
    console.log("Calendar data:", response.data); // 添加调试日志

    if (response && response.data) {
      calendarList.value = response.data.map((meeting: Meeting) => ({
        id: meeting.id,
        title: meeting.title,
        start: meeting.meeting_time,
        end: new Date(
          new Date(meeting.meeting_time).getTime() + meeting.duration * 60000
        ).toISOString(),
        teacher: meeting.host_user_id.nickname,
        student: meeting.participant_user_id.nickname,
        date: dayjs(meeting.meeting_time).format("YYYY/M/D"),
        meeting_link: meeting.meeting_link,
        color: meeting.mark_color || "#2979ff", // 使用后端返回的颜色，如果没有则使用默认颜色
      }));
      console.log("Processed calendar list:", calendarList.value); // 添加调试日志
    }
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    uni.showToast({
      title: "获取日历数据失败",
      icon: "none",
    });
  }
};

// 处理会议链接点击
const handleMeetingLinkClick = (meeting: CalendarItem) => {
  if (meeting.meeting_link) {
    // 这里可以添加跳转到会议链接的逻辑
    uni.showToast({
      title: "正在跳转到会议...",
      icon: "none",
    });
  }
};

onLoad((options: any) => {
  if (options.studentId) {
    studentId.value = parseInt(options.studentId);
    studentNickname.value = decodeURIComponent(options.nickname);
    fetchCalendarData();
  }
});
</script>

<style lang="scss" scoped>
.calendar-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  margin-bottom: 20px;
  text-align: center;
}

.student-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.modal-content {
  padding: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;

  .label {
    width: 60px;
    color: #666;
  }

  .value {
    flex: 1;
    color: #333;
  }
}

.meeting-item {
  margin-bottom: 16px;
}

.meeting-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.meeting-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-right: 8px;
}

.meeting-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 12px 0;
}
</style>
