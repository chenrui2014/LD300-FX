export default {
    pos: {
        search: '查找',
    },
    resources: {
        sys_config:{
            name:'系统配置',
            sys_name:"系统名称",
            support_phone:"技术支持电话"
        },
        cameras:{
            name:'摄像头',
            fields:{
                name:'显示名',
                ip:'ip地址',
                port:'端口',
                type:'类型',
                user:'用户名',
                pwd:'密 码',
                brand:'厂商',
                ptz:'是否支持云台功能',
                alarm:'是否支持报警输出',
                audio:'是否支持音频对讲',
                onvif_port:'onvif协议端口',
                onvif_user:'onvif协议用户名',
                onvif_pwd:'onvif协议密码',
                onvif_path:'服务地址',
                status:'状态'
            },
            add:'添加',
            notification:{}
        },
        hosts:{
            name:'主机',
            fields:{
                hostName:'显示名',
                alias:'别名',
                port:'端口号'
            }
        },
        perimeterPoint:{
            name:'周界',
            notification: {
                perimeterPoint_success: '绘制周界成功',
                perimeterPoint_error: '绘制周界失败',
            },
        },
    },
};
