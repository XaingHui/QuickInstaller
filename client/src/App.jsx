import { useState, useEffect } from 'react'
import { TerminalSquare, Download, Code2, Search } from 'lucide-react'

// 模拟的脚本数据类型，未来会由后端 API "/api/scripts" 供给
const MOCK_SCRIPTS = [
    {
        id: 1,
        title: "Claude Dev Environment",
        description: "一键配置完整的 Claude AI 辅助开发桌面环境。包含所需的 Node.js 检查与 CLI 工具连结。",
        version: "1.2.0",
        downloads: 1250,
        tags: ["AI", "Development"]
    },
    {
        id: 2,
        title: "Docker Desktop Setup",
        description: "通过 PowerShell 自动启用 WSL2 并在后台完成整个 Docker 环境搭建，免手动重启安装。",
        version: "2.1.0",
        downloads: 382,
        tags: ["DevOps", "Container"]
    },
    {
        id: 3,
        title: "Python Data Science Kit",
        description: "自动安装 Anaconda、Jupyter 以及最热门的一套数据科学加速包，一步到位搞定繁琐编译依赖。",
        version: "4.0.1",
        downloads: 5000,
        tags: ["Data Science", "Python"]
    }
];

function App() {
    const [scripts, setScripts] = useState([]);

    // 将来对接后端的 useEffect
    useEffect(() => {
        // fetch('/api/scripts').then()...
        setScripts(MOCK_SCRIPTS);
    }, []);

    return (
        <>
            <nav className="navbar">
                <div className="nav-brand text-gradient">
                    <TerminalSquare size={28} color="hsl(var(--primary))" />
                    QuickInstaller
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-outline">
                        <Code2 size={16} /> 成为开发者上传
                    </button>
                    <button className="btn-primary">
                        管理员登录
                    </button>
                </div>
            </nav>

            <main className="container">
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                        发现并离线加速 <br />
                        您的软件安装工作流
                    </h1>
                    <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        下载经过安全审核的高级脚本，双击即可全自动检测依赖及配置环境变量。零人工干预的极客体验。
                    </p>

                    <div style={{ position: 'relative', maxWidth: '500px', margin: '2rem auto 0' }}>
                        <Search
                            size={20}
                            color="hsl(var(--muted-foreground))"
                            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                        />
                        <input
                            type="text"
                            placeholder="搜索 Claude、Docker 或 Python 环境..."
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '999px',
                                border: '1px solid rgba(255, 255, 255, 0.6)',
                                background: 'rgba(255, 255, 255, 0.4)',
                                color: 'hsl(var(--foreground))',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)'
                            }}
                            onFocus={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                                e.target.style.borderColor = 'hsl(var(--primary))';
                                e.target.style.boxShadow = '0 0 0 3px hsla(var(--primary), 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                </header>

                <section style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '2rem'
                }}>
                    {scripts.map(script => (
                        <div key={script.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{script.title}</h3>
                                <span style={{
                                    background: 'hsla(var(--primary), 0.1)',
                                    color: 'hsl(var(--primary))',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '99px',
                                    fontSize: '0.8rem',
                                    fontWeight: '500'
                                }}>
                                    v{script.version}
                                </span>
                            </div>

                            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.95rem', lineHeight: '1.5', flexGrow: 1, marginBottom: '1.5rem' }}>
                                {script.description}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid hsla(var(--border), 0.5)', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--muted-foreground))', fontSize: '0.85rem' }}>
                                    <Download size={14} />
                                    {script.downloads} 次下载
                                </div>
                                <button className="btn-primary" style={{ padding: '0.4rem 1rem' }}>
                                    <Download size={16} /> 下载脚本
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </>
    )
}

export default App
