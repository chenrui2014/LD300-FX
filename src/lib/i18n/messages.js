export default {
    aor: {
        action: {
            delete: '删除',
            show: '展示',
            list: '列表',
            save: '保存',
            create: '新建',
            edit: '编辑',
            cancel: '取消',
            refresh: '刷新',
            add_filter: '添加过滤条件',
            remove_filter: '移除该过滤条件',
        },
        boolean: {
            true: '是',
            false: '否',
        },
        page: {
            list: '%{name} 列表',
            edit: '%{name} #%{id}',
            show: '%{name} #%{id}',
            create: '创建 %{name}',
            delete: '删除 %{name} #%{id}',
            dashboard: '监控界面',
        },
        input: {
            file: {
                upload_several: '单击选择一个文件上传.',
                upload_single: '选择一个文件上传',
            },
            image: {
                upload_several: '单击选中一个图片上传',
                upload_single: '选中图片上传.',
            },
        },
        message: {
            yes: '是',
            no: '否',
            are_you_sure: '确定 ?',
            about: '关于',
        },
        navigation: {
            no_results: '无结果',
            page_out_of_boundaries: '页数 %{page} 超出边界',
            page_out_from_end: '已经是最后一页',
            page_out_from_begin: '已经是第一页',
            page_range_info: '%{offsetBegin}-%{offsetEnd} of %{total}',
            next: '下一页',
            prev: '上一页',
        },
        auth: {
            username: '用户名',
            password: '密  码',
            sign_in: '登  录',
            sign_in_error: '登录失败，请重试',
            logout: '退出',
        },
        notification: {
            updated: '更新',
            created: '创建',
            deleted: '删除',
            item_doesnt_exist: '该项不存在',
            http_error: '无法链接服务器',
        },
        validation: {
            required: '必填',
            minLength: '字符串至少 %{min} 位',
            maxLength: '字符串最大 %{max} 位',
            minValue: '值必须大于 %{min}',
            maxValue: '值必须小于 %{max}',
            number: '必须是数字',
            email: '请填写一个有效的邮箱',
        },
    },
};
