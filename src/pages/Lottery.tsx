import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Trophy, Sparkles, Gift, Star } from "lucide-react";
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
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchParticipants();
    
    // 创建音频元素
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLTgjMGHm+98OKbSQ0PVqzn77ZnHQU7k9n0z38wBSaAzvLSgC8GH3G+8OWdSw0PV6vl77FcFApGod70wW8dBSt/zPLVgjEGIG++8eieSg0NWLH");
    winAudioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLTgjMGHm+98OKbSQ0PVqzn77ZnHQU7k9n0z38wBSaAzvLSgC8GH3G+8OWdSw0PV6vl77FcFApGod70wW8dBSt/zPLVgjEGIG++8eieSg0NWLH");

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (winAudioRef.current) {
        winAudioRef.current.pause();
        winAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  const fetchParticipants = async () => {
    setIsLoadingParticipants(true);

    const { data, error } = await supabase
      .from("participants")
      .select("name, student_id");

    if (error) {
      toast.error("加载失败了 😢");
      setParticipants([]);
    } else {
      setParticipants(data || []);
    }

    setIsLoadingParticipants(false);
  };

  const startLottery = () => {
    if (participants.length === 0) {
      toast.error("还没有参与的小伙伴呢 😅");
      return;
    }

    if (count > participants.length) {
      toast.error("抽取人数太多啦 🤔");
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

    toast.success("恭喜中奖啦！🎊");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <ParticleEffect show={showParticles} />
      
      {/* 装饰性元素 */}
      <div className="absolute top-10 left-10 text-6xl animate-wiggle">🎈</div>
      <div className="absolute top-20 right-20 text-6xl animate-bounce-fun">🎁</div>
      <div className="absolute bottom-20 right-10 text-6xl animate-float">🌟</div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-6 border-2 border-primary hover:border-accent hover:bg-accent hover:text-white font-bold text-lg"
          size="lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          返回首页
        </Button>

        <div className="text-center mb-8 animate-float">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Star className="h-12 w-12 text-secondary animate-rainbow-spin" fill="currentColor" />
            <div className="text-7xl animate-wiggle">🎲</div>
            <Star className="h-12 w-12 text-accent animate-rainbow-spin" fill="currentColor" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold rainbow-text mb-4 font-fredoka shine-effect">
            幸运大转盘
          </h1>
          <p className="text-2xl text-muted-foreground font-comic">
            参加人数: <span className="text-primary font-bold text-3xl">{participants.length}</span> 位小伙伴 🎊
          </p>
        </div>

        {!isRunning && winners.length === 0 && (
          <Card className="p-8 mb-8 bg-white shadow-strong border-4 border-primary/50">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Gift className="h-10 w-10 text-primary animate-wiggle" />
              <label className="text-3xl font-bold text-primary font-fredoka">
                要抽几个人呢？
              </label>
            </div>
            <Input
              type="number"
              min="1"
              max={participants.length || 1}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="text-3xl font-bold text-center border-4 border-primary/30 focus:border-primary font-fredoka h-20 mb-6"
            />
            <Button
              onClick={startLottery}
              disabled={
                isRunning || isLoadingParticipants || participants.length === 0
              }
              className="w-full text-3xl py-10 fun-gradient text-white font-bold shadow-strong hover:scale-105 transition-transform shine-effect disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Sparkles className="mr-3 h-10 w-10 animate-wiggle" />
              {isLoadingParticipants
                ? "正在加载参与者..."
                : "开始抽奖啦！"}
              <Sparkles className="ml-3 h-10 w-10 animate-wiggle" />
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
            <Card className="p-10 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur border-4 border-accent shadow-strong">
              <div className="text-center mb-8">
                <Trophy className="h-24 w-24 mx-auto text-accent animate-bounce-fun" strokeWidth={2.5} />
                <h2 className="text-5xl font-bold rainbow-text mt-6 mb-4 font-fredoka">
                  🎉 恭喜中奖 🎉
                </h2>
                <p className="text-2xl text-muted-foreground font-comic">太幸运啦！</p>
              </div>
              <div className="space-y-4">
                {winners.map((winner, index) => (
                  <div
                    key={index}
                    className="p-8 bg-white rounded-3xl border-4 border-primary shine-effect hover:scale-105 transition-transform shadow-fun"
                  >
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <span className="text-5xl">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏆"}
                      </span>
                      <p className="text-4xl font-bold rainbow-text font-fredoka">
                        {winner.name}
                      </p>
                      <span className="text-5xl">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏆"}
                      </span>
                    </div>
                    <p className="text-2xl text-center text-muted-foreground font-comic">
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
              className="w-full text-2xl py-8 rainbow-gradient text-white font-bold shadow-fun hover:shadow-strong hover:scale-105 transition-all"
            >
              <Sparkles className="mr-3 h-8 w-8" />
              再来一次！
              <Sparkles className="ml-3 h-8 w-8" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lottery;
