import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface LotteryAnimationProps {
  participants: Array<{ name: string; student_id: string }>;
  count: number;
  onComplete: (winners: Array<{ name: string; student_id: string }>) => void;
  isRunning: boolean;
}

export const LotteryAnimation = ({
  participants,
  count,
  onComplete,
  isRunning,
}: LotteryAnimationProps) => {
  const [displayNames, setDisplayNames] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(50);

  useEffect(() => {
    if (isRunning && participants.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % participants.length);
        setSpeed((prev) => Math.min(prev + 5, 300));
      }, speed);

      // 停止动画
      const stopTimeout = setTimeout(() => {
        clearInterval(interval);
        
        // 随机选择获奖者
        const shuffled = [...participants].sort(() => Math.random() - 0.5);
        const winners = shuffled.slice(0, count);
        
        setTimeout(() => {
          onComplete(winners);
        }, 1000);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(stopTimeout);
      };
    }
  }, [isRunning, speed, participants, count, onComplete]);

  useEffect(() => {
    if (isRunning && participants.length > 0) {
      const names = Array(5)
        .fill(null)
        .map((_, i) => {
          const index = (currentIndex + i) % participants.length;
          return participants[index]?.name || "";
        });
      setDisplayNames(names);
    }
  }, [currentIndex, isRunning, participants]);

  if (!isRunning) return null;

  return (
    <div className="space-y-4">
      {displayNames.map((name, index) => (
        <Card
          key={index}
          className={`p-6 text-center transition-all duration-300 ${
            index === 2
              ? "scale-110 border-primary border-4 gold-gradient glow-strong"
              : "scale-90 opacity-50 bg-card/50"
          }`}
        >
          <p
            className={`text-3xl font-bold ${
              index === 2 ? "text-background" : "gold-text"
            }`}
          >
            {name}
          </p>
        </Card>
      ))}
    </div>
  );
};
