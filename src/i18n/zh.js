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
                type:'类型',
                manufacturer:'厂商',
                Video_protocol:'音视频协议及端口',
                talkBack:'是否支持对讲',
                yunTai_protocol:'云台协议及端口',
                status:'状态'
            },
            add:'添加'
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
            name:'周界'
        },
    },
};
