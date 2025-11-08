import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Application, BitmapFont, BitmapText, Container as PixiContainer, Graphics } from "pixi.js"
import { LOTTERY_ANIMATION_DURATION_MS, LOTTERY_RESULT_DELAY_MS } from "@/lib/lotteryConstants"

interface Participant {
    name: string
    student_id: string
}

interface LotteryAnimationProps {
    participants: Participant[]
    count: number
    onComplete: (winners: Participant[]) => void
    isRunning: boolean
}

interface TileState {
    container: PixiContainer
    background: Graphics
    label: BitmapText
    timeout?: ReturnType<typeof setTimeout>
}

const BITMAP_FONT_NAME = "LotteryTilesFont"
const TILE_GAP = 12
const TILE_COLORS = [0xffc857, 0xff6b6b, 0x6c63ff, 0x2ec4b6, 0xffa8b4, 0xff9f1c]

let bitmapFontRegistered = false

const ensureBitmapFont = () => {
    if (bitmapFontRegistered) return
    BitmapFont.install({
        name: BITMAP_FONT_NAME,
        style: {
            fontFamily: "Fredoka, sans-serif",
            fontSize: 44,
            fill: "#1f2933",
            align: "center",
        },
        chars: [[" ", "~"]],
        resolution: 2,
        padding: 2,
    })
    bitmapFontRegistered = true
}

const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const easeOutBack = (t: number) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min

const pickNameGenerator = (names: string[]) => {
    if (names.length === 0) {
        return () => "敬请期待"
    }
    let lastIndex = -1
    return () => {
        let index = Math.floor(Math.random() * names.length)
        if (index === lastIndex) {
            index = (index + 1) % names.length
        }
        lastIndex = index
        return names[index]
    }
}

const centerBitmapText = (label: BitmapText) => {
    const anyLabel = label as BitmapText & { anchor?: { set: (x: number, y: number) => void } }
    if (anyLabel.anchor) {
        anyLabel.anchor.set(0.5, 0.5)
    } else {
        label.pivot.set(label.width / 2, label.height / 2)
    }
}

const deriveGrid = (width: number, height: number) => {
    const targetSize = 140
    const columns = Math.max(4, Math.round(width / targetSize))
    const rows = Math.max(3, Math.round(height / targetSize))
    return { columns, rows }
}

const createTileLayer = (
    app: Application,
    names: string[],
    registerTickerCleanup: (cleanup: () => void) => void,
) => {
    const { width, height } = app.renderer
    const { columns, rows } = deriveGrid(width, height)
    const tileWidth = width / columns
    const tileHeight = height / rows

    const tilesLayer = new PixiContainer()
    app.stage.addChild(tilesLayer)

    const tiles: TileState[] = []
    const getNextName = pickNameGenerator(names)

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const container = new PixiContainer()
            container.position.set(col * tileWidth + tileWidth / 2, row * tileHeight + tileHeight / 2)
            tilesLayer.addChild(container)

            const innerWidth = tileWidth - TILE_GAP
            const innerHeight = tileHeight - TILE_GAP
            const radius = Math.min(innerWidth, innerHeight) * 0.18

            const background = new Graphics()
            background.roundRect(-innerWidth / 2, -innerHeight / 2, innerWidth, innerHeight, radius)
            const tileColor = TILE_COLORS[(row + col) % TILE_COLORS.length]
            background.fill({ color: tileColor, alpha: 0.95 })
            background.stroke({ color: 0xffffff, width: 3, alpha: 0.35 })
            container.addChild(background)

            const label = new BitmapText({
                text: getNextName(),
                style: {
                    fontName: BITMAP_FONT_NAME,
                    fontSize: Math.max(innerHeight * 0.32, 20),
                    align: "center",
                    tint: 0x1f1f1f,
                },
            })
            centerBitmapText(label)
            label.alpha = 0.85
            container.addChild(label)

            tiles.push({ container, background, label })
        }
    }

    const runTween = (duration: number, update: (t: number) => void, complete?: () => void) => {
        const start = performance.now()
        const ticker = app.ticker

        const tick = () => {
            const elapsed = performance.now() - start
            const progress = Math.min(1, elapsed / duration)
            update(progress)
            if (progress >= 1) {
                ticker.remove(tick)
                complete?.()
            }
        }
        ticker.add(tick)
        const cleanup = () => ticker.remove(tick)
        registerTickerCleanup(() => cleanup())
    }

    const animateTile = (tile: TileState) => {
        const fadeOutDuration = randomRange(120, 220)
        const fadeInDuration = randomRange(260, 420)

        const startFadeIn = () => {
            tile.label.text = getNextName()
            tile.label.alpha = 0
            tile.container.scale.set(0.92)

            runTween(fadeInDuration, (progress) => {
                const eased = easeOutBack(progress)
                tile.label.alpha = eased
                const scale = 0.92 + 0.08 * eased
                tile.container.scale.set(scale)
            })
        }

        runTween(
            fadeOutDuration,
            (progress) => {
                const eased = easeInOutQuad(1 - progress)
                tile.label.alpha = eased
                const scale = 0.92 + 0.08 * eased
                tile.container.scale.set(scale)
            },
            () => {
                startFadeIn()
            },
        )
    }

    const timeouts: ReturnType<typeof setTimeout>[] = []
    const scheduleTile = (tile: TileState) => {
        const delay = randomRange(150, 1600)
        const timeout = window.setTimeout(() => {
            animateTile(tile)
            scheduleTile(tile)
        }, delay)
        tile.timeout = timeout
        timeouts.push(timeout)
    }

    tiles.forEach((tile) => scheduleTile(tile))

    const cleanup = () => {
        timeouts.forEach((timeout) => clearTimeout(timeout))
        tiles.forEach((tile) => {
            if (tile.timeout) clearTimeout(tile.timeout)
        })
        tilesLayer.destroy({ children: true })
    }

    return { cleanup }
}

