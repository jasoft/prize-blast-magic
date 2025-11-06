import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import {
    LOTTERY_ANIMATION_DURATION_MS,
    LOTTERY_INITIAL_SPEED_MS,
    LOTTERY_MAX_SPEED_MS,
    LOTTERY_RESULT_DELAY_MS,
    LOTTERY_SPEED_INCREMENT_MS,
} from "@/lib/lotteryConstants"

interface LotteryAnimationProps {
    participants: Array<{ name: string; student_id: string }>
    count: number
    onComplete: (winners: Array<{ name: string; student_id: string }>) => void
    isRunning: boolean
}

export const LotteryAnimation = ({ participants, count, onComplete, isRunning }: LotteryAnimationProps) => {
    const [displayNames, setDisplayNames] = useState<string[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const speedRef = useRef(LOTTERY_INITIAL_SPEED_MS)
    const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearTimers = useCallback(() => {
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current)
            animationTimeoutRef.current = null
        }
        if (stopTimeoutRef.current) {
            clearTimeout(stopTimeoutRef.current)
            stopTimeoutRef.current = null
        }
        if (resultTimeoutRef.current) {
            clearTimeout(resultTimeoutRef.current)
            resultTimeoutRef.current = null
        }
    }, [])

    useEffect(() => {
        if (isRunning && participants.length > 0) {
            clearTimers()
            speedRef.current = LOTTERY_INITIAL_SPEED_MS

            const runAnimation = () => {
                setCurrentIndex((prev) => (prev + 1) % participants.length)
                speedRef.current = Math.min(speedRef.current + LOTTERY_SPEED_INCREMENT_MS, LOTTERY_MAX_SPEED_MS)
                animationTimeoutRef.current = setTimeout(runAnimation, speedRef.current)
            }

            animationTimeoutRef.current = setTimeout(runAnimation, speedRef.current)

            // 停止动画
            stopTimeoutRef.current = setTimeout(() => {
                clearTimers()

                // 随机选择获奖者
                const shuffled = [...participants].sort(() => Math.random() - 0.5)
                const winners = shuffled.slice(0, count)

                resultTimeoutRef.current = setTimeout(() => {
                    onComplete(winners)
                }, LOTTERY_RESULT_DELAY_MS)
            }, LOTTERY_ANIMATION_DURATION_MS)

            return () => {
                clearTimers()
            }
        }
    }, [clearTimers, count, isRunning, onComplete, participants])

    useEffect(() => {
        if (isRunning && participants.length > 0) {
            const names = Array(5)
                .fill(null)
                .map((_, i) => {
                    const index = (currentIndex + i) % participants.length
                    return participants[index]?.name || ""
                })
            setDisplayNames(names)
        }
    }, [currentIndex, isRunning, participants])

    if (!isRunning) return null

    return (
        <div className="space-y-4">
            {displayNames.map((name, index) => (
                <Card
                    key={index}
                    className={`p-8 text-center transition-all duration-300 border-4 ${
                        index === 2
                            ? "scale-110 border-accent fun-gradient shadow-strong"
                            : "scale-90 opacity-60 bg-white border-primary/30"
                    }`}>
                    <p className={`text-4xl font-bold font-fredoka ${index === 2 ? "text-white" : "rainbow-text"}`}>
                        {name}
                    </p>
                </Card>
            ))}
        </div>
    )
}
