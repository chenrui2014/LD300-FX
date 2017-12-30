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
                screenShot:'是否支持截屏',
                serial_port:'云台控制串口',
                onvif_port:'onvif协议端口',
                onvif_user:'onvif协议用户名',
                onvif_pwd:'onvif协议密码',
                onvif_path:'服务地址',
                preset:'预置点',
                status:'状态'
            },
            add:'添加',
            notification:{}
        },
        cameraType:{
            name:'摄像头类型',
            fields:{
                typeName:'类型名称',
                typeCode:'类型编码'
            }
        },
        vendor:{
            name:'厂商',
            fields:{
                vendorName:'厂商名称',
                vendorCode:'厂商编码',
                telephone:'厂商电话',
                address:'厂商地址'
            }
        },
        hosts:{
            name:'主机',
            fields:{
                hostName:'显示名',
                alias:'别名',
                port:'端口号'
            }
        },
        perimeter:{
            name:'周界',
            fields:{
                name:'周界名称',
                hostId:'关联主机'
            }
        },
        pp:{
            name:'绘制周界',
            notification: {
                pp_success: '绘制周界成功',
                pp_error: '绘制周界失败',
            },
        },
        monitoringArea:{
            name:'监控区域',
            fields: {
                perimeterId: '周界',
                cameraId: '摄像头',
                num:'序号',
                min_dis: '监控起始距离(米)',
                max_dis: '监控结束距离（米）'
            }
        },
        preset:{
            name:'预置点',
            fields: {
                cameraId: '摄像头',
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
        },
        event:{
            name:'事件',
            fields:{
                happenTime:'发生时间',
                position:'触警位置',
                eventType:'事件性质',
                eventHandler:'处理员',
                video:'调取录像'
            }
        }
    },
};
