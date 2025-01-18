<template>
    <view>
        <view class="container pd-20">

            <!-- 学习进度部分 -->
            <view class="section">
                <text class="title">小学语文（部编版）一上</text>
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
                <view class="pt-20 teacher-info">
                    <u-avatar :src="'https://via.placeholder.com/100'" size="80" />
                    <view class="teacher-detail">
                        <text class="teacher-name">赵岳 Panto</text>
                        <text class="teacher-description"> 专业授课老师，擅长中文教学及课程设计。</text>
                    </view>
                </view>
            </view>

            <!-- 最新学员 -->
            <view class="section">
                <view class="pb-10">
                    <text class="title">{{ $t('Latest Students') }}</text>
                </view>
                <scroll-view scroll-x class="students-list">
                    <u-avatar-group :urls="students.map(student => student.avatar)" :maxCount="20" gap=""
                        @click="showStudentName"></u-avatar-group>
                </scroll-view>
            </view>
        </view>


        <view class="container">
            <up-sticky bgColor="#fff" class="f-b-c ur-10">
                <up-tabs :list="tabs" itemStyle="height:50px;width:120rpx;" lineWidth="50"></up-tabs>
            </up-sticky>
        </view>
    </view>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const completedChapters = ref(0); // 已学章节数
const totalChapters = ref(1); // 避免除以 0
const students = ref([]);
const coursesIntro = ref('课程介绍');
const activeTab = ref('introduction');

const progressPercent = computed(() => {
    return Math.round((completedChapters.value / totalChapters.value) * 100);
});
function showStudentName(event) {
    const index = event.detail.index;
    const student = students.value[index];
    if (student) {
        uni.showToast({
            title: student.name,
            icon: 'none',
        });
    }
}
const tabs = [
    { key: 'introduction', name: '课程介绍' },
    { key: 'syllabus', name: '目录', badge: 3 },
    { key: 'assignments', name: '作业' },
    { key: 'discussions', name: '讨论区' },
];

onMounted(() => {

    completedChapters.value = 9;
    totalChapters.value = 10;

    students.value = [
        { id: 1, name: '学生A', avatar: 'https://via.placeholder.com/50' },
        { id: 2, name: '学生B', avatar: 'https://via.placeholder.com/50' },
        { id: 3, name: '学生C', avatar: 'https://via.placeholder.com/50' },
        { id: 4, name: '学生D', avatar: 'https://via.placeholder.com/50' },
        { id: 5, name: '学生E', avatar: 'https://via.placeholder.com/50' },
        { id: 6, name: '学生F', avatar: 'https://via.placeholder.com/50' },
        { id: 7, name: '学生G', avatar: 'https://via.placeholder.com/50' },
    ];

    // 模拟获取课程介绍数据
    coursesIntro.value = '<p>这是一个关于日语50音的课程介绍...</p>';
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
    margin-bottom: 20px;
    padding: 15px;
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

.student-card {
    display: flex;
    align-items: center;
    margin-right: 15px;
}

.student-name {
    margin-top: 5px;
    font-size: 12px;
    text-align: center;
}
</style>