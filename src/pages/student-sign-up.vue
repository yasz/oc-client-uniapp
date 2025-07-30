<template>
    <view>
        <view class="fixed inset-0 bg-gradient-yellow z--3"></view>

        <!-- 注册表单页面 -->
        <view class="min-h-screen flex flex-col items-center relative">
            <view class="absolute flex z-10 pt-[8%] w-full justify-center">
                <img class="w-32" src="@/static/index/signup/hippo.png" alt="hippo" />
                <view class="w-[50%] flex-col pt-[10%]">
                    <img class="w-[100%]" src="@/static/index/signup/tip1.png" alt="tip1" />
                    <img class="w-[80%]" src="@/static/index/signup/tip2.png" alt="tip2" />
                </view>
            </view>

            <view class="w-[90%] flex flex-col gap-4 pt-[40%]">
                <view class="bg-white rounded-3xl shadow-lg p-6 form-container">
                    <scroll-view scroll-y="true" class="h-[38vh]">
                        <form @submit="submitForm">
                            <!-- 账号 -->
                            <view v-if="!isReregisterMode" class="form-item">
                                <text class="required-star">*</text>
                                <input class="input-item" v-model="formModel.username" placeholder="账号" required
                                    placeholder-style="color: #d1d5db;" />
                            </view>

                            <!-- 姓名 -->
                            <view class="form-item">
                                <text class="required-star">*</text>
                                <input class="input-item" v-model="formModel.nickname" placeholder="姓名" required
                                    placeholder-style="color: #d1d5db;" />
                            </view>

                            <!-- 邮箱 -->
                            <view v-if="!isReregisterMode" class="form-item">
                                <text class="required-star">*</text>
                                <input class="input-item" v-model="formModel.email" placeholder="邮箱" required
                                    type="email" placeholder-style="color: #d1d5db;" />
                            </view>

                            <!-- 手机号码 -->
                            <view v-if="!isReregisterMode" class="form-item">
                                <text class="required-star">*</text>
                                <input class="input-item" v-model="formModel.phone" placeholder="手机号码" required
                                    placeholder-style="color: #d1d5db;" />
                            </view>

                            <!-- 密码 -->
                            <view v-if="!isReregisterMode" class="form-item">
                                <text class="required-star">*</text>
                                <input class="input-item" v-model="formModel.password" type="password"
                                    placeholder="请输入密码" required placeholder-style="color: #d1d5db;" />
                            </view>

                            <!-- 确认密码 -->
                            <view v-if="!isReregisterMode" class="form-item">
                                <text class="required-star">*</text>
                                <input class="input-item" v-model="formModel.confirmPassword" type="password"
                                    placeholder="请再次输入密码" required placeholder-style="color: #d1d5db;" />
                            </view>

                            <!-- 性别 -->
                            <view class="form-item">
                                <text class="required-star">*</text>
                                <picker mode="selector" :range="genderOptions" :value="genderIndex"
                                    @change="onGenderChange">
                                    <view
                                        class="input-item border border-gray-300 rounded px-4 py-2 h-[44rpx] flex items-center justify-center cursor-pointer text-gray-900"
                                        :style="{ color: formModel.gender ? '#111' : '#d1d5db' }"
                                    >
                                        {{ formModel.gender || '性 别' }}
                                    </view>
                                </picker>
                            </view>

                            <!-- 出生年月 -->
                            <view class="form-item">
                                <text class="required-star">*</text>
                                <picker mode="date" :value="formModel.birth" @change="onBirthChange">
                                    <view
                                        class="input-item border border-gray-300 rounded px-4 py-2 h-[44rpx] flex items-center justify-center cursor-pointer text-gray-900"
                                        :style="{ color: formModel.birth ? '#111' : '#d1d5db' }"
                                    >
                                        {{ formModel.birth || '请选择出生年月' }}
                                    </view>
                                </picker>
                            </view>

                            <!-- 国籍 -->
                            <view class="form-item">
                                <text class="required-star">*</text>
                                <input class="input-item" v-model="formModel.nationality" placeholder="国籍" required
                                    placeholder-style="color: #d1d5db;" />
                            </view>

                            <!-- 常居地 -->
                            <view class="form-item">
                                <text class="required-star">*</text>
                                <input class="input-item" v-model="formModel.residence" placeholder="常居地" required
                                    placeholder-style="color: #d1d5db;" />
                            </view>

                            <!-- 现有中文水平 -->
                            <view class="form-item">
                                <text class="required-star">*</text>
                                <input class="input-item" v-model="formModel.chinese_level" placeholder="现有中文水平"
                                    required placeholder-style="color: #d1d5db;" />
                            </view>

                            <!-- 想要学的课程 -->
                            <view class="form-item">
                                <text class="required-star">*</text>
                                <picker class="input-item" mode="selector" :range="courseOptions"
                                    @change="handleCourseChange" :value="courseIndex">
                                    <input readonly :value="formModel.desired_courses" placeholder="想要学的课程"
                                        placeholder-style="color: #d1d5db;" />
                                </picker>
                            </view>

                            <!-- 对授课老师的要求 -->
                            <view class="form-item">
                                <input class="input-item" v-model="formModel.teacher_requirements"
                                    placeholder="对授课老师的要求" placeholder-style="color: #d1d5db;" />
                            </view>

                            <!-- 联系方式 -->
                            <view class="form-item">
                                <input class="input-item" v-model="formModel.contact"
                                    placeholder="联系方式" placeholder-style="color: #d1d5db;" />
                            </view>


                        </form>
                    </scroll-view>
                    <button form-type="submit" @click="submitForm"
                        class="w-full py-8 my-20 rounded-full text-white font-bold text-base"
                        style="background: linear-gradient(90deg, #f9b33b 0%, #f59743 100%)" :disabled="loading">
                        {{ isReregisterMode ? '申请老师授课' : '申请老师授课' }}
                    </button>
                </view>
            </view>

            <view class="absolute bottom-8 w-full flex justify-center">
                <img class="w-40 block md:hidden" src="@/static/index/signup/logo.png" alt="logo" />
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { signUpStudent, updateStudent, createMessage } from "@/utils/api";
import useModal from "@/hooks/useModal";
import { useAuthStore } from "@/stores/authStore";
import { go } from "@/utils/common";

