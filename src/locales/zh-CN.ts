export default {
    welcome: "你好！",
    "locale.name": "简体中文",

    "button.copy-tip": "复制成功",
    "button.connect-redis": "连接到 Redis 服务器",


    "sidebar.menu.server.reload-tip": "重新加载服务器",
    "sidebar.menu.server.edit-tip": "编辑连接设置",
    "sidebar.menu.server.copy-tip": "复制 Redis URI",
    "sidebar.menu.server.delete-tip": "删除连接",
    "sidebar.menu.server.delete-confirm": "您确定要删除该连接吗？",
    "sidebar.menu.db.filter-tip": "打开键筛选器",
    "sidebar.menu.db.filter-prompt": "输入需要筛选的键:",
    "sidebar.menu.db.reload-tip": "重新加载数据库中的键",
    "sidebar.menu.group.reload-tip": "重新加载命名空间",
    "sidebar.menu.group.add-tip": "添加新键",
    "sidebar.menu.group.delete-tip": "删除命名空间",
    "sidebar.menu.group.delete-confirm": "您确定要删除该键吗？",
    "sidebar.menu.group.copy-tip": "复制命名空间模式",
    "sidebar.menu.info.copy-tip": "复制键名称",


    "editor.toolbar.button.copy": "复制",
    "editor.toolbar.button.save": "保存",
    "editor.toolbar.button.delete": "删除",
    "editor.toolbar.button.delete-row": "删除行",
    "editor.toolbar.button.reload": "重新载入",
    "editor.toolbar.button.export": "导出文件",
    "editor.toolbar.ttl.title": "设置键的 TTL",
    "editor.toolbar.ttl.placeholder": "新的 TTL，-1 是持久化",
    "editor.toolbar.ttl.unit": ["秒", "时", "天"],
    "editor.toolbar.length.title": "长度",
    "editor.toolbar.length.unit": "条",
    "editor.toolbar.size.title": "大小",
    "editor.toolbar.size.unit": "字节",
    "editor.delete.tip.confirm": "确定要删除该键吗？",
    "editor.delete-row.tip.confirm": "确定要删除该行数据吗？",
    "editor.save.key.confirm": "确定要更改该键吗？",
    "editor.save.success": "保存成功",
    "editor.delete.success": "删除成功",



    "settings.title": "设置",
    "settings.general": "常规",
    "settings.theme": "主题",
    "settings.language": "语言",
    "settings.font.family": "字体",
    "settings.font.size": "字号",
    "settings.value.editor": "值编辑器",
    "settings.advanced": "高级设置",
    "settings.advanced.confirm-same-name-overlap": "同名覆盖需要确认",
    "settings.advanced.maximum-number-per-page": "每页最大条数",
    "settings.advanced.scan-upper-limit": "SCAN 命令的限制数量",


    "connection.title": "连接设置",
    "connection.title-new": "新建连接设置",
    "connection.settings": "连接设置",
    "connection.settings.name": "名称",
    "connection.settings.name.placeholder": "连接名称",
    "connection.settings.address": "IP地址",
    "connection.settings.address.placeholder": "Redis 服务器主机，例如127.0.0.1",
    "connection.settings.port.placeholder": "端口号",
    "connection.settings.password": "密　码",
    "connection.settings.password.placeholder": "（可选）Redis 服务器身份验证密码",
    "connection.settings.username": "用户名",
    "connection.settings.username.placeholder": "（可选）Redis 服务器身份验证用户名（Redis > 6.0）",

    "connection.settings.security": "安全",
    "connection.settings.security.tls": "SSH / TLS",
    "connection.settings.security.tls.select-file": "选择文件",
    "connection.settings.security.tls.public": "公钥",
    "connection.settings.security.tls.public.placeholder": "（可选）PEM 格式的公钥",
    "connection.settings.security.tls.private": "私钥",
    "connection.settings.security.tls.private.placeholder": "（可选）PEM 格式的私钥",
    "connection.settings.security.tls.authority": "权限",
    "connection.settings.security.tls.authority.placeholder": "（可选）PEM 格式的权限",

    "connection.settings.security.tunnel": "SSH Tunnel",
    "connection.settings.security.tunnel.address": "SSH 地址",
    "connection.settings.security.tunnel.address.placeholder": "SSH 服务器的远程主机 IP 地址",
    "connection.settings.security.tunnel.port.placeholder": "端口号",
    "connection.settings.security.tunnel.user": "SSH 用户",
    "connection.settings.security.tunnel.user.placeholder": "有效的SSH用户名",
    "connection.settings.security.tunnel.private": "私钥",
    "connection.settings.security.tunnel.private.type": "私钥",
    "connection.settings.security.tunnel.private.placeholder": "PEM 格式的私钥路径",
    "connection.settings.security.tunnel.private.button": "选择文件",
    "connection.settings.security.tunnel.password": "密码",
    "connection.settings.security.tunnel.password.type": "SSH 密码",
    "connection.settings.security.tunnel.password.placeholder": "SSH用户密码",



    "connection.advanced": "高级设置",

    "connection.advanced.keys-loading": "键名称加载",
    "connection.advanced.keys-loading.default-filter": "默认筛选器",
    "connection.advanced.keys-loading.default-filter.placeholder": "定义从 redis 服务器加载键名称的模式",
    "connection.advanced.keys-loading.namespace-separator": "命名空间分隔符",
    "connection.advanced.keys-loading.namespace-separator.placeholder": "用于从键中提取命名空间的分隔符",

    "connection.advanced.tl": "超时和限制",
    "connection.advanced.tl.connection-timeout": "连接超时（秒）",
    "connection.advanced.tl.connection-timeout.placeholder": "连接 redis 服务器超时（秒）",
    "connection.advanced.tl.execution-timeout": "执行超时（秒）",
    "connection.advanced.tl.execution-timeout.placeholder": "执行 redis 服务器命令超时（秒）",

    "connection.advanced.appearance": "外观",
    "connection.advanced.appearance.icon-color": "图标颜色",


    "connection.button.result": "成功连接到 redis 服务器，当前版本：",
    "connection.button.test": "测试连接",
    "connection.button.submit": "确认",



    "connection.error.success": "成功连接到 redis 服务器，当前版本：",
    "connection.error.fail": "无法连接到 redis 服务器",


    "errors.505": "键名已存在，是否要覆盖？",



};
