import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-float">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 blur-3xl opacity-50 gold-gradient rounded-full animate-pulse-glow" />
            <div className="text-8xl mb-4 relative animate-spin-slow inline-block">🎰</div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold gold-text mb-6 shine-effect">
            幸运大抽奖
          </h1>
          <p className="text-2xl text-muted-foreground">
            华丽的视觉效果 · 激动人心的时刻
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="p-8 bg-card/80 backdrop-blur border-primary/30 hover:border-primary transition-all hover:scale-105 cursor-pointer group"
            onClick={() => navigate("/manage")}
          >
            <div className="text-center">
              <div className="mb-6 relative">
                <div className="absolute inset-0 blur-xl opacity-50 bg-primary/30 rounded-full group-hover:opacity-70 transition-opacity" />
                <Users className="h-20 w-20 mx-auto text-primary relative group-hover:scale-110 transition-transform" />
              </div>
              <h2 className="text-3xl font-bold gold-text mb-3">参与者管理</h2>
              <p className="text-muted-foreground text-lg">
                添加、查看和管理抽奖参与者名单
              </p>
            </div>
          </Card>

          <Card
            className="p-8 gold-gradient hover:glow-strong transition-all hover:scale-105 cursor-pointer group shine-effect"
            onClick={() => navigate("/lottery")}
          >
            <div className="text-center">
              <div className="mb-6 relative">
                <div className="absolute inset-0 blur-xl opacity-50 bg-background/30 rounded-full group-hover:opacity-70 transition-opacity" />
                <Sparkles className="h-20 w-20 mx-auto text-background relative group-hover:scale-110 transition-transform animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-background mb-3">开始抽奖</h2>
              <p className="text-background/80 text-lg font-semibold">
                进入激动人心的抽奖环节
              </p>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-primary/60 text-sm">
            <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
            <span>祝您好运</span>
            <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
