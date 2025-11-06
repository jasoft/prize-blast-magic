import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Trophy, Sparkles } from "lucide-react";
import { LotteryAnimation } from "@/components/LotteryAnimation";
import { ParticleEffect } from "@/components/ParticleEffect";

interface Participant {
  name: string;
  student_id: string;
}

const Lottery = () => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [count, setCount] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [showParticles, setShowParticles] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchParticipants();
    
    // 创建音频元素
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLTgjMGHm+98OKbSQ0PVqzn77ZnHQU7k9n0z38wBSaAzvLSgC8GH3G+8OWdSw0PV6vl77FcFApGod70wW8dBSt/zPLVgjEGIG++8eieSg0NWLH");
    winAudioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLTgjMGHm+98OKbSQ0PVqzn77ZnHQU7k9n0z38wBSaAzvLSgC8GH3G+8OWdSw0PV6vl77FcFApGod70wW8dBSt/zPLVgjEGIG++8eieSg0NWLH");
  }, []);

  const fetchParticipants = async () => {
    const { data, error } = await supabase
      .from("participants")
      .select("name, student_id");

    if (error) {
      toast.error("加载失败");
      return;
    }

    setParticipants(data || []);
  };

  const startLottery = () => {
    if (participants.length === 0) {
      toast.error("没有参与者");
      return;
    }

    if (count > participants.length) {
      toast.error("抽取人数超过参与者总数");
      return;
    }

    setWinners([]);
    setIsRunning(true);
    
    // 播放抽奖音效
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play();
    }
  };

  const handleComplete = async (selectedWinners: Participant[]) => {
    setIsRunning(false);
    setWinners(selectedWinners);
    setShowParticles(true);

    // 停止抽奖音效，播放中奖音效
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (winAudioRef.current) {
      winAudioRef.current.play();
    }

    // 保存到历史记录
    const historyRecords = selectedWinners.map((winner) => ({
      winner_name: winner.name,
      winner_student_id: winner.student_id,
    }));

    await supabase.from("lottery_history").insert(historyRecords);

    setTimeout(() => {
      setShowParticles(false);
    }, 5000);

    toast.success("抽奖完成！");
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <ParticleEffect show={showParticles} />
      
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-6 border-primary/50 hover:border-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>

        <div className="text-center mb-8 animate-float">
          <div className="relative inline-block">
            <div className="absolute inset-0 blur-3xl opacity-50 gold-gradient rounded-full animate-pulse-glow" />
            <h1 className="text-5xl md:text-7xl font-bold gold-text mb-4 relative shine-effect">
              🎰 幸运抽奖 🎰
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mt-4">
            参与人数: <span className="text-primary font-bold">{participants.length}</span>
          </p>
        </div>

        {!isRunning && winners.length === 0 && (
          <Card className="p-8 mb-6 bg-card/80 backdrop-blur border-primary/30">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <label className="text-xl font-bold gold-text whitespace-nowrap">
                抽取人数:
              </label>
              <Input
                type="number"
                min="1"
                max={participants.length}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="text-2xl font-bold text-center bg-background/50 border-primary/30 focus:border-primary"
              />
            </div>
            <Button
              onClick={startLottery}
              disabled={isRunning}
              className="w-full text-2xl py-8 gold-gradient font-bold glow-gold hover:glow-strong transition-all"
            >
              <Sparkles className="mr-3 h-8 w-8" />
              开始抽奖
              <Sparkles className="ml-3 h-8 w-8" />
            </Button>
          </Card>
        )}

        {isRunning && (
          <div className="space-y-6">
            <LotteryAnimation
              participants={participants}
              count={count}
              onComplete={handleComplete}
              isRunning={isRunning}
            />
          </div>
        )}

        {winners.length > 0 && (
          <div className="space-y-6 animate-bounce-in">
            <Card className="p-8 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur border-primary border-4 glow-strong">
              <div className="text-center mb-6">
                <Trophy className="h-20 w-20 mx-auto text-primary animate-pulse-glow" />
                <h2 className="text-4xl font-bold gold-text mt-4 mb-2">🎉 中奖名单 🎉</h2>
              </div>
              <div className="space-y-4">
                {winners.map((winner, index) => (
                  <div
                    key={index}
                    className="p-6 bg-card rounded-lg border-2 border-primary shine-effect"
                  >
                    <p className="text-3xl font-bold gold-text text-center">
                      {winner.name}
                    </p>
                    <p className="text-xl text-center text-muted-foreground mt-2">
                      学号: {winner.student_id}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
            <Button
              onClick={() => {
                setWinners([]);
                setCount(1);
              }}
              className="w-full text-xl py-6 gold-gradient font-bold"
            >
              再抽一次
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lottery;
