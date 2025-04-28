<template>
  <view class="bg-primary" style="height: calc(100vh - 44px)">
    <view class="pt-40">
      {{ calendarList }}
      <view class="flex flex-center-row">
        <image
          src="/static/calendars/title1.png"
          style="width: 50vw"
          mode="widthFix"
        />
      </view>

      <view class="pt-20 px-20">
        <view class="calendar-container">
          <view class="calendar-header">
            <text class="student-name">{{ studentNickname }}的日历</text>
          </view>
          <wn-calendar
            :modelValue="calendarList"
            :isBorder="true"
            :isEn="true"
            @choose="handleDateChoose"
          />
        </view>
      </view>
    </view>

    <!-- 会议详情弹窗 -->
    <u-modal
      v-model="showModal"
      :title="selectedMeeting?.title || ''"
      :show-cancel-button="true"
      confirm-text="关闭"
    >
      <view class="modal-content" v-if="selectedMeeting">
        <view class="info-item">
          <text class="label">时间：</text>
          <text class="value">{{ formatDateTime(selectedMeeting.start) }}</text>
        </view>
        <view class="info-item">
          <text class="label">时长：</text>
          <text class="value"
            >{{
              getDuration(selectedMeeting.start, selectedMeeting.end)
            }}分钟</text
          >
        </view>
        <view class="info-item">
          <text class="label">教师：</text>
          <text class="value">{{ selectedMeeting.teacher }}</text>
        </view>
        <view class="info-item">
          <text class="label">学生：</text>
          <text class="value">{{ selectedMeeting.student }}</text>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getStudentCalendar } from "@/utils/api";
import { useAuthStore } from "@/stores/authStore";
import dayjs from "dayjs";
import WnCalendar from "@/uni_modules/wn-calendar/components/wn-calendar/wn-calendar.vue";

interface Meeting {
  id: number;
  title: string;
  meeting_time: string;
  duration: number;
  host_user_id: {
    id: number;
    nickname: string;
  };
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
}

const authStore = useAuthStore();
const studentId = ref<number>();
const studentNickname = ref<string>("");
const calendarList = ref<CalendarItem[]>([]);
const showModal = ref(false);
const selectedMeeting = ref<CalendarItem | null>(null);

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
  const { date, data } = event;
  if (data) {
    selectedMeeting.value = data;
    showModal.value = true;
  }
};

// 获取日历数据
const fetchCalendarData = async () => {
  try {
    const response = await getStudentCalendar(studentId.value!);

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
        color: meeting.mark_color,
      }));
    }
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    uni.showToast({
      title: "获取日历数据失败",
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
</style>
