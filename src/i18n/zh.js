export default {
    pos: {
        search: '查找',
    },
    resources: {
        sys_config:{
            name:'系统配置',
            sys_name:"系统名称",
            company:"公司",
            support_phone:"技术支持电话",
            use_unit:"使用单位"
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
        pp:{
            name:'周界',
            notification: {
                pp_success: '绘制周界成功',
                pp_error: '绘制周界失败',
            },
        },
        monitoringArea:{
            name:'监控区域',
            fields: {
                hostId: '主机',
                cameraId: '摄像头',
                min_dis: '监控起始距离(米)',
                max_dis: '监控结束距离（米）'
            }
        },
        preset:{
            name:'预置点',
            fields: {
                monitorId: '监控区域',
                x: 'x坐标',
                y: 'y坐标',
                z: 'z坐标',
                preset:'预置点名称',
                distance:'监控距离'
            }
        },
        config:{
            name:'系统配置',
            fields:{
                sysName:'系统名称',
                company:'公司',
                telephone:'技术支持电话',
                useUnit:'使用单位'
            }
        }
    },
};
