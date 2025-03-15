<template>
    <view v-if="isDataLoaded">
        <view class="container pd-20">
            <!-- 学习进度部分 -->

            <view class="section">
                <view class="flex-col">
                    <text class="title">{{ courseData.name }}</text>
                    <text class="text-gray text-8">{{ courseData.subject_id.name }} </text>
                </view>

                <view class="pt-10 progress-wrapper">
                    <text class="text-gray text-8 " style="width: 20%;">{{ $t('courses') }}</text>
                    <up-line-progress :percentage="progressPercent" height="20" activeColor="orange"
                        :show-text="false" />
                    <text style="width: 25%;" class="progress-text">{{ progressPercent }}% ({{ courseProgress }}/{{
                        totalChapters
                    }})</text>
                </view>
                <view class="pt-10 progress-wrapper">
                    <text class="text-gray text-8 " style="width: 20%;">{{ $t('assignment') }}</text>
                    <up-line-progress :percentage="asgProgressPercent" height="20" activeColor="green"
                        :show-text="false" />
                    <text style="width: 25%;" class="progress-text">{{ asgProgressPercent }}% ({{ submissionAssignments
                        }}/{{
                            totalAssignments
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
                        <text class="teacher-description"> , {{ courseData.teacher_id.description }}</text>
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
                <up-tabs v-model:current="currentTabIndex" @change="handleTabChange" :list="tabs"
                    itemStyle="height:55px;width:130rpx" lineWidth="50"></up-tabs>
            </up-sticky>
        </view>

        <view class="tab-content">
            <component :is="components[currentTabIndex]" :content="getTabContent(currentTabIndex)"
                v-if="currentTabIndex !== null" />
        </view>
    </view>
    <view v-else class="loading-container">
        <text>加载中...</text>
    </view>
</template>

<script setup lang="ts">
import { listCourseById, getCourseSessionsById, listSessionUsersBySessionId, listCourseProgressByUserIdAndSessionId, listAssignmentsByCourseId, listAssignmentSubmission } from '@/utils/api';
import { onLoad } from '@dcloudio/uni-app';
import { ref, onMounted, computed } from 'vue';
import IntroductionComponent from './components/introduction.vue';
import SyllabusComponent from './components/syllabus.vue';
import AssignmentsComponent from './components/assignments.vue';
import DiscussionsComponent from './components/discussions.vue';
// 定义响应式变量
const courseData: any = ref({});
const students: any = ref([]);
const courseProgress = ref(0); // 已学章节数
const totalChapters = ref(1); // 避免除以 0

const submissionAssignments = ref(0); // 作业已提交章节数
const totalAssignments = ref(1); // 避免除以 0

const teacherAvatar = ref('');
const isDataLoaded = ref(false); // 数据加载完成标志
const userId = useAuthStore().userId;



// 计算学习进度百分比
const progressPercent = computed(() => {
    return Math.round((courseProgress.value / totalChapters.value) * 100);
});

const asgProgressPercent = computed(() => {
    return Math.round((submissionAssignments.value / totalAssignments.value) * 100);
});
function handleTabChange(event: any) {
    currentTabIndex.value = event.index

}
const components = [
    IntroductionComponent, // 序号 0
    SyllabusComponent,     // 序号 1
    AssignmentsComponent,  // 序号 2
    DiscussionsComponent,  // 序号 3
];
const getTabContent = (index: number) => {
    switch (index) {
        case 0:
            return courseData.value.course_intro; // 课程简介
        case 1:
            return courseData.value.syllabus; // 课程大纲
        case 2:
            return courseData.value.assignments; // 作业数据
        case 3:
            return courseData.value.discussions; // 讨论区数据
        default:
            return null;
    }
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
import { useI18n } from "vue-i18n";
import { useAuthStore } from '@/stores/authStore';
const { t } = useI18n();
// 定义 Tab 选项
const tabs = [
    { key: 'introduction', name: t('introduction') },
    { key: 'syllabus', name: t('syllabus') },
    { key: 'assignments', name: t('assignments') },
    { key: 'discussions', name: t('discussions') },
];

const currentTabIndex = ref(1)
function countLeafNodes(data: any[]): number {
    let count = 0;

    for (const node of data) {
        // 如果没有 children 或者 children 是空数组，计为叶子节点
        if (!node.children || node.children.length === 0) {
            count++;
        } else {
            // 递归统计子节点
            count += countLeafNodes(node.children);
        }
    }

    return count;
}
function mergeAssignmentsWithSubmissions(
    assignmentsResponse: { data: any[] },
    assignmentSubmissionResponse: { data: any[] }
): any[] {
    const submissionsMap = new Map<number, any[]>();

    // 先将提交按 fk_assignment_id 归类
    assignmentSubmissionResponse.data.forEach((submission) => {
        if (!submissionsMap.has(submission.fk_assignment_id)) {
            submissionsMap.set(submission.fk_assignment_id, []);
        }
        submissionsMap.get(submission.fk_assignment_id)!.push(submission);
    });

    // 关联到 assignments
    return assignmentsResponse.data.map((assignment) => ({
        ...assignment,
        submissions: submissionsMap.get(assignment.id) || []
    }));
}

function mergeProgress(courseProgressResponse: any, courseResponse: any) {
    const progressMap = new Map();

    // 构建课程 ID 到进度的映射
    courseProgressResponse.data.forEach((progress: any) => {
        progressMap.set(progress.fk_course_id, progress.progress_percentage);
    });

    function attachProgress(course: any) {
        if (progressMap.has(course.id)) {
            course.progress_percentage = progressMap.get(course.id);
        }
        if (course.children && course.children.length > 0) {
            course.children.forEach(attachProgress);
        }
    }

    courseResponse.data.forEach(attachProgress);
    return courseResponse;
}

const id = ref(0);
onLoad(async (e: any) => {
    id.value = +e.id;

    try {
        let response: any = await getCourseSessionsById(id.value);
        courseData.value = response.data;

        // 动态绑定老师头像
        teacherAvatar.value = import.meta.env.VITE_BUCKET_ENDPOINT + response.data.teacher_id.avatar[0].url
            || 'https://via.placeholder.com/100';

        // 示例学习进度数据
        courseProgress.value = 1; // 示例值


        const sessionUsersResponse: any = await listSessionUsersBySessionId(id.value);
        const sessionUsers = sessionUsersResponse.data || [];

        students.value = sessionUsers.map((item: any) => {
            // console.log(item.user_id.avatar[0]?.url); // 打印 item 的内容
            return {
                name: item.user_id.nickname || item.user_id.username || '未命名',
                avatar: import.meta.env.VITE_BUCKET_ENDPOINT + (item.user_id.avatar[0]?.url || 'https://via.placeholder.com/50')
            };
        });

        const courseResponse: any = await listCourseById(courseData.value.course_id.id);
        totalChapters.value = countLeafNodes(courseResponse.data);   // 示例值

        const courseProgressResponse = await listCourseProgressByUserIdAndSessionId(userId, id.value);
        courseProgress.value = courseProgressResponse.data.length

        courseData.value.syllabus = mergeProgress(courseProgressResponse, courseResponse).data
        //将已完成的课程，设置关联起来；

        const assignmentsResponse: any = await listAssignmentsByCourseId(courseData.value.course_id.id);
        totalAssignments.value = assignmentsResponse.data.length

        const assignmentSubmissionResponse: any = await listAssignmentSubmission({ userId, courseSessionId: id.value });
        submissionAssignments.value = assignmentSubmissionResponse.data.length;
        courseData.value.assignments = mergeAssignmentsWithSubmissions(assignmentsResponse, assignmentSubmissionResponse);

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
