import {
	Rocket,
	Tag,
	Gamepad2,
	BookOpen,
	RefreshCw,
	Users,
	Compass,
	Package,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'guide' -> t('nav.guide')
	path: string // URL 路径，如 '/guide'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// Disney Dreamlight Valley Honeyglow Woods 内容分类（8 个，与 content/ 目录、locales nav/pages 一一对应）
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'release', path: '/release', icon: Rocket, isContentType: true },
	{ key: 'price', path: '/price', icon: Tag, isContentType: true },
	{ key: 'platform', path: '/platform', icon: Gamepad2, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'update', path: '/update', icon: RefreshCw, isContentType: true },
	{ key: 'characters', path: '/characters', icon: Users, isContentType: true },
	{ key: 'quests', path: '/quests', icon: Compass, isContentType: true },
	{ key: 'items', path: '/items', icon: Package, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['release', 'price', 'platform', 'guide', 'update', 'characters', 'quests', 'items']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