const modal = useModal().modal;
const loading = ref(false);
const authStore = useAuthStore();

// 判断是否为重新注册模式
const isReregisterMode = ref(false);

onMounted(() => {
    // 获取URL参数
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = (currentPage as any).options || {};

    isReregisterMode.value = options.from === 'reregister';

    // 如果是重新注册模式，预填充用户信息
    if (isReregisterMode.value) {
        formModel.value.nickname = authStore.nickname || '';
        // 其他字段保持空白，让用户填写
    }
});

const formModel = ref({
    username: "",
    nickname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    birth: "",
    nationality: "",
    residence: "",
    chinese_level: "",
    desired_courses: "",
    teacher_requirements: "",
    contact: "",
});

const genderOptions = ["男", "女"];
const genderIndex = ref(-1);
const desiredCoursesIndex = ref(-1);
const courseOptions = ["部编版小学语文", "YCT", "HCK"];
const courseIndex = ref(0);

const onGenderChange = (e: any) => {
    genderIndex.value = e.detail.value;
    formModel.value.gender = genderOptions[genderIndex.value];
};

const onBirthChange = (e: any) => {
    formModel.value.birth = e.detail.value;
};

const handleCourseChange = (e: any) => {
    desiredCoursesIndex.value = e.detail.value;
    formModel.value.desired_courses = courseOptions[desiredCoursesIndex.value];
};

function validateEmail(email: string) {
    return /^[\w-\.]+@[\w-]+(\.[\w-]+)+$/.test(email);
}

