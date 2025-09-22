<template>
    <view>
        <view class="fixed inset-0 bg-gradient-yellow z--3"></view>

        <view class="flex z-10 pt-[10%] justify-center items-center pl-[5%]">
            <img class="w-[40%] z-10" src="@/static/index/signup/hippo.png" alt="hippo" />
            <view class="w-[50%] pt-[24%]">
                <img class="w-[80%]" src="@/static/index/signup/finish_thanks.png" alt="tip2" />
            </view>
        </view>


        <!-- <view class="absolute bottom-8 w-full flex justify-center">
            <img class="w-40" src="@/static/index/signup/logo.png" alt="logo" />
        </view> -->
    </view>
    <!-- <view class="flex z-10 pt-[20%] justify-center items-center z-8 w-[80%]"> -->
    <view class="flex z-0 mt-[-10vh] justify-center items-center">
        <view class="w-[90vw] pt-56">
            <view
                class="bg-white rounded-3xl shadow-lg p-6 w-[90%] text-center text-base leading-relaxed max-h-[40vh] overflow-y-auto">
                <template v-if="isTeacher">
                    <div class="text-left">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;感谢您申请成为Lifefunner“乐凡中文”的授课教师！<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们会根据您提供的资料匹配学生，如果适配成功，将人工与您确认授课相关信息。近期请留意您的邮箱，保持电话畅通。
                    </div>
                </template>
                <template v-else>
                    <div class="text-left">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;感谢您申请Lifefunner乐凡中文的私教课！<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们将在查阅您提供的资料之后，予以人工回复。<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;近期请留意您的邮箱，或保持电话畅通（基于您提供的联系方式）。<br />
                        <br />
                        <span class="text-sm text-gray-500">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Thank you for applying to Lifefunner’s private
                            classes!<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We will reply to you manually after reviewing the
                            information you provided.<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kindly pay attention to your email or ensure your phone
                            normal working in the coming days.
                        </span>
                    </div>
                </template>

            </view>
            <button class="mt-8 w-[80%] py-3 rounded-full text-orange  font-bold text-base bg-[#FFFFFF]"
                @click="goCourses">
                返回课程
            </button>
        </view>
    </view>

</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { go } from '@/utils/common';
const route = useRoute();
const isTeacher = ref(false);

onMounted(() => {
    // 根据路由参数判断角色：teacher 或 student
    const role = route.query.role as string;
    isTeacher.value = role === 'teacher';

    // 可以添加角色验证
    if (role && role !== 'teacher' && role !== 'student') {
        console.warn(`未知的角色类型: ${role}`);
    }
});

function goCourses() {
    // uniapp跳转
    go('/courses');
}
</script>
