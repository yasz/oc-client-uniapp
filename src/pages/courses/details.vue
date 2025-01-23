<template>
    <view v-if="isDataLoaded">
        <view class="container pd-20">
            <!-- 学习进度部分 -->
            <view class="section">
                <text class="title">{{ courseData.subject_id.name }} - {{ courseData.course_id.name }}</text>
                <view class="pt-10 progress-wrapper">
                    <up-line-progress :percentage="progressPercent" height="20" activeColor="orange"
                        :show-text="false" />
                    <text class="progress-text">{{ progressPercent }}% ({{ completedChapters }}/{{ totalChapters
                        }})</text>
                </view>
            </view>

            <!-- 授课老师 -->
            <view class="section">
                <text class="title">{{ $t("Instructor") }}</text>
                <view class="pt-10 teacher-info">
                    <u-avatar mode="aspectFill" :src="teacherAvatar" size="80" />
                    <view class="teacher-detail">
                        <text class="teacher-name">{{ courseData.teacher_id.nickname }}</text>
                        <text class="teacher-description"> , 专业授课老师，擅长中文教学及课程设计。</text>
                    </view>
                </view>
            </view>

            <!-- 最新学员 -->
            <view class="section">
                <view>
                    <text class="title">{{ $t('Latest Students') }}</text>
                </view>
                <scroll-view scroll-x class="students-list">
                    <u-avatar-group :urls="students.map((student: any) => student.avatar)" :maxCount="20" gap=""
                        @click="showStudentName"></u-avatar-group>
                </scroll-view>
            </view>
        </view>

        <view class="container">
            <up-sticky bgColor="#fff" class="f-b-c ur-10" offset-top="-30">
                <up-tabs @change="handleTabChange" :list="tabs" itemStyle="height:50px;width:120rpx"
                    lineWidth="50"></up-tabs>
            </up-sticky>
        </view>
        <view class="tab-content">
            <component :is="getComponent(activeTab)" :content="courseData.course_intro" v-if="activeTab !== null" />
        </view>
    </view>
    <view v-else class="loading-container">
        <text>加载中...</text>
    </view>
</template>

<script setup lang="ts">
import { fetchCourseSessionsById } from '@/utils/api';
import { onLoad } from '@dcloudio/uni-app';
import { ref, onMounted, computed } from 'vue';
import IntroductionComponent from './components/introduction.vue';
import SyllabusComponent from './components/syllabus.vue';
import AssignmentsComponent from './components/assignments.vue';
import DiscussionsComponent from './components/discussions.vue';
// 定义响应式变量
const courseData: any = ref({});
const students: any = ref([]);
const completedChapters = ref(0); // 已学章节数
const totalChapters = ref(1); // 避免除以 0
const teacherAvatar = ref('');
const isDataLoaded = ref(false); // 数据加载完成标志

// 计算学习进度百分比
const progressPercent = computed(() => {
    return Math.round((completedChapters.value / totalChapters.value) * 100);
});
function handleTabChange(event: any) {
    console.log('【调试】:【eeee', event, '】');
    const selectedTabKey = event.key; // 获取选中的 tab key

    activeTab.value = selectedTabKey; // 更新 activeTab
}
const getComponent = (key: string) => {
    const components: Record<string, any> = {
        introduction: IntroductionComponent,
        syllabus: SyllabusComponent,
        assignments: AssignmentsComponent,
        discussions: DiscussionsComponent,
    };
    return components[key] || null;
};

// 模拟学员点击行为
function showStudentName(event: any) {
    const index = event.detail.index;
    const student: any = students.value[index];
    if (student) {
        uni.showToast({
            title: student.name,
            icon: 'none',
        });
    }
}
const activeTab = ref('introduction')
// 定义 Tab 选项
const tabs = [
    { key: 'introduction', name: '课程介绍' },
    { key: 'syllabus', name: '目录', badge: 3 },
    { key: 'assignments', name: '作业' },
    { key: 'discussions', name: '讨论区' },
];

const id = ref(0);
onLoad(async (e: any) => {
    id.value = +e.id;

    try {
        const response: any = await fetchCourseSessionsById(id.value);
        courseData.value = response.data;

        // 动态绑定老师头像
        teacherAvatar.value = import.meta.env.VITE_BUCKET_ENDPOINT + response.data.teacher_id.avater[0].url
            || 'https://via.placeholder.com/100';

        // 示例学习进度数据
        completedChapters.value = 9; // 示例值
        totalChapters.value = 10;   // 示例值

        // 模拟学员列表数据
        students.value = [
            { name: '学生A', avatar: 'https://via.placeholder.com/50' },
            { name: '学生B', avatar: 'https://via.placeholder.com/50' },
        ];

        isDataLoaded.value = true;
    } catch (error) {
        console.error('数据加载失败', error);
    }
});
</script>

<style scoped>
.f-b-c {
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background-color: #f5f5f5;
}

.section {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;
}

.title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.progress-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.progress-text {
    margin-left: 10px;
    color: #333;
}

.teacher-info {
    display: flex;
    align-items: center;
}

.teacher-detail {
    margin-left: 15px;
}

.teacher-name {
    font-size: 16px;
    font-weight: bold;
}

.teacher-description {
    margin-top: 5px;
    color: #666;
}

.students-list {
    display: flex;
    flex-direction: row;
    padding: 10px 0;
}

.loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #fff;
}
</style>
