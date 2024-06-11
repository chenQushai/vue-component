


export const checkPhone = (_rule, value) => {
    // 手机号
    const mobilePhone = /^((13[0-9])|(14[0-9])|(15[0-9])|(18[0-9])|(19[0-9])|(16[0-9])|(17[0-9]))\d{8}$/

    if (mobilePhone.test(value) || !value) {
        return Promise.resolve();
    }
    else {
        return Promise.reject('手机号格式有误');
    }
}



export const checkEmail = (_rule, value) => {
    const email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/

    if (email.test(value) || !value) {
        return Promise.resolve();
    }
    else {
        return Promise.reject('邮箱格式有误');
    }
}


// 防抖函数
export const debounce = (fn, delay = 200) => {
    let timer = null
    return function () {
        const arg = arguments
        const _this = this
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(_this, arg)
        }, delay)
    }
}