const submitForm = async () => {
    if (loading.value) return;
    loading.value = true;

    // 重新注册模式下的验证逻辑
    if (isReregisterMode.value) {
        // 验证所有必填字段
        const requiredFields = [
            { field: 'nickname', name: '姓名' },
            { field: 'gender', name: '性别' },
            { field: 'birth', name: '出生年月' },
            { field: 'nationality', name: '国籍' },
            { field: 'residence', name: '常居地' },
            { field: 'chinese_level', name: '现有中文水平' },
            { field: 'desired_courses', name: '想要学的课程' },
        ];

        for (const { field, name } of requiredFields) {
            if (!formModel.value[field as keyof typeof formModel.value]) {
                await modal(`${name}为必填项`);
                loading.value = false;
                return;
            }
        }

        try {
            // 在二次注册模式下，只提交必要的字段，排除username、email、password、confirmPassword、phone
            const { username, email, password, confirmPassword, phone, ...updateData } = formModel.value;
            const res = await updateStudent(Number(authStore.userId), {
                ...updateData,
                re_registered: true,
            });
            if (res.data) {
                // await modal("信息更新成功！");
                try {
                    await createMessage({
                        sender_id: res.data.id || 1, // 新注册学生id
                        receiver_id: 12,
                        title: "新学生注册通知",
                        content: `有新学生注册：
账号：${res.data[0].username}
邮箱：${res.data[0].email}
手机：${formModel.value.phone}
性别：${formModel.value.gender}
出生年月：${formModel.value.birth}
国籍：${formModel.value.nationality}
常居地：${formModel.value.residence}
中文水平：${formModel.value.chinese_level}
想学课程：${formModel.value.desired_courses}
老师要求：${formModel.value.teacher_requirements}
联系方式：${formModel.value.contact}`
                    });
                } catch (messageErr) {
                    console.error("发送站内信失败:", messageErr);
                }
               
                // 更新authStore中的re_registered状态
                authStore.re_registered = true;
                go("/sign-up-finish?role=student");
                // 返回上一页
               
            } else {
                await modal("更新失败！");
            }
        } catch (err: any) {
            await modal(`更新异常！${err.response?.data?.errors?.[0]?.message || err.message}`);
        } finally {
            loading.value = false;
        }
        return;
    }

    // 原始注册模式的验证逻辑
    // 验证所有必填字段
    const requiredFields = [
        { field: 'username', name: '账号' },
        { field: 'email', name: '邮箱' },
        { field: 'password', name: '密码' },
        { field: 'confirmPassword', name: '确认密码' },
        { field: 'phone', name: '手机号码' },
        { field: 'nickname', name: '姓名' },
        { field: 'gender', name: '性别' },
        { field: 'birth', name: '出生年月' },
        { field: 'nationality', name: '国籍' },
        { field: 'residence', name: '常居地' },
        { field: 'chinese_level', name: '现有中文水平' },
        { field: 'desired_courses', name: '想要学的课程' },
    ];

    for (const { field, name } of requiredFields) {
        if (!formModel.value[field as keyof typeof formModel.value]) {
            await modal(`${name}为必填项`);
            loading.value = false;
            return;
        }
    }

    if (!validateEmail(formModel.value.email)) {
        await modal("邮箱格式不正确");
        loading.value = false;
        return;
    }
    if (formModel.value.password !== formModel.value.confirmPassword) {
        await modal("两次输入的密码不一致");
        loading.value = false;
        return;
    }
    try {
        const res = await signUpStudent({
            ...formModel.value,
        });

        if (res.data) {
            // 发送站内信通知管理员

            try {
                await createMessage({
                    sender_id: res.data.id || 1, // 新注册学生id
                    receiver_id: 12,
                    title: "新学生注册通知",
                    content: `有新学生注册：\n账号：${formModel.value.username}\n邮箱：${formModel.value.email}\n手机：${formModel.value.phone}\n性别：${formModel.value.gender}\n出生年月：${formModel.value.birth}\n国籍：${formModel.value.nationality}\n常居地：${formModel.value.residence}\n中文水平：${formModel.value.chinese_level}\n想学课程：${formModel.value.desired_courses}\n老师要求：${formModel.value.teacher_requirements}`
                });
            } catch (messageErr) {
                console.error("发送站内信失败:", messageErr);
            }
            await modal("提交成功！");
        } else {
            await modal("提交失败！");
        }
    } catch (err: any) {
        await modal(`提交异常！${err.response?.data?.errors?.[0]?.message || err.message}`);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.form-item {
    @apply relative my-4;
}

.required-star {
    @apply absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500 font-bold text-lg z-10;
}

.input-item {
    @apply bg-gray-100 rounded-full text-center text-base mb-1 py-3 pl-6 pr-6;
}

.form-container {
    height: 50vh;
    max-height: 60vh;
}
</style>