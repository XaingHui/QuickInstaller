import { useState, useEffect } from 'react'
import { TerminalSquare, Download, Code2, Search, X, Lock, User, Upload, LayoutDashboard, Check, Ban, Home, Trash2, Pencil } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function App() {
    const [scripts, setScripts] = useState([]);
    const [pendingScripts, setPendingScripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [activeCategory, setActiveCategory] = useState('全部');

    // Auth 状态
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [regUsername, setRegUsername] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [userData, setUserData] = useState(null);
    const [loginError, setLoginError] = useState('');

    // 上传 状态
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadDesc, setUploadDesc] = useState('');
    const [uploadVersion, setUploadVersion] = useState('1.0.0');
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadCategory, setUploadCategory] = useState('其他');
    const [uploadStatus, setUploadStatus] = useState('');
    const [uploadReadme, setUploadReadme] = useState(null); // 新增 README 状态

    // 预览 状态
    const [selectedScript, setSelectedScript] = useState(null);
    const [activeTab, setActiveTab] = useState('intro'); // intro, code, readme
    const [previewContent, setPreviewContent] = useState('');
    const [readmeContent, setReadmeContent] = useState('');
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);

    // 编辑 状态
    const [editingScript, setEditingScript] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editVersion, setEditVersion] = useState('');
    const [editCategory, setEditCategory] = useState('');

    // 获取用户信息
    const fetchUserMe = (authToken) => {
        fetch('/api/users/me', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        })
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(err => console.error("Fetch me error:", err));
    };

    // 获取公开已审核脚本
    const fetchScripts = () => {
        fetch('/api/scripts/')
            .then(res => res.json())
            .then(data => {
                setScripts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching scripts:", error);
                setLoading(false);
            });
    };

    // 获取待审核脚本 (需要 Token)
    const fetchPending = () => {
        if (!token) return;
        fetch('/api/admin/pending', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setPendingScripts(data))
            .catch(err => console.error("Admin fetch error:", err));
    };

    useEffect(() => {
        fetchScripts();
        if (token) {
            fetchPending();
            fetchUserMe(token);
        }
    }, [token]);

    const handleDownload = (id) => {
        // 直接令浏览器新建页面触发后端的下载并统计 +1
        window.open(`/api/scripts/download/${id}`, '_blank');

        // 可选：静默刷新一下列表以更新下载量展示 (稍微延迟一会等待后端写入)
        setTimeout(() => {
            fetch('/api/scripts/')
                .then(res => res.json())
                .then(data => setScripts(data));
        }, 1000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch('/api/users/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.access_token);
                localStorage.setItem('token', data.access_token);
                setIsLoginModalOpen(false);
            } else {
                setLoginError('用户名或密码错误');
            }
        } catch (err) {
            setLoginError('网络错误');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: regUsername,
                    password: regPassword,
                    display_name: regUsername // 默认昵称同用户名
                }),
            });
            if (res.ok) {
                alert("注册成功，请登录");
                setIsRegisterModalOpen(false);
                setIsLoginModalOpen(true);
            } else {
                const data = await res.json();
                alert(data.detail || "注册失败");
            }
        } catch (err) {
            alert("网络错误");
        }
    };

    const handleLogout = () => {
        setToken(null);
        setUserData(null);
        localStorage.removeItem('token');
        setIsAdminMode(false);
    };

    const handleApprove = async (id) => {
        await fetch(`/api/admin/${id}/approve`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchPending();
        fetchScripts();
    };

    const handleReject = async (id) => {
        await fetch(`/api/admin/${id}/reject`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchPending();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('确认删除该脚本？此操作不可恢复。')) return;
        await fetch(`/api/admin/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchPending();
        fetchScripts();
    };

    const openEditModal = (script) => {
        setEditingScript(script);
        setEditTitle(script.title);
        setEditDesc(script.description);
        setEditVersion(script.version);
        setEditCategory(script.category);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/scripts/${editingScript.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: editTitle,
                description: editDesc,
                version: editVersion,
                category: editCategory
            })
        });
        const data = await res.json();
        if (res.ok) {
            setEditingScript(null);
            fetchScripts();
            fetchPending();
            if (data.needs_review) {
                alert('修改已提交，脚本将重新进入审核队列。');
            }
        } else {
            alert(data.detail || '修改失败');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploadStatus('uploading');
        const formData = new FormData();
        formData.append('title', uploadTitle);
        formData.append('description', uploadDesc);
        formData.append('version', uploadVersion);
        formData.append('category', uploadCategory);
        formData.append('file', uploadFile);
        if (uploadReadme) {
            formData.append('readme', uploadReadme);
        }

        try {
            const res = await fetch('/api/scripts/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (res.ok) {
                setUploadStatus('success');
                setUploadTitle('');
                setUploadDesc('');
                setUploadFile(null);
                setUploadReadme(null);
                setTimeout(() => {
                    setIsUploadModalOpen(false);
                    setUploadStatus('');
                    fetchPending();
                }, 1500);
            } else {
                setUploadStatus('error');
            }
        } catch (err) {
            setUploadStatus('error');
        }
    };

    const fetchPreview = async (id) => {
        setIsPreviewLoading(true);
        try {
            const res = await fetch(`/api/scripts/${id}/preview`);
            const data = await res.json();
            setPreviewContent(data.content);
        } catch (e) {
            setPreviewContent("读取预览失败");
        }
        setIsPreviewLoading(false);
    };

    const fetchReadme = async (id) => {
        try {
            const res = await fetch(`/api/scripts/${id}/readme`);
            const data = await res.json();
            setReadmeContent(data.content || "作者未提供详细说明文档。");
        } catch (e) {
            setReadmeContent("加载失败");
        }
    };

    const openPreview = (script) => {
        setSelectedScript(script);
        setActiveTab('intro');
        fetchPreview(script.id);
        fetchReadme(script.id);
    };

    const filteredScripts = activeCategory === '全部'
        ? scripts
        : scripts.filter(s => s.category === activeCategory);

    return (
        <>
            <nav className="navbar" style={{ padding: '0.8rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div className="nav-brand text-gradient" style={{ cursor: 'pointer', minWidth: 'fit-content' }} onClick={() => { setIsAdminMode(false); setActiveCategory('全部'); }}>
                        <TerminalSquare size={28} color="hsl(var(--primary))" />
                        QuickInstaller
                    </div>

                    {!isAdminMode && (
                        <div className="hide-mobile" style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.3rem', borderRadius: '99px', backdropFilter: 'blur(10px)' }}>
                            {['全部', 'AI工具', 'Python相关', '其他'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                        padding: '0.4rem 1.2rem',
                                        borderRadius: '99px',
                                        border: 'none',
                                        fontSize: '0.85rem',
                                        fontWeight: '500',
                                        background: activeCategory === cat ? 'hsl(var(--primary))' : 'transparent',
                                        color: activeCategory === cat ? 'white' : 'hsl(var(--foreground))',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginLeft: 'auto' }}>
                    {userData?.role === 'admin' && (
                        <button
                            className="btn-outline"
                            style={{
                                borderColor: isAdminMode ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.3)',
                                minWidth: '110px'
                            }}
                            onClick={() => setIsAdminMode(!isAdminMode)}
                        >
                            {isAdminMode ? <><Home size={16} /> 商店首页</> : <><LayoutDashboard size={16} /> 管理后台</>}
                        </button>
                    )}

                    {token && (
                        <button className="btn-outline" onClick={() => setIsUploadModalOpen(true)}>
                            <Code2 size={16} /> 上传脚本
                        </button>
                    )}

                    {token ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: '0.5rem' }}>
                            <div style={{ textAlign: 'right' }} className="hide-mobile">
                                <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>{userData?.display_name || userData?.username}</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{userData?.role === 'admin' ? '超级管理员' : '开发者'}</div>
                            </div>
                            <div
                                onClick={handleLogout}
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'rgba(0, 0, 0, 0.85)',
                                    cursor: 'pointer',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    border: '2px solid rgba(255, 255, 255, 0.8)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                title="点击退出"
                            >
                                {(userData?.display_name || userData?.username || 'U')[0].toUpperCase()}
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-outline" style={{ border: 'none', background: 'transparent' }} onClick={() => setIsRegisterModalOpen(true)}>注册</button>
                            <button className="btn-primary" style={{ padding: '0.5rem 1.5rem' }} onClick={() => setIsLoginModalOpen(true)}>登录</button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="container">
                {isAdminMode ? (
                    <section style={{ animation: 'slideUp 0.5s ease' }}>
                        <header style={{ marginBottom: '3rem' }}>
                            <h1 className="premium-heading">待处理审核队列</h1>
                            <p style={{ color: 'hsl(var(--muted-foreground))' }}>作为管理员，请严格审查提交的代码安全性。审核通过后将立即同步至对应分类。</p>
                        </header>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {pendingScripts.length === 0 ? (
                                <div className="glass-panel" style={{ padding: '6rem 2rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
                                    <div style={{ opacity: 0.5, marginBottom: '1rem' }}><Check size={48} style={{ margin: '0 auto' }} /></div>
                                    <p style={{ fontSize: '1.1rem' }}>暂无待审核脚本，队列已排清。</p>
                                </div>
                            ) : (
                                pendingScripts.map(s => (
                                    <div key={s.id} className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '600' }}>{s.title}</h3>
                                                <span style={{
                                                    background: 'hsla(var(--primary), 0.1)',
                                                    color: 'hsl(var(--primary))',
                                                    padding: '0.1rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem'
                                                }}>{s.category}</span>
                                                <span style={{
                                                    background: 'rgba(0,0,0,0.05)',
                                                    color: 'inherit',
                                                    padding: '0.1rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem'
                                                }}>v{s.version}</span>
                                            </div>
                                            <p style={{ fontSize: '0.95rem', color: 'hsl(var(--muted-foreground))', margin: 0, maxWidth: '600px' }}>{s.description}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button className="btn-primary" style={{ background: '#10b981', padding: '0.5rem 1.25rem' }} onClick={() => handleApprove(s.id)}>
                                                <Check size={18} /> 批准
                                            </button>
                                            <button className="btn-outline" style={{ color: '#f43f5e', borderColor: '#f43f5e' }} onClick={() => handleReject(s.id)}>
                                                <Ban size={18} /> 拒绝
                                            </button>
                                            <button className="btn-outline" style={{ color: '#6b7280', borderColor: '#6b7280' }} onClick={() => handleDelete(s.id)}>
                                                <Trash2 size={18} /> 删除
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                ) : (
                    <>
                        <header style={{ textAlign: 'center', marginBottom: '4rem', animation: 'fadeIn 0.8s ease' }}>
                            <h1 className="premium-heading">
                                {activeCategory === '全部' ? '探索极客工具箱' : activeCategory}
                            </h1>
                            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto' }}>
                                {activeCategory === '全部' ? '下载经过安全审核的高级脚本，双击即可全自动检测依赖及配置。' : `为您筛选的 ${activeCategory} 相关的高质量脚本资源。`}
                            </p>

                            <div style={{ position: 'relative', maxWidth: '550px', margin: '2.5rem auto 0' }}>
                                <Search size={22} color="hsl(var(--muted-foreground))" style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="text"
                                    placeholder="搜索组件、工具或环境..."
                                    className="search-input"
                                    style={{
                                        width: '100%',
                                        padding: '1.2rem 1.2rem 1.2rem 3.5rem',
                                        borderRadius: '999px',
                                        border: '1px solid rgba(255, 255, 255, 0.6)',
                                        background: 'rgba(255, 255, 255, 0.4)',
                                        color: 'hsl(var(--foreground))',
                                        fontSize: '1.1rem',
                                        outline: 'none',
                                        transition: 'all 0.3s ease',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)'
                                    }}
                                />
                            </div>
                        </header>

                        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                            {loading ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'hsl(var(--muted-foreground))', padding: '5rem' }}>资源载入中...</div>
                            ) : filteredScripts.length === 0 ? (
                                <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '6rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
                                    <Search size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                                    <p>该分类下暂无可用脚本</p>
                                </div>
                            ) : (
                                filteredScripts.map(script => (
                                    <div key={script.id} className="glass-panel card-hover"
                                        onClick={() => openPreview(script)}
                                        style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--primary))', fontWeight: 'bold', marginBottom: '0.4rem' }}>{script.category}</div>
                                                    {script.readme_path && <span title="包含详尽说明文档" style={{ fontSize: '0.7rem', color: 'hsl(var(--primary))', background: 'hsla(var(--primary), 0.1)', padding: '0 0.4rem', borderRadius: '4px' }}>📖 DOC</span>}
                                                </div>
                                                <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>{script.title}</h3>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                                <span style={{
                                                    background: 'hsla(var(--primary), 0.1)',
                                                    color: 'hsl(var(--primary))',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '99px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '500'
                                                }}>v{script.version}</span>
                                                {(userData?.role === 'admin' || userData?.id === script.author_id) && (
                                                    <button
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem', color: 'hsl(var(--muted-foreground))', opacity: 0.4, transition: 'opacity 0.2s' }}
                                                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                                        onMouseLeave={e => e.currentTarget.style.opacity = '0.4'}
                                                        onClick={(e) => { e.stopPropagation(); openEditModal(script); }}
                                                        title="编辑此脚本"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.95rem', lineHeight: '1.6', flexGrow: 1, marginBottom: '2rem' }}>{script.description}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))', fontSize: '0.85rem', fontWeight: '500' }}>
                                                <Download size={14} /> {script.downloads} 下载
                                            </div>
                                            <button className="btn-primary" style={{ padding: '0.6rem 1.2rem' }} onClick={(e) => { e.stopPropagation(); handleDownload(script.id); }}>
                                                <Download size={16} /> 获取
                                            </button>
                                            {userData?.role === 'admin' && (
                                                <button
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: '#ef4444', opacity: 0.5, transition: 'opacity 0.2s' }}
                                                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                                    onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(script.id); }}
                                                    title="删除此脚本"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </section>
                    </>
                )}
            </main>

            {/* 登录弹窗 */}
            {isLoginModalOpen && (
                <div className="modal-overlay"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={() => setIsLoginModalOpen(false)}>
                    <div className="glass-panel animate-zoom" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h2 className="premium-heading" style={{ fontSize: '1.5rem' }}>欢迎回来</h2>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }} onClick={() => setIsLoginModalOpen(false)}>
                                <X size={24} style={{ opacity: 0.4 }} />
                            </button>
                        </div>
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label">用户名</label>
                                <input type="text" className="form-input"
                                    required value={username} onChange={e => setUsername(e.target.value)} placeholder="输入登录账号" />
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label className="form-label">密码</label>
                                <input type="password" className="form-input"
                                    required value={password} onChange={e => setPassword(e.target.value)} placeholder="输入登录密码" />
                            </div>
                            {loginError && <p style={{ color: '#f43f5e', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{loginError}</p>}
                            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', justifyContent: 'center' }}>立即进入</button>
                            <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '2rem', color: 'hsl(var(--muted-foreground))' }}>
                                还没有账号？ <span style={{ color: 'hsl(var(--primary))', cursor: 'pointer', fontWeight: '600' }} onClick={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }}>免费注册</span>
                            </p>
                        </form>
                    </div>
                </div>
            )}

            {/* 注册弹窗 */}
            {isRegisterModalOpen && (
                <div className="modal-overlay"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={() => setIsRegisterModalOpen(false)}>
                    <div className="glass-panel animate-zoom" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h2 className="premium-heading" style={{ fontSize: '1.5rem' }}>加入开发者社区</h2>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }} onClick={() => setIsRegisterModalOpen(false)}>
                                <X size={24} style={{ opacity: 0.4 }} />
                            </button>
                        </div>
                        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label">账户名</label>
                                <input type="text" className="form-input"
                                    required value={regUsername} onChange={e => setRegUsername(e.target.value)} placeholder="字母、数字、下划线" />
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label className="form-label">设置密码</label>
                                <input type="password" className="form-input"
                                    minLength={6} required value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="至少 6 位字符" />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', justifyContent: 'center' }}>提交并创建</button>
                            <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '2rem', color: 'hsl(var(--muted-foreground))' }}>
                                已有账号？ <span style={{ color: 'hsl(var(--primary))', cursor: 'pointer', fontWeight: '600' }} onClick={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); }}>进入登录</span>
                            </p>
                        </form>
                    </div>
                </div>
            )}

            {/* 上传弹窗 */}
            {isUploadModalOpen && (
                <div className="modal-overlay"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={() => setIsUploadModalOpen(false)}>
                    <div className="glass-panel animate-zoom" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '600px', padding: '2rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 className="premium-heading" style={{ fontSize: '1.4rem' }}>分发您的脚本</h2>
                                <p style={{ fontSize: '0.85rem', opacity: 0.6, margin: '4px 0 0' }}>提交后将在管理员通过后上线</p>
                            </div>
                            <X size={24} style={{ cursor: 'pointer', opacity: 0.4 }} onClick={() => setIsUploadModalOpen(false)} />
                        </div>

                        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1.5rem' }} className="custom-scrollbar">
                                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.2fr 1.2fr', gap: '1rem', marginBottom: '1.2rem' }}>
                                    <div>
                                        <label className="form-label">脚本标题</label>
                                        <input type="text" className="form-input"
                                            required value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="例如: Git 环境配置" />
                                    </div>
                                    <div>
                                        <label className="form-label">分类</label>
                                        <select className="form-input"
                                            value={uploadCategory} onChange={e => setUploadCategory(e.target.value)}>
                                            <option value="AI工具">AI工具</option>
                                            <option value="Python相关">Python相关</option>
                                            <option value="其他">其他</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">版本</label>
                                        <input type="text" className="form-input"
                                            value={uploadVersion} onChange={e => setUploadVersion(e.target.value)} />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.2rem' }}>
                                    <label className="form-label">功能描述</label>
                                    <textarea className="form-input" style={{ height: '70px', resize: 'none' }}
                                        required value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} placeholder="简述脚本的主要功能和适用系统..." />
                                </div>

                                <div style={{ marginBottom: '1.2rem' }}>
                                    <div
                                        className={`upload-zone ${uploadFile ? 'has-file' : ''}`}
                                        onDragOver={e => e.preventDefault()}
                                        onDrop={e => {
                                            e.preventDefault();
                                            setUploadFile(e.dataTransfer.files[0]);
                                        }}
                                    >
                                        <input type="file" id="fileInput" hidden onChange={e => setUploadFile(e.target.files[0])} />
                                        <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'block', width: '100%', height: '100%' }}>
                                            <Upload style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                            <p style={{ margin: 0 }}>{uploadFile ? uploadFile.name : '拖拽脚本或点击浏览'}</p>
                                            <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>支持 .ps1, .sh, .bat</span>
                                        </label>
                                    </div>
                                </div>

                                <div style={{ background: 'hsla(var(--primary), 0.05)', padding: '1.2rem', borderRadius: '16px', border: '1px solid hsla(var(--primary), 0.1)', transition: 'all 0.3s' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                        <input type="checkbox" id="readme-check" style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'hsl(var(--primary))' }}
                                            onChange={e => { if (!e.target.checked) setUploadReadme(null); }} />
                                        <label htmlFor="readme-check" style={{ fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', userSelect: 'none' }}>附带 README 说明文档</label>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <input type="file" id="readme-file" accept=".md,.txt" hidden onChange={e => setUploadReadme(e.target.files[0])} />
                                        <label htmlFor="readme-file" style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                            padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                            fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
                                            transition: 'all 0.2s', opacity: 0.8
                                        }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.opacity = 1 }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.opacity = 0.8 }}>
                                            <Upload size={14} /> {uploadReadme ? '更换文档' : '选择 README'}
                                        </label>
                                        {uploadReadme && (
                                            <span style={{ marginLeft: '1rem', fontSize: '0.85rem', color: '#10b981', fontWeight: '500', animation: 'fadeIn 0.3s ease' }}>
                                                已选: {uploadReadme.name}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Check size={12} /> 优质说明文档将获得更快的审核优先级 🚀
                                    </p>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" disabled={uploadStatus === 'uploading'} style={{ width: '100%', padding: '1.2rem', justifyContent: 'center', borderRadius: '14px', fontSize: '1rem' }}>
                                {uploadStatus === 'uploading' ? '上传中...' : '提交审核'}
                            </button>
                            {uploadStatus === 'success' && <p style={{ color: '#10b981', textAlign: 'center', marginTop: '1rem' }}>上传成功！正在等待管理员审核。</p>}
                            {uploadStatus === 'error' && <p style={{ color: '#f43f5e', textAlign: 'center', marginTop: '1rem' }}>上传失败，请检查网络或格式。</p>}
                        </form>
                    </div>
                </div>
            )}

            {/* 编辑弹窗 */}
            {editingScript && (
                <div className="modal-overlay"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={() => setEditingScript(null)}>
                    <div className="glass-panel animate-zoom" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px', padding: '2.5rem 2rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h2 className="premium-heading" style={{ fontSize: '1.4rem' }}>编辑脚本信息</h2>
                                <p style={{ fontSize: '0.85rem', opacity: 0.6, margin: '4px 0 0' }}>
                                    {userData?.role === 'admin' ? '管理员编辑：修改后直接生效' : '修改后将重新进入审核队列'}
                                </p>
                            </div>
                            <X size={24} style={{ cursor: 'pointer', opacity: 0.4 }} onClick={() => setEditingScript(null)} />
                        </div>

                        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="form-label">脚本标题</label>
                                    <input type="text" className="form-input"
                                        required value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                                </div>
                                <div>
                                    <label className="form-label">版本号</label>
                                    <input type="text" className="form-input"
                                        value={editVersion} onChange={e => setEditVersion(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">分类</label>
                                <select className="form-input"
                                    value={editCategory} onChange={e => setEditCategory(e.target.value)}>
                                    <option value="AI工具">AI工具</option>
                                    <option value="Python相关">Python相关</option>
                                    <option value="其他">其他</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">功能描述</label>
                                <textarea className="form-input" style={{ height: '100px', resize: 'none' }}
                                    required value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '1rem', justifyContent: 'center' }}>保存修改</button>
                                {userData?.role === 'admin' && (
                                    <button type="button" style={{
                                        padding: '1rem 1.5rem',
                                        background: '#fef2f2',
                                        color: '#ef4444',
                                        border: '1px solid #fecaca',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        fontWeight: '600'
                                    }} onClick={() => { handleDelete(editingScript.id); setEditingScript(null); }}>
                                        <Trash2 size={16} /> 删除
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )
            }

            {/* 脚本详情预览弹窗 */}
            {
                selectedScript && (
                    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setSelectedScript(null)}>
                        <div className="glass-panel animate-zoom" onClick={e => e.stopPropagation()}
                            style={{ width: '90%', maxWidth: '900px', height: '85vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>

                            {/* Header */}
                            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: 'hsl(var(--primary))', padding: '0.6rem', borderRadius: '12px', color: 'white' }}>
                                        <Code2 size={24} />
                                    </div>
                                    <div>
                                        <h2 className="premium-heading" style={{ fontSize: '1.4rem', margin: 0 }}>{selectedScript.title}</h2>
                                        <div style={{ fontSize: '0.85rem', opacity: 0.5 }}>{selectedScript.category} • v{selectedScript.version}</div>
                                    </div>
                                </div>
                                <X size={24} style={{ cursor: 'pointer', opacity: 0.4 }} onClick={() => setSelectedScript(null)} />
                            </div>

                            {/* Tabs Navigation */}
                            <div style={{ display: 'flex', gap: '1rem', padding: '0.5rem 2rem', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                {[
                                    { id: 'intro', label: '项目详情', icon: <User size={14} /> },
                                    { id: 'code', label: '逻辑预览', icon: <Check size={14} /> },
                                    { id: 'readme', label: '说明文档', icon: <TerminalSquare size={14} /> }
                                ].map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            padding: '0.8rem 1.2rem',
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: activeTab === tab.id ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                                            opacity: activeTab === tab.id ? 1 : 0.6,
                                            borderBottom: `2px solid ${activeTab === tab.id ? 'hsl(var(--primary))' : 'transparent'}`,
                                            display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600',
                                            transition: 'all 0.3s'
                                        }}>
                                        {tab.icon} {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Content Area */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }} className="custom-scrollbar">
                                {activeTab === 'intro' && (
                                    <div style={{ animation: 'fadeIn 0.4s ease' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem' }}>
                                            <div>
                                                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.4, marginBottom: '0.8rem' }}>功能详情</h4>
                                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.8, whiteSpace: 'pre-wrap' }}>{selectedScript.description}</p>
                                            </div>
                                            <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
                                                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.4, marginBottom: '1rem' }}>工具包信息</h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ opacity: 0.5 }}>发布日期</span>
                                                        <span>{new Date(selectedScript.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ opacity: 0.5 }}>已安装次数</span>
                                                        <span>{selectedScript.downloads} 次</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ opacity: 0.5 }}>安全自适应</span>
                                                        <span style={{ color: '#10b981' }}>已通过</span>
                                                    </div>
                                                    <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }} onClick={() => handleDownload(selectedScript.id)}>
                                                        一键获取 (.ps1)
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'code' && (
                                    <div style={{ animation: 'fadeIn 0.4s ease', height: '100%' }}>
                                        {isPreviewLoading ? (
                                            <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>正在解析脚本逻辑...</div>
                                        ) : (
                                            <div style={{ position: 'relative', height: '100%' }}>
                                                <pre style={{
                                                    background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '12px', padding: '1.5rem', color: '#e5e7eb', fontSize: '0.9rem',
                                                    fontFamily: 'Consolas, Monaco, monospace', lineHeight: '1.6', overflow: 'auto',
                                                    maxHeight: '500px'
                                                }}>
                                                    {previewContent}
                                                </pre>
                                                <p style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '1rem', textAlign: 'center' }}>
                                                    提示：当前仅展示前 200 行代码预览，完整执行流程请下载后查看。
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'readme' && (
                                    <div style={{ animation: 'fadeIn 0.4s ease' }}>
                                        {readmeContent ? (
                                            <div className="markdown-body" style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', borderLeft: '4px solid hsl(var(--primary))', paddingLeft: '1.5rem', opacity: 0.9 }}>
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {readmeContent}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '5rem' }}>
                                                <div style={{ opacity: 0.2, marginBottom: '1rem' }}><Code2 size={48} style={{ margin: '0 auto' }} /></div>
                                                <p style={{ opacity: 0.4 }}>该作者暂未提供说明文档。</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default App
