<template>
    <view>
        <view class="fixed inset-0 bg-gradient-yellow z--3"></view>

        <!-- 注册表单页面 -->
        <view class="min-h-screen flex flex-col items-center relative">
            <view class="absolute flex z-10 pt-[8%] w-full justify-center">
                <img class="w-32" src="@/static/index/signup/hippo.png" alt="hippo" />
                <view class="w-[50%] flex-col pt-[10%]">
                    <view class="text-center">
                        <text class="text-[#754D39] text-xs font-bold leading-tight">
                            欢迎来到Lifefunner 乐凡中文！<br />
                            Lifefunner使中文学习更有效、更轻松。
                        </text>
                    </view>
                </view>
            </view>

            <view class="w-[90%]  flex flex-col gap-4 pt-[40%]">
                <view class="bg-white rounded-3xl shadow-lg p-3">
                    <scroll-view scroll-y="true" class="h-[38vh]">
                        <form @submit="submitForm">
                            <!-- 账号 -->
                            <view v-if="!isReregisterMode" class="form-item">
                                <text class="required-star">*</text>
                                <input class="input-item" v-model="formModel.username" placeholder="账号" required
                                    placeholder-style="color: #d1d5db;" />
                            </view>

                            <!-- 昵称 -->
                            <view class="form-item">
                                <text class="required-star">*</text>
                                <input class="input-item" v-model="formModel.nickname" placeholder="昵称" required
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
                                    <input class="input-item" readonly :value="formModel.gender" placeholder="性 别"
                                        placeholder-style="color: #d1d5db;" />
                                </picker>
                            </view>

                            <!-- 出生年月 -->
                            <view class="form-item">
                                <text class="required-star">*</text>
                                <picker mode="date" :value="formModel.birth" @change="onBirthChange">
                                    <input class="input-item" readonly :value="formModel.birth" placeholder="请选择出生年月"
                                        placeholder-style="color: #d1d5db;" />
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

                            <!-- 现在中文水平 -->
                            <view class="form-item">
                                <text class="required-star">*</text>
                                <input class="input-item" v-model="formModel.chinese_level" placeholder="现在中文水平"
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
                                <text class="required-star">*</text>
                                <input class="input-item" v-model="formModel.teacher_requirements"
                                    placeholder="对授课老师的要求" required placeholder-style="color: #d1d5db;" />
                            </view>


                        </form>
                    </scroll-view>
                    <button form-type="submit" @click="submitForm"
                        class="w-full py-8 my-20 rounded-full text-white font-bold text-base"
                        style="background: linear-gradient(90deg, #f9b33b 0%, #f59743 100%)" :disabled="loading">
                        {{ isReregisterMode ? '申请直播课' : '申请直播课' }}
                    </button>
                </view>
            </view>

            <view class="absolute bottom-8 w-full flex justify-center">
                <img class="w-40" src="@/static/index/signup/logo.png" alt="logo" />
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { signUpStudent, updateStudent } from "@/utils/api";
import useModal from "@/hooks/useModal";
import { useAuthStore } from "@/stores/authStore";

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
            { field: 'nickname', name: '昵称' },
            { field: 'gender', name: '性别' },
            { field: 'birth', name: '出生年月' },
            { field: 'nationality', name: '国籍' },
            { field: 'residence', name: '常居地' },
            { field: 'chinese_level', name: '现在中文水平' },
            { field: 'desired_courses', name: '想要学的课程' },
            { field: 'teacher_requirements', name: '对授课老师的要求' }
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
                await modal("信息更新成功！");
                // 更新authStore中的re_registered状态
                authStore.re_registered = true;
                // 返回上一页
                uni.navigateBack();
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
        { field: 'nickname', name: '昵称' },
        { field: 'gender', name: '性别' },
        { field: 'birth', name: '出生年月' },
        { field: 'nationality', name: '国籍' },
        { field: 'residence', name: '常居地' },
        { field: 'chinese_level', name: '现在中文水平' },
        { field: 'desired_courses', name: '想要学的课程' },
        { field: 'teacher_requirements', name: '对授课老师的要求' }
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
    @apply relative w-full my-4;
}

.required-star {
    @apply absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500 font-bold text-lg z-10;
}

.input-item {
    @apply w-full bg-gray-100 rounded-full text-center text-base mb-1 py-3 pl-6 pr-6;
}
</style>