export const LotteryAnimation = ({ participants, count, onComplete, isRunning }: LotteryAnimationProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const appRef = useRef<Application | null>(null)
    const sceneCleanupRef = useRef<(() => void) | null>(null)
    const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const tickerCleanupRef = useRef<(() => void)[]>([])
    const [animationPayload, setAnimationPayload] = useState<{
        participants: Participant[]
        winners: Participant[]
    } | null>(null)

    const destroyPixi = useCallback(() => {
        tickerCleanupRef.current.forEach((cleanup) => cleanup())
        tickerCleanupRef.current = []
        sceneCleanupRef.current?.()
        sceneCleanupRef.current = null

        if (appRef.current) {
            appRef.current.destroy(true)
            appRef.current = null
        }

        if (containerRef.current) {
            containerRef.current.innerHTML = ""
        }
    }, [])

    useEffect(() => {
        if (!isRunning) {
            setAnimationPayload(null)
            destroyPixi()
            return
        }

        if (participants.length === 0 || animationPayload) {
            return
        }

        const shuffled = [...participants].sort(() => Math.random() - 0.5)
        const winners = shuffled.slice(0, count)
        setAnimationPayload({ participants: [...participants], winners })
    }, [animationPayload, count, destroyPixi, isRunning, participants])

    useEffect(() => {
        if (!isRunning || !animationPayload) return
        const container = containerRef.current
        if (!container) return

        destroyPixi()
        ensureBitmapFont()

        const app = new Application()
        appRef.current = app

        let cancelled = false

        const initApp = async () => {
            await app.init({
                backgroundAlpha: 0,
                antialias: true,
                resolution: window.devicePixelRatio || 1,
                resizeTo: container,
            })
            if (cancelled) return
            container.innerHTML = ""
            container.appendChild(app.canvas)

            const { cleanup } = createTileLayer(app, animationPayload.participants.map((p) => p.name), (cleanupFn) => {
                tickerCleanupRef.current.push(cleanupFn)
            })
            sceneCleanupRef.current = cleanup
        }

        initApp().catch(() => {
            // 若初始化失败，确保清理
            destroyPixi()
        })

        return () => {
            cancelled = true
            destroyPixi()
        }
    }, [animationPayload, destroyPixi, isRunning])

    useEffect(() => {
        if (!animationPayload) return
        if (resultTimeoutRef.current) {
            clearTimeout(resultTimeoutRef.current)
        }

        resultTimeoutRef.current = window.setTimeout(() => {
            onComplete(animationPayload.winners)
        }, LOTTERY_ANIMATION_DURATION_MS + LOTTERY_RESULT_DELAY_MS)

        return () => {
            if (resultTimeoutRef.current) {
                clearTimeout(resultTimeoutRef.current)
                resultTimeoutRef.current = null
            }
        }
    }, [animationPayload, onComplete])

    useEffect(() => {
        return () => destroyPixi()
    }, [destroyPixi])

    const winnerNames = useMemo(() => animationPayload?.winners.map((w) => w.name).join(", ") ?? "", [animationPayload])

    if (!isRunning) return null

    return (
        <div className="fixed inset-0 z-40 flex items-stretch justify-center bg-gradient-to-br from-primary/40 via-white/30 to-secondary/40 backdrop-blur-md">
            <div className="absolute inset-0 bg-white/10" aria-hidden />
            <div ref={containerRef} className="relative z-10 h-full w-full" />
            <p className="sr-only">抽奖动画进行中，候选名单：{winnerNames}</p>
        </div>
    )
}
