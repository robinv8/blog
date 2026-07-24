const BLOG = {
  title: 'Robin',
  author: 'Robin',
  email: 'hello@robinren.me',
  link: 'https://robinren.me',
  newsletter: 'Weekly',
  description: {
    zh: '建造者与开源贡献者。正在做会心与难文档工具箱。',
    en: 'Builder and open-source contributor. Shipping Huixin and a hard-document toolkit.'
  },
  lang: 'zh-CN',
  timezone: 'Asia/Shanghai',
  appearance: 'auto',
  font: 'sans-serif',
  lightBackground: '#F4F0E6',
  darkBackground: '#1A1714',
  path: '',
  since: 2018,
  postsPerPage: 10,
  sortByDate: true,
  pagesShow: {
    newsletter: false,
    notes: false,
    projects: true,
    contact: true,
    books: false,
    friends: false
  },
  showWeChatPay: false,
  previewImagesEnabled: false,
  autoCollapsedNavBar: false,
  ogImageGenerateHost: 'og-zl.vercel.app',
  defaultCover: '/cover.jpg',
  socialLink: {
    twitter: 'https://twitter.com/robinren716',
    github: 'https://github.com/robinv8',
    telegram: 'https://t.me/robin_0716'
  },
  seo: {
    keywords: [
      'Robin',
      'robinren',
      'Huixin',
      '会心',
      'md.robinren.me',
      '难文档',
      'Apache Answer',
      'Taro',
      'open source',
      'AI tools'
    ],
    googleSiteVerification: ''
  },
  brand: {
    name: 'Robin',
    // leerob / sive-style: short identity line (not a poster slogan)
    role: {
      zh: 'Builder · 开源贡献者',
      en: 'Builder · Open-source contributor'
    },
    // kept for SEO / og; homepage uses bio paragraphs instead
    headline: {
      zh: '在开源里做事，用工具把流程变短。',
      en: 'Work in open source. Ship tools that shorten the path.'
    },
    tagline: {
      zh: '跨端与前端出身，参与 Apache Answer、Taro。现在专注会心与难文档工具箱。',
      en: 'Cross-platform engineer. Contributor to Apache Answer and Taro. Now focused on Huixin and a hard-document toolkit.'
    },
    now: {
      label: {
        zh: '在做',
        en: 'Now'
      },
      items: [
        {
          id: 'huixin',
          name: {
            zh: '会心',
            en: 'Huixin'
          },
          description: {
            zh: '卡住时，下一句刚刚好。面向表达与创作的 AI 辅助。',
            en: 'When you are stuck, the next line is just right — AI for expression and writing.'
          },
          url: 'https://huixin.robinren.me'
        },
        {
          id: 'md-tools',
          name: {
            zh: '难文档工具箱',
            en: 'Hard-document toolkit'
          },
          description: {
            zh: '大文件与扫描件：文档转 Markdown、扫描 PDF 转可检索 PDF、拆分 PDF / PPTX / DOCX。',
            en: 'Large files and scans: documents → Markdown, scanned PDF → searchable PDF, split PDF / PPTX / DOCX.'
          },
          url: 'https://md.robinren.me'
        }
      ]
    },
    proof: {
      label: {
        zh: '开源',
        en: 'Open source'
      },
      items: [
        {
          title: {
            zh: 'Apache Answer',
            en: 'Apache Answer'
          },
          detail: {
            zh: '开源 Q&A 平台，参与维护与生态。',
            en: 'Open-source Q&A — maintenance and ecosystem.'
          },
          url: 'https://answer.apache.org'
        },
        {
          title: {
            zh: 'Taro',
            en: 'Taro'
          },
          detail: {
            zh: '跨端框架，NervJS / Taro 生态贡献。',
            en: 'Cross-platform framework — NervJS / Taro ecosystem.'
          },
          url: 'https://github.com/NervJS/taro'
        }
      ]
    },
    connect: {
      label: {
        zh: '联系',
        en: 'Connect'
      },
      text: {
        zh: '合作、开源或随便聊聊，邮件最快。',
        en: 'Collab, open source, or a hello — email is best.'
      },
      cta: {
        zh: '写邮件',
        en: 'Email me'
      }
    },
    projects: [
      {
        name: 'Apache Answer',
        description: {
          zh: '团队与社区可用的开源 Q&A 平台，参与维护与生态建设。',
          en: 'Open-source Q&A for teams and communities—core and ecosystem contributions.'
        },
        url: 'https://answer.apache.org',
        tags: ['Open Source'],
        tier: 'oss',
        featured: true
      },
      {
        name: 'Taro',
        description: {
          zh: '开放式跨端框架；NervJS / Taro 生态贡献。',
          en: 'Cross-platform framework—NervJS / Taro ecosystem contributions.'
        },
        url: 'https://github.com/NervJS/taro',
        tags: ['Open Source'],
        tier: 'oss',
        featured: true
      },
      {
        name: '会心 Huixin',
        description: {
          zh: '卡住时，下一句刚刚好 — 面向表达与创作的 AI 辅助。',
          en: 'When you are stuck, the next line is just right — AI for expression and writing.'
        },
        url: 'https://huixin.robinren.me',
        tags: ['AI', 'Product'],
        tier: 'product',
        featured: true
      },
      {
        name: '难文档工具箱',
        description: {
          zh: 'md.robinren.me — 大文件与扫描件工具箱：转 Markdown、可检索 PDF、拆分 PDF/PPTX/DOCX。',
          en: 'md.robinren.me — hard-document toolkit: to Markdown, searchable PDF, split PDF/PPTX/DOCX.'
        },
        url: 'https://md.robinren.me',
        tags: ['Product', 'Convert'],
        tier: 'product',
        featured: true
      },
      {
        name: 'AuraReader',
        description: {
          zh: '已上架 App Store 的 AI RSS 阅读器：摘要、每日/每周报告、专注阅读。aura.robinren.me',
          en: 'AI RSS reader on the App Store — digests, weekly reports, focused reading. aura.robinren.me'
        },
        url: 'https://aura.robinren.me',
        storeUrl: 'https://apps.apple.com/app/aura-rss-reader/id6758858083',
        tags: ['AI', 'iOS'],
        tier: 'product',
        featured: true
      },
      {
        name: 'Project Prompt',
        description: {
          zh: 'Goal-mode prompt coach — 目标拆成可执行 prompt 工作流。',
          en: 'Goal-mode prompt coach—goals into actionable prompt workflows.'
        },
        url: 'https://project-prompt.com',
        tags: ['AI', 'Product'],
        tier: 'product',
        featured: false
      },
      {
        name: 'SnapForm',
        description: {
          zh: '开发者智能表单填充，AI 生成测试数据。',
          en: 'AI form filler for developers—diverse test data in one click.'
        },
        url: 'https://github.com/robinv8/SnapForm',
        tags: ['AI', 'Lab'],
        tier: 'lab',
        featured: false
      },
      {
        name: 'agentmux',
        description: {
          zh: '多项目 agent 调度：本地 RPC worker 列表、分发与状态。',
          en: 'Multi-project agent mux—list, dispatch, status for local RPC workers.'
        },
        url: 'https://github.com/robinv8/agentmux',
        tags: ['AI', 'Lab'],
        tier: 'lab',
        featured: false
      }
    ]
  },
  notionPageId: process.env.NOTION_PAGE_ID,
  notionSpacesId: process.env.NOTION_SPACES_ID,
  notionAccessToken: process.env.NOTION_ACCESS_TOKEN,
  notionDomain: process.env.NOTION_DOMAIN,
  telegramToken: process.env.TELEGRAM_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,
  telegramChannelUrl: '',
  telegramChannelName: '',
  craftConfigShareUrl: process.env.CRAFT_CONFIG_SHARE_URL,
  analytics: {
    provider: '',
    ackeeConfig: {
      tracker: '',
      dataAckeeServer: '',
      domainId: ''
    },
    cfConfig: {
      scriptUrl: 'https://static.cloudflareinsights.com/beacon.min.js',
      token: ''
    },
    gaConfig: {
      measurementId: ''
    },
    umamiConfig: {
      scriptUrl: '',
      websiteId: ''
    }
  },
  comment: {
    provider: 'utterances',
    supaCommentsConfig: {
      supabaseUrl: '',
      supabaseAnonKey: ''
    },
    utterancesConfig: {
      repo: 'robinv8/blog'
    },
    giscusConfig: {
      repo: 'robinv8/blog',
      repoId: '',
      category: 'Announcements',
      categoryId: '',
      mapping: 'pathname',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme',
      lang: 'zh-CN',
      crossorigin: 'anonymous'
    }
  },
  isProd: process.env.VERCEL_ENV === 'production'
}

module.exports = BLOG